const { Formatters, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { pepperoni, deaths } = require('../dbObjects.js');
const { giveExperience, lostGame } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('battle')
		.setDescription('Challenge another Pepperoni to a deadly battle!')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("Who you want to challenge")
				.setRequired(true)),
	async execute(interaction, pepperoniTag, deaths) {
		
		//check command is correctly entered
		//assign challenger
		let challengerID = interaction.user.id;
		let challengerName = interaction.user.username;
		let challenger = interaction.user;
		
		let optionOpp = await interaction.options.getUser('user');
		let opponentID = optionOpp.id;
		let opponentName = optionOpp.username;
		
		//check if trying to battle self
		if(opponentID == challengerID){
			await interaction.reply({content:'Your Pepperoni cannot fight itself!',ephemeral: true});
			return;
		}
		
		if(optionOpp.bot){
			await interaction.reply({content: `Robots don't like fighting!`,ephemeral: true});
			return;
		}
		
		//get both pepperonis
		if(!pepperoniTag || pepperoniTag.alive == 0){
			await interaction.reply({content: `You don't have a Pepperoni! Use another command to summon one!`,ephemeral: true});
			return;
		}
		let enemyPepperoni = await pepperoni.findOne({where:{userid:opponentID}});
		if(!enemyPepperoni || enemyPepperoni.alive == 0){
			await interaction.reply({content: `Your opponent doesn't have a Pepperoni!`,ephemeral: true});
			return;
		}
		//get stats for each
		let challengerStats = await pepperoniTag.getStats(pepperoniTag);
		let opponentStats = await enemyPepperoni.getStats(enemyPepperoni);
		let challengerPersonality = await pepperoniTag.getPersonality(pepperoniTag);
		let opponentPersonality = await enemyPepperoni.getPersonality(enemyPepperoni);
		await interaction.reply(`Starting Battle`);
		//get the acceptance of battle
		const startFilter = i => i.user.id === opponentID && (i.customId === 'accept' || i.customId === 'deny');
		const accRow = new MessageActionRow()
			.addComponents(
			new MessageButton()
				.setCustomId('accept')
				.setLabel('Accept')
				.setStyle('SUCCESS'),
			new MessageButton()
				.setCustomId('deny')
				.setLabel('Deny')
				.setStyle('DANGER'),
		);
		const accCollector = await interaction.channel.createMessageComponentCollector({filter:startFilter, time: 60000});
		let noGame = true;
		await interaction.editReply({content:`${optionOpp}! You have been challenged to a DEADLY BATTLE (Losing means death!)! Click 'accept' to accept the battle, or 'deny' to refuse the battle! You have 1 min to respond!`,components:[accRow]}).then(msg => {
			accCollector.once('collect', async buttInteraction => {
				noGame = false;
				if(buttInteraction.customId == 'accept'){
					acceptRPS();
				}
				else if(buttInteraction.customId == 'deny'){
					await buttInteraction.update({content:`You have declined the game!`,components:[],files:['./images/rps/reject.png']});
					return;
				}
			});
			accCollector.once('end',async collected => {
				if(noGame){
					await interaction.editReply('Opponent didn\'t respond!').catch(e => console.log('no interaction exists'));
				}
			});
		});
		async function acceptRPS(){
			let challengerHealth = 10 + (3 * (challengerStats.level - 1));
			let opponentHealth = 10 + (3 * (opponentStats.level - 1));
			let attackToken = 0;
			let usedSpecial = [0,0];
			
			//begin battle
			interaction.editReply({content:`Fighters, check your DM's!`,components:[]});
			
			const challDM = await challenger.createDM();
			const oppDM = await optionOpp.createDM();
			
			doAttack(challenger, challDM, challengerStats, attackToken, challengerHealth, challengerPersonality, optionOpp, oppDM, opponentStats, opponentHealth, opponentPersonality);
			async function doAttack(RoundAttacker, RoundAttackerDM, RoundAttackerStats, RoundAttackerSpecial, RoundAttackerHealth, RoundAttackerPersonality, RoundDefender, RoundDefenderDM, RoundDefenderStats, RoundDefenderHealth, RoundDefenderPersonality){
				let damageCalc = 0;
				let noChall = true;
				let noOpp = true;
				const defendFilter = i => i.customId === 'defend' || i.customId === 'evade';
				const defendRow = new MessageActionRow()
					.addComponents(
					new MessageButton()
						.setCustomId('defend')
						.setLabel('Defend')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('evade')
						.setLabel('Evade')
						.setStyle('PRIMARY'),
				);
				const attackFilter = i => i.customId === 'attack' || i.customId === 'special';
				const attackRow = new MessageActionRow()
					.addComponents(
					new MessageButton()
						.setCustomId('attack')
						.setLabel('Attack')
						.setStyle('PRIMARY'),
				);
				//challenger is attacking
				if(usedSpecial[RoundAttackerSpecial] == 0){
					attackRow.addComponents(
						new MessageButton()
						.setCustomId('special')
						.setLabel('Skill')
						.setStyle('PRIMARY'),)
				}
				const attackerCollector = await RoundAttackerDM.createMessageComponentCollector({attackFilter,time:60000});
				RoundAttacker.send({content:Formatters.codeBlock(`Select an option!\nYour HP:${RoundAttackerHealth}\nATK:${RoundAttackerStats.attack} DEF:${RoundAttackerStats.defense} EVD:${RoundAttackerStats.evade}\nSkill:${RoundAttackerPersonality.special}\nDesc:${RoundAttackerPersonality.specialDescription}\nEnemy HP:${RoundDefenderHealth}\nATK:${RoundDefenderStats.attack} DEF:${RoundDefenderStats.defense} EVD:${RoundDefenderStats.evade}\nSkill:${RoundDefenderPersonality.special}\nDesc:${RoundDefenderPersonality.specialDescription}`),components:[attackRow]}).then(challMsg => {
					attackerCollector.once('collect', async bi => {
						damageCalc = 0;
						noChall = false;
						let usedSpecial = false;
						if(bi.customId == 'special'){
							usedSpecial = true;
							usedSpecial[RoundAttackerSpecial] = 1;
							let specialAttack = RoundAttackerPersonality.special;
							if(specialAttack == 'Average'){
								let statAdd = RoundAttackerStats.attack + RoundAttackerStats.defense + RoundAttackerStats.evade;
								let average = Math.ceil(statAdd / 3);
								RoundAttackerStats.attack = average;
								RoundAttackerStats.defense = average;
								RoundAttackerStats.evade = average;
							}
							else if(specialAttack == 'Peckish'){
								damageCalc = Math.floor(Math.random()*6)+3;
							}
							else if(specialAttack == 'Devoure'){
								damageCalc = Math.floor(Math.random()*6)+5;
							}
							else if(specialAttack == 'Cheer'){
								RoundDefenderStats.defense -= 1;
							}
							else if(specialAttack == 'Sob'){
								RoundDefenderStats.evade -= 1;
							}
							else if(specialAttack == 'Dirt Fling'){
								RoundDefenderStats.evade -= 2;
							}
							else if(specialAttack == 'Scrub'){
								RoundAttackerStats.evade += 2
							}
							else if(specialAttack == 'Survivalist'){
								RoundAttackerStats.defense += 2
							}
							else if(specialAttack == 'Diseased'){
								RoundAttackerStats.attack += 1;
							}
						}
						else{
							damageCalc = Math.floor(Math.random()*6)+1;
							damageCalc += RoundAttackerStats.attack;
						}
						bi.update({content:Formatters.codeBlock(`You rolled ${damageCalc} for attack! Let's see what your opponent does...`),components:[]});
						
						//start opponents choice
						const defenderCollector = await RoundDefenderDM.createMessageComponentCollector({defendFilter,time:60000});
						let filler = `Your opponent rolled a ${damageCalc}!`;
						if(usedSpecial){
							filler = `Your opponent used their special: ${RoundAttackerPersonality.special}!`;
						}
						RoundDefender.send({content:Formatters.codeBlock(`Select an option! ${filler}\nYour HP:${RoundDefenderHealth}\nATK:${RoundDefenderStats.attack} DEF:${RoundDefenderStats.defense} EVD:${RoundDefenderStats.evade}\nSkill:${RoundDefenderPersonality.special}\nDesc:${RoundDefenderPersonality.specialDescription}\nEnemy HP:${RoundAttackerHealth}\nATK:${RoundAttackerStats.attack} DEF:${RoundAttackerStats.defense} EVD:${RoundAttackerStats.evade}\nSkill:${RoundAttackerPersonality.special}\nDesc:${RoundAttackerPersonality.specialDescription}`),components:[defendRow]}).then(oppMsg => {
							defenderCollector.once('collect', async obi => {
								noOpp = false;
								let defenseAmount = Math.floor(Math.random()*6)+1;
								if(obi.customId == 'defend'){
									defenseAmount += RoundDefenderStats.defense;
									damageCalc -= defenseAmount;
									if(damageCalc <= 0)
										damageCalc = 1;
								}
								else{
									//evade
									defenseAmount += RoundDefenderStats.evade;
									if(defenseAmount > damageCalc)
										damageCalc = 0;
								}
								await bi.editReply({content:Formatters.codeBlock(`Your opponent rolled a ${defenseAmount}! You dealt ${damageCalc} damage!`),components:[]});
								await obi.update({content:Formatters.codeBlock(`You rolled a ${defenseAmount}! You took ${damageCalc} damage!`),components:[]});
								
								RoundDefenderHealth -= damageCalc;
								
								if(RoundDefenderHealth <= 0){
									//oppoenent has died
									await bi.editReply({content:Formatters.codeBlock(`Your opponent has died, you have won!`),components:[]});
									await obi.editReply({content:Formatters.codeBlock(`You have died, GAMEOVER!`),components:[]});
									if(RoundAttacker == challenger){
										await interaction.editReply({content:`${challengerName} has defeated ${opponentName}!`});
										lostGame(enemyPepperoni, optionOpp, deaths, "lostRPS");
										enemyPepperoni.save();
										let xpGain = 20;
										if(challengerStats.level < opponentStats.level)
											xpGain += (10 * (opponentStats.level - challengerStats.level));
										giveExperience(pepperoniTag, challenger, true, xpGain);
									}
									else{
										await interaction.editReply({content:`${opponentName} has defeated ${challengerName}!`});
										lostGame(pepperoniTag, challenger, deaths, "lostRPS");
										pepperoniTag.save();
										let xpGain = 20;
										if(opponentStats.level < challengerStats.level)
											xpGain += (10 * (challengerStats.level - opponentStats.level));
										giveExperience(enemyPepperoni, optionOpp, true, xpGain);
									}
									return;
								}
								
								attackToken += 1
								attackToken = attackToken % 2;
								
								doAttack(RoundDefender, RoundDefenderDM, RoundDefenderStats, attackToken, RoundDefenderHealth, RoundDefenderPersonality, RoundAttacker, RoundAttackerDM, RoundAttackerStats, RoundAttackerHealth, RoundAttackerPersonality);
							});
						});
						defenderCollector.once('end',collected => {
							if(noOpp){
								interaction.editReply(`Opponent didn't respond in time!`);
								oppMsg.delete();
							}
						});
					});
				});
				attackerCollector.once('end',collected => {
					if(noOpp){
						interaction.editReply(`Challenger didn't respond in time!`);
						challMsg.delete();
					}
				});
			}
		}
	}
}
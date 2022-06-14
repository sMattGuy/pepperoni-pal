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
		if(pepperoniTag.gaming == 1){
			await interaction.reply({content: 'You are already playing a game!',ephemeral:true});
			return;
		}
		let enemyPepperoni = await pepperoni.findOne({where:{userid:opponentID}});
		if(!enemyPepperoni || enemyPepperoni.alive == 0){
			await interaction.reply({content: `Your opponent doesn't have a Pepperoni!`,ephemeral: true});
			return;
		}
		if(enemyPepperoni.gaming == 1){
			await interaction.reply({content: 'Your opponent is  already playing a game!',ephemeral:true});
			return;
		}
		//get stats for each
		let challengerStats = await pepperoniTag.getStats(pepperoniTag);
		let opponentStats = await enemyPepperoni.getStats(enemyPepperoni);
		let challengerPersonality = await pepperoniTag.getPersonality(pepperoniTag);
		let opponentPersonality = await enemyPepperoni.getPersonality(enemyPepperoni);
		await interaction.reply(`Starting Battle`);
		pepperoniTag.gaming = 1;
		enemyPepperoni.gaming = 1;
		await pepperoniTag.save();
		await enemyPepperoni.save();
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
		const accCollector = await interaction.channel.createMessageComponentCollector({filter:startFilter, time: 60000, max:1});
		await interaction.editReply({content:`${optionOpp}! You have been challenged to a DEADLY BATTLE (Losing means death!)! Click 'accept' to accept the battle, or 'deny' to refuse the battle! You have 1 min to respond!`,components:[accRow]}).then(msg => {
			accCollector.once('collect', async buttInteraction => {
				if(buttInteraction.customId == 'accept'){
					acceptRPS();
				}
				else if(buttInteraction.customId == 'deny'){
					await buttInteraction.update({content:`You have declined the game!`,components:[],files:['./images/rps/reject.png']});
					pepperoniTag.gaming = 0;
					enemyPepperoni.gaming = 0;
					await pepperoniTag.save();
					await enemyPepperoni.save();
					return;
				}
			});
			accCollector.once('end',async collected => {
				if(collected.size == 0){
					await interaction.editReply({content:'Opponent didn\'t respond!',components:[]}).catch(e => console.log('no interaction exists'));
					pepperoniTag.gaming = 0;
					enemyPepperoni.gaming = 0;
					await pepperoniTag.save();
					await enemyPepperoni.save();
					return;
				}
			});
		});
		async function acceptRPS(){
			let challengerHealth = 10 + (3 * (challengerStats.level - 1));
			let opponentHealth = 10 + (3 * (opponentStats.level - 1));
			let attackToken = 0;
			
			let challengerSpecial = 0;
			let opponentSpecial = 0;
			
			//begin battle
			interaction.editReply({content:`Fighters, check your DM's!`,components:[]});
			
			const challDM = await challenger.createDM();
			const oppDM = await optionOpp.createDM();
			
			//global variables for battle
			let challengerPoisonAbility = 0;
			let opponentPoisonAbility = 0;
			
			let challengerBonusDefense = 0;
			let challengerBonusEvade = 0;
			
			let opponentBonusDefense = 0;
			let opponentBonusEvade = 0;
			
			doAttack(challenger, challDM, challengerStats, challengerSpecial, challengerHealth, challengerPersonality, optionOpp, oppDM, opponentStats, opponentHealth, opponentPersonality,opponentSpecial);
			async function doAttack(RoundAttacker, RoundAttackerDM, RoundAttackerStats, RoundAttackerSpecial, RoundAttackerHealth, RoundAttackerPersonality, RoundDefender, RoundDefenderDM, RoundDefenderStats, RoundDefenderHealth, RoundDefenderPersonality, RoundDefenderSpecial){
				let damageCalc = 0;
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
				if(RoundAttackerSpecial == 0 && (RoundAttackerPersonality.id != 10 || RoundAttackerPersonality.id != 11)){
					attackRow.addComponents(
						new MessageButton()
						.setCustomId('special')
						.setLabel('Skill')
						.setStyle('PRIMARY'),)
				}
				const attackerCollector = await RoundAttackerDM.createMessageComponentCollector({attackFilter,time:60000,max:1});
				RoundAttacker.send({content:Formatters.codeBlock(`Select an option!\nYour HP:${RoundAttackerHealth}\nATK:${RoundAttackerStats.attack} DEF:${RoundAttackerStats.defense} EVD:${RoundAttackerStats.evade}\nSkill:${RoundAttackerPersonality.special}\nDesc:${RoundAttackerPersonality.specialDescription}\nEnemy HP:${RoundDefenderHealth}\nATK:${RoundDefenderStats.attack} DEF:${RoundDefenderStats.defense} EVD:${RoundDefenderStats.evade}\nSkill:${RoundDefenderPersonality.special}\nDesc:${RoundDefenderPersonality.specialDescription}`),components:[attackRow]}).then(challMsg => {
					attackerCollector.once('collect', async bi => {
						damageCalc = 0;
						let usedSpecialAbility = false;
						let tempDefenseReduction = 0;
						let tempEvasionReduction = 0;
						if(bi.customId == 'special'){
							usedSpecialAbility = true;
							RoundAttackerSpecial = 1;
							let specialAttack = RoundAttackerPersonality.special;
							if(specialAttack == 'Average'){
								if(RoundAttackerStats.attack > 0)
									RoundDefenderStats.attack -= RoundAttackerStats.attack;
								if(RoundAttackerStats.defense > 0)
									RoundDefenderStats.defense -= RoundAttackerStats.defense;
								if(RoundAttackerStats.evade > 0)
									RoundDefenderStats.evade -= RoundAttackerStats.evade;
								
								RoundAttackerStats.attack = 0;
								RoundAttackerStats.defense = 0;
								RoundAttackerStats.evade = 0;
								
								damageCalc = Math.floor(Math.random()*3)+1;
								damageCalc += RoundAttackerStats.attack;
							}
							else if(specialAttack == 'Peckish'){
								damageCalc = Math.floor(Math.random()*6)+ 3 + Math.floor((RoundAttackerStats.level - 1)/2);
							}
							else if(specialAttack == 'Devoure'){
								damageCalc = Math.floor(Math.random()*6)+ 5 + Math.floor((RoundAttackerStats.level - 1)/2);
							}
							else if(specialAttack == 'Cheer'){
								tempDefenseReduction = 1 + Math.floor((RoundAttackerStats.level - 1)/2);
								damageCalc = Math.floor(Math.random()*3)+1;
								damageCalc += RoundAttackerStats.attack;
							}
							else if(specialAttack == 'Sob'){
								tempEvasionReduction = 1 + Math.floor((RoundAttackerStats.level - 1)/2);
								damageCalc = Math.floor(Math.random()*3)+1;
								damageCalc += RoundAttackerStats.attack;
							}
							else if(specialAttack == 'Dirt Cover'){
								if(RoundAttacker == challenger){
									challengerBonusDefense = 2 + challengerStats.level - 1;
								}
								else{
									opponentBonusDefense = 2 + opponentStats.level - 1;
								}
								damageCalc = Math.floor(Math.random()*3)+1;
								damageCalc += RoundAttackerStats.attack;
							}
							else if(specialAttack == 'Scrub'){
								if(RoundAttacker == challenger){
									challengerBonusEvade = 2 + challengerStats.level - 1;
								}
								else{
									opponentBonusEvade = 2 + opponentStats.level - 1;
								}
								damageCalc = Math.floor(Math.random()*3)+1;
								damageCalc += RoundAttackerStats.attack;
							}
							else if(specialAttack == 'Survivalist'){
								let escapeBattle = Math.floor(Math.random()*6)+1;
								let escaped = 1 + RoundAttackerStats.level - 1;
								if(escaped > 3)
									escaped = 3
								if(escapeBattle <= escaped){
									//escaped battle
									bi.update({content:Formatters.codeBlock(`You Escaped from the battle!`),components:[]});
									RoundDefender.send({content:Formatters.codeBlock(`Your opponent ran from the battle using their skill!`),components:[]});
									return;
								}
							}
							else if(specialAttack == 'Diseased'){
								if(RoundAttacker == challenger){
									challengerPoisonAbility = 3 + Math.floor((challengerStats.level - 1)/2);
								}
								else{
									opponentPoisonAbility = 3 + Math.floor((opponentStats.level - 1)/2);
								}
							}
						}
						else{
							damageCalc = Math.floor(Math.random()*6)+1;
							damageCalc += RoundAttackerStats.attack;
						}
						if(damageCalc < 0)
							damageCalc = 0;
						bi.update({content:Formatters.codeBlock(`You rolled ${damageCalc} for attack! Let's see what your opponent does...`),components:[]});
						
						//start opponents choice
						const defenderCollector = await RoundDefenderDM.createMessageComponentCollector({defendFilter,time:60000,max:1});
						let filler = `Your opponent rolled a ${damageCalc}!`;
						if(usedSpecialAbility){
							filler += `\nYour opponent used their special: ${RoundAttackerPersonality.special}!`;
						}
						
						//apply temp buffs
						if(tempDefenseReduction != 0){
							RoundDefenderStats.defense -= tempDefenseReduction;
						}
						if(tempEvasionReduction != 0){
							RoundDefenderStats.evade -= tempEvasionReduction;
						}
						
						if(RoundDefender == challenger && challengerBonusDefense != 0){
							RoundDefenderStats.defense += challengerBonusDefense;
						}
						else if(RoundDefender == optionOpp && opponentBonusDefense != 0){
							RoundDefenderStats.defense += opponentBonusDefense;
						}
						if(RoundDefender == challenger && challengerBonusEvade != 0){
							RoundDefenderStats.evade += challengerBonusEvade;
						}
						else if(RoundDefender == optionOpp && opponentBonusEvade != 0){
							RoundDefenderStats.evade += opponentBonusEvade;
						}
						
						RoundDefender.send({content:Formatters.codeBlock(`Select an option! ${filler}\nYour HP:${RoundDefenderHealth}\nATK:${RoundDefenderStats.attack} DEF:${RoundDefenderStats.defense} EVD:${RoundDefenderStats.evade}\nSkill:${RoundDefenderPersonality.special}\nDesc:${RoundDefenderPersonality.specialDescription}\nEnemy HP:${RoundAttackerHealth}\nATK:${RoundAttackerStats.attack} DEF:${RoundAttackerStats.defense} EVD:${RoundAttackerStats.evade}\nSkill:${RoundAttackerPersonality.special}\nDesc:${RoundAttackerPersonality.specialDescription}`),components:[defendRow]}).then(oppMsg => {
							defenderCollector.once('collect', async obi => {
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
								
								if(RoundDefender == challenger && challengerBonusDefense != 0){
									RoundDefenderStats.defense -= challengerBonusDefense;
									challengerBonusDefense = 0;
								}
								else if(RoundDefender == optionOpp && opponentBonusDefense != 0){
									RoundDefenderStats.defense -= opponentBonusDefense;
									opponentBonusDefense = 0;
								}
								
								let DefenderTurnDescription = `You rolled a ${defenseAmount}! You took ${damageCalc} damage!`;
								let AttackerTurnDescription = `Your opponent rolled a ${defenseAmount}! You dealt ${damageCalc} damage!`;
								//poison damage
								if(RoundDefender == challenger && opponentPoisonAbility != 0){
									RoundDefenderHealth -= 1
									opponentPoisonAbility -= 1;
									DefenderTurnDescription += ` You took 1 damage from Poison!`;
									AttackerTurnDescription += ` You did 1 damage from Poison!`;
								}
								else if(RoundDefender == optionOpp && challengerPoisonAbility != 0){
									RoundDefenderHealth -= 1
									challengerPoisonAbility -= 1;
									DefenderTurnDescription += ` You took 1 damage from Poison!`;
									AttackerTurnDescription += ` You did 1 damage from Poison!`;
								}
								
								await bi.editReply({content:Formatters.codeBlock(AttackerTurnDescription),components:[]});
								await obi.update({content:Formatters.codeBlock(DefenderTurnDescription),components:[]});
								
								RoundDefenderHealth -= damageCalc;
								
								//remove temp debuffs
								if(tempDefenseReduction != 0){
									RoundDefenderStats.defense += tempDefenseReduction;
									tempDefenseReduction = 0;
								}
								if(tempEvasionReduction != 0){
									RoundDefenderStats.evade += tempEvasionReduction;
									tempEvasionReduction = 0;
								}
								
								if(RoundDefender == challenger && challengerBonusDefense != 0){
									RoundDefenderStats.defense -= challengerBonusDefense;
									challengerBonusDefense = 0;
								}
								else if(RoundDefender == optionOpp && opponentBonusDefense != 0){
									RoundDefenderStats.defense -= opponentBonusDefense;
									opponentBonusDefense = 0;
								}
								if(RoundDefender == challenger && challengerBonusEvade != 0){
									RoundDefenderStats.evade -= challengerBonusEvade;
									challengerBonusEvade = 0;
								}
								else if(RoundDefender == optionOpp && opponentBonusEvade != 0){
									RoundDefenderStats.evade -= opponentBonusEvade;
									opponentBonusEvade = 0;
								}
						
								if(RoundDefenderHealth <= 0){
									//oppoenent has died
									await bi.editReply({content:Formatters.codeBlock(`Your opponent has died, you have won!`),components:[]});
									await obi.editReply({content:Formatters.codeBlock(`You have died, GAMEOVER!`),components:[]});
									pepperoniTag.gaming = 0;
									enemyPepperoni.gaming = 0;
									await pepperoniTag.save();
									await enemyPepperoni.save();

									if(RoundAttacker == challenger){
										await interaction.editReply({content:`${challengerName} has defeated ${opponentName}!`});
										await lostGame(enemyPepperoni, optionOpp, deaths, "lostBattle");
										let xpGain = 20;
										if(challengerStats.level < opponentStats.level)
											xpGain += (10 * (opponentStats.level - challengerStats.level));
										await giveExperience(pepperoniTag, challenger, true, xpGain);
									}
									else{
										await interaction.editReply({content:`${opponentName} has defeated ${challengerName}!`});
										await lostGame(pepperoniTag, challenger, deaths, "lostBattle");
										let xpGain = 20;
										if(opponentStats.level < challengerStats.level)
											xpGain += (10 * (challengerStats.level - opponentStats.level));
										await giveExperience(enemyPepperoni, optionOpp, true, xpGain);
									}
									return;
								}
								
								attackToken += 1
								attackToken = attackToken % 2;
								
								doAttack(RoundDefender, RoundDefenderDM, RoundDefenderStats, RoundDefenderSpecial, RoundDefenderHealth, RoundDefenderPersonality, RoundAttacker, RoundAttackerDM, RoundAttackerStats, RoundAttackerHealth, RoundAttackerPersonality, RoundAttackerSpecial);
							});
							defenderCollector.once('end',async collected => {
								if(collected.size == 0){
									pepperoniTag.gaming = 0;
									enemyPepperoni.gaming = 0;
									await pepperoniTag.save();
									await enemyPepperoni.save();
									oppMsg.delete()
									await interaction.editReply(`Opponent didn't respond in time!`);
									if(RoundAttacker == challenger){
										//opponent didnt respond
										lostGame(enemyPepperoni, optionOpp, deaths, "ranAway");
									}
									else{
										//challenger didnt respond
										lostGame(pepperoniTag, challenger, deaths, "ranAway");
									}
								}
							});
						});
					});
					attackerCollector.once('end',async collected => {
						if(collected.size == 0){
							interaction.editReply(`Challenger didn't respond in time!`);
							pepperoniTag.gaming = 0;
							enemyPepperoni.gaming = 0;
							await pepperoniTag.save();
							await enemyPepperoni.save();
							challMsg.delete();
							if(RoundAttacker == challenger){
								//opponent didnt respond
								lostGame(pepperoniTag, challenger, deaths, "ranAway");
							}
							else{
								//challenger didnt respond
								lostGame(enemyPepperoni, optionOpp, deaths, "ranAway");
							}
						}
					});
				});
			}
		}
	}
}

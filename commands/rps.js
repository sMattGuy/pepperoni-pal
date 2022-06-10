const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { pepperoni, deaths } = require('../dbObjects.js');
const { lostGame } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Challenge another Pepperoni to deadly RPS!')
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
			await interaction.reply({content: `Robots don't like RPS!`,ephemeral: true});
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
		
		await interaction.reply(`Starting RPS`);
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
		await interaction.editReply({content:`${optionOpp}! You have been challenged to DEADLY RPS (Losing means death!)! Click 'accept' to accept the rock paper scissors battle, or 'deny' to refuse the battle! You have 1 min to respond!`,components:[accRow]}).then(msg => {
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
					await interaction.deleteReply().catch(e => console.log('no interaction exists'));
				}
			});
		});
		async function acceptRPS(){
			//begin battle
			interaction.editReply({content:`Getting challengers throw, please wait!`,components:[]});
			const filter = i => i.customId === 'rock' || i.customId === 'paper' || i.customId === 'scissors';
			const gameRow = new MessageActionRow()
				.addComponents(
				new MessageButton()
					.setCustomId('rock')
					.setLabel('Rock')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('paper')
					.setLabel('Paper')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('scissors')
					.setLabel('Scissors')
					.setStyle('PRIMARY'),
			);
			const challDM = await challenger.createDM();
			const oppDM = await optionOpp.createDM();
			const challengerCollector = await challDM.createMessageComponentCollector({filter,time:60000});
			const opponentCollector = await oppDM.createMessageComponentCollector({filter,time:60000});
			let noChall = true;
			let noOpp = true;
			challenger.send({content:`Select a throw!`,components:[gameRow]}).then(challMsg => {
				challengerCollector.once('collect', async bi => {
					noChall = false;
					bi.update({content:`Got it, going to get opponents throw now`,components:[]});
					optionOpp.send({content:`Select a throw!`,components:[gameRow]}).then(oppMsg => {
						opponentCollector.once('collect', async obi => {
							noOpp = false;
							await bi.editReply({content:`Go back to the channel you were challenged to see who wins!`,components:[]});
							await obi.update({content:`Go back to the channel you were challenged to see who wins!`,components:[]});
							let challThrow = bi.customId;
							let oppThrow = obi.customId;
							
							if(challThrow != 'rock' && challThrow != 'scissors' && challThrow != 'paper' && oppThrow != 'rock' && oppThrow != 'scissors' && oppThrow != 'paper'){
								await interaction.editReply(`Someone didn't choose correctly, the match is canceled!`);
							}
							else if((challThrow == 'rock' && oppThrow == 'scissors')||(challThrow == 'scissors' && oppThrow == 'paper')||(challThrow == 'paper' && oppThrow == 'rock')){
								await interaction.editReply({content:`${challengerName} threw ${challThrow}, ${opponentName} threw ${oppThrow}\n${challengerName} won!`,files:[`./images/rps/rps_${challThrow}_${oppThrow}.png`]});
								
								lostGame(enemyPepperoni, optionOpp, deaths, "lostRPS");
								enemyPepperoni.save();
							}
							else if(challThrow == oppThrow){
								await interaction.editReply({content:`${challengerName} threw ${challThrow}, ${opponentName} threw ${oppThrow}\nIt's a tie!`,files:[`./images/rps/rps_${challThrow}_${oppThrow}.png`]});
								
							}
							else{
								await interaction.editReply({content:`${challengerName} threw ${challThrow}, ${opponentName} threw ${oppThrow}\n${opponentName} won!`,files:[`./images/rps/rps_${challThrow}_${oppThrow}.png`]});
								lostGame(pepperoniTag, challenger, deaths, "lostRPS");
								pepperoniTag.save();
							}
						});
						opponentCollector.once('end',collected => {
							if(noOpp){
								interaction.editReply(`Opponent didn't respond in time!`);
								oppMsg.delete();
							}
						});
					});
				});
				challengerCollector.once('end',collected => {
					if(noOpp){
						interaction.editReply(`Challenger didn't respond in time!`);
						challMsg.delete();
					}
				});
			});
		}
	}
}
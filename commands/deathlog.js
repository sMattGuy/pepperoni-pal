const { SlashCommandBuilder } = require('@discordjs/builders');
const { Formatters } = require('discord.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deathlog')
		.setDescription('Shows the deaths Pepperoni has gone through...'),
	async execute(interaction, pepperoni, deaths) {
		let results = await deaths.findAll({where:{owner: interaction.user.id}, order:[['id']]});
		let pepDeaths = JSON.parse(JSON.stringify(results, null, 2));
		if(pepDeaths.length != 0){
			await interaction.reply("Pepperoni Deaths");
			let message = "";
			for(let i=0;i<pepDeaths.length;i++){
				let deathDay = new Date(pepDeaths[i].time);
				let birthday = new Date(pepDeaths[i].birth);
				let potMessage = `${pepDeaths[i].name}, Gen. ${pepDeaths[i].generation}: ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()} - ${deathDay.getMonth()+1}/${deathDay.getDate()}/${deathDay.getFullYear()}  died from: ${pepDeaths[i].cause}, because of ${pepDeaths[i].person}\n`;
				if(potMessage.length + message.length >= 2000){
					await interaction.followUp({content:Formatters.codeBlock(message)});
					message = "";
				}
				message += potMessage;
			}
			await interaction.followUp({content:Formatters.codeBlock(message)});
		}
		else{
			await interaction.reply({content:`No Pepperoni has died! You're doing great!`});
		}
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Formatters } = require('discord.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deathlog')
		.setDescription('Shows the deaths Pepperoni has gone through...'),
	async execute(interaction, pepperoni) {
		if(pepperoni.deaths.length != 0){
			await interaction.reply("Pepperoni Deaths");
			let message = "";
			for(let i=0;i<pepperoni.deaths.length;i++){
				let deathDay = new Date(pepperoni.deaths[i].time);
				let birthday = new Date(pepperoni.deaths[i].birth);
				let potMessage = `${pepperoni.deaths[i].name}, Gen. ${pepperoni.deaths[i].generation}: ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()} - ${deathDay.getMonth()+1}/${deathDay.getDate()}/${deathDay.getFullYear()}  died from: ${pepperoni.deaths[i].cause}, because of ${pepperoni.deaths[i].person}\n`;
				if(potMessage.length + message.length >= 2000){
					interaction.followUp({content:Formatters.codeBlock(message)});
					message = "";
				}
				message += potMessage;
			}
			interaction.followUp({content:Formatters.codeBlock(message)});
		}
		else{
			interaction.reply(`No Pepperoni has died! You're doing great!`);
		}
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { createNewPepperoni, getNewEmbed} = require('../helper.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows you Pepperoni\'s stats!'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			let birthday = new Date(pepperoni.startDate);
			let personality = await pepperoni.getPersonality(pepperoni);
			let pepEmbed = getNewEmbed(pepperoni, personality.name, 'https://www.imgur.com/PRcSnWE.png', `${pepperoni.name} Stats`, `${pepperoni.name}, Gen. ${pepperoni.generation}. Born on ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()}`);
			interaction.reply({embeds:[pepEmbed]});
		}
	},
};
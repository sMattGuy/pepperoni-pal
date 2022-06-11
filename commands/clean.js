const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, hasDied, getNewEmbed } = require('../helper.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clean')
		.setDescription('Lets you clean Pepperoni!'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			pepperoni.cleanliness += Math.floor(Math.random()*6)+10;
			let personality = await pepperoni.getPersonality(pepperoni);
			
			let pepEmbed = getNewEmbed(pepperoni, personality.name, 'https://www.imgur.com/uTP7IUI.png', `Bath time!`, `${pepperoni.name} is nice and clean now!`);
			await interaction.reply({ embeds: [pepEmbed] });
			await hasDied(pepperoni, interaction, false, deaths);
		}
	},
};


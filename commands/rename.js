const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, hasDied,testClean,testHappiness,testHunger,testSick } = require('../helper.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rename')
		.setDescription('Lets you rename your Pepperoni!')
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('The new name of you pepperoni')
				.setRequired(true)),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			let newName = interaction.options.getString('name');
			
			let oldName = pepperoni.name;
			pepperoni.name = newName;
			
			//get flavor text for pepperoni
			let hunger = testHunger(pepperoni.hunger);
			let happiness = testHappiness(pepperoni.happiness);
			let cleanliness = testClean(pepperoni.cleanliness);
			let sickness = testSick(pepperoni.sick);
			//design embed
			const pepEmbed = new MessageEmbed()
				.setColor('#F099C8')
				.setTitle(`Trip to the DMV!`)
				.setDescription(`${oldName} has been renamed to ${pepperoni.name}!`)
				.setThumbnail('https://www.imgur.com/6cZYyC5.png')
				.addFields(
					{name:`Hunger`, value:`${hunger}`, inline:true},
					{name:`Happiness`, value:`${happiness}`, inline:true},
					{name:`Cleanliness`, value:`${cleanliness}`, inline:true},
					{name:`Sickness`, value:`${sickness}`, inline:true},
				);
			await interaction.reply({ embeds: [pepEmbed], ephemeral:true });	
			await hasDied(pepperoni, interaction, false, deaths);
		}
	},
};

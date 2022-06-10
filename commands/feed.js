const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, hasDied,testClean,testHappiness,testHunger,testSick } = require('../helper.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('feed')
		.setDescription('Lets you feed Pepperoni!'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			pepperoni.hunger += Math.floor(Math.random()*6)+10;
			
			//get flavor text for pepperoni
			let hunger = testHunger(pepperoni.hunger);
			let happiness = testHappiness(pepperoni.happiness);
			let cleanliness = testClean(pepperoni.cleanliness);
			let sickness = testSick(pepperoni.sick);
			//design embed
			const pepEmbed = new MessageEmbed()
				.setColor('#F099C8')
				.setTitle(`Dinner time!`)
				.setDescription(`${pepperoni.name} enjoyed a nice meal!`)
				.setThumbnail('https://www.imgur.com/6Du3IQg.png')
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

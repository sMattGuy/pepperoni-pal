const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, hasDied,testClean,testHappiness,testHunger,testSick } = require('../helper.js');
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
			
			//get flavor text for pepperoni
			let hunger = testHunger(pepperoni.hunger);
			let happiness = testHappiness(pepperoni.happiness);
			let cleanliness = testClean(pepperoni.cleanliness);
			let sickness = testSick(pepperoni.sick);
			//design embed
			const pepEmbed = new MessageEmbed()
				.setColor('#F099C8')
				.setTitle(`Bath time!`)
				.setDescription(`${pepperoni.name} is nice and clean now!`)
				.setThumbnail('https://www.imgur.com/uTP7IUI.png')
				.addFields(
					{name:`Hunger`, value:`${hunger}`, inline:true},
					{name:`Happiness`, value:`${happiness}`, inline:true},
					{name:`Cleanliness`, value:`${cleanliness}`, inline:true},
					{name:`Sickness`, value:`${sickness}`, inline:true},
				);
			await interaction.reply({ embeds: [pepEmbed],ephemeral:true });
			await hasDied(pepperoni, interaction, false, deaths);
		}
	},
};


const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, hasDied,testClean,testHappiness,testHunger,testSick } = require('../helper.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Lets you play with Pepperoni!'),
	async execute(interaction, pepperoni) {
		if(pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			//define description since this one is dynamic
			let descriptionContents = `${pepperoni.name} has fun playing, but its made him a bit dirty and hungry!`;
			//perform calculations on action
			pepperoni.hunger -= Math.floor(Math.random()*3)+1;
			pepperoni.happiness += Math.floor(Math.random()*6)+1;
			pepperoni.cleanliness -= Math.floor(Math.random()*6)+1;
			if(Math.random() <= 0.05){
				pepperoni.sick += 1;
				descriptionContents += '\n(He also seems to have a cough?)';
			}
			//get flavor text for pepperoni
			let hunger = testHunger(pepperoni.hunger);
			let happiness = testHappiness(pepperoni.happiness);
			let cleanliness = testClean(pepperoni.cleanliness);
			let sickness = testSick(pepperoni.sick);
			//design embed
			const pepEmbed = new MessageEmbed()
				.setColor('#F099C8')
				.setTitle('A day at the park!')
				.setDescription(descriptionContents)
				.setThumbnail('https://i.imgur.com/U9CQXvL.png')
				.addFields(
					{name:`Hunger`, value:`${hunger}`, inline:true},
					{name:`Happiness`, value:`${happiness}`, inline:true},
					{name:`Cleanliness`, value:`${cleanliness}`, inline:true},
					{name:`Sickness`, value:`${sickness}`, inline:true},
				);
				await interaction.reply({ embeds: [pepEmbed] });
		}
		await hasDied(pepperoni, interaction, false, interaction.user.username);
	},
};

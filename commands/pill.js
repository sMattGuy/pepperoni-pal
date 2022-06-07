const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, hasDied,testClean,testHappiness,testHunger,testSick } = require('../helper.js');
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pill')
		.setDescription('Give pepperoni a pill when he\'s feeling sick!'),
	async execute(interaction, pepperoni) {
		if(pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			if(pepperoni.sick == 0){
				interaction.reply(`Pepperoni isn't sick, so he doesn't need medicine!`);
			}
			else{
				pepperoni.sick = 0;
				pepperoni.hunger += 1;
				
				//get flavor text for pepperoni
				let hunger = testHunger(pepperoni.hunger);
				let happiness = testHappiness(pepperoni.happiness);
				let cleanliness = testClean(pepperoni.cleanliness);
				let sickness = testSick(pepperoni.sick);
				//design embed
				const pepEmbed = new MessageEmbed()
					.setColor('#F099C8')
					.setTitle(`Get well soon ${pepperoni.name}!`)
					.setDescription(`${pepperoni.name} took the cheese pill and feels better!`)
					.setThumbnail('https://i.imgur.com/K1q6bKC.png')
					.addFields(
						{name:`Hunger`, value:`${hunger}`, inline:true},
						{name:`Happiness`, value:`${happiness}`, inline:true},
						{name:`Cleanliness`, value:`${cleanliness}`, inline:true},
						{name:`Sickness`, value:`${sickness}`, inline:true},
					);
				await interaction.reply({ embeds: [pepEmbed] });	
			}
		}
		await hasDied(pepperoni, interaction, false, interaction.user.username);
	},
};

const { SlashCommandBuilder } = require('discord.js');
const { giveExperience, createNewPepperoni, hasDied, getNewEmbed, checkPepperoniSleeping } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Lets you play with Pepperoni!'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			let personality = await pepperoni.getPersonality(pepperoni);
			//define description since this one is dynamic
			let descriptionContents = `${pepperoni.name} has fun playing, but its made him a bit dirty and hungry!`;
			//perform calculations on action
			pepperoni.hunger -= Math.floor(Math.random()*10)+1;
			pepperoni.happiness += Math.floor(Math.random()*6)+10;
			pepperoni.cleanliness -= Math.floor(Math.random()*10)+1;
			if(personality.cleanlinessMod > 0){
				pepperoni.cleanliness -= Math.floor(Math.random()*5)+1;
			}
			if(personality.cleanlinessMod < 0){
				pepperoni.cleanliness += Math.floor(Math.random()*5)+1;
			}
			
			let sickChance = 0.05;
			if(personality.sickMod > 0){
				sickChance += 0.05;
			}
			if(personality.sickMod < 0){
				sickChance -= 0.04;
			}
			sickChance += (pepperoni.sick * 0.1);
			if(Math.random() <= sickChance){
				pepperoni.sick += 1;
				descriptionContents += '\n(He also seems to have a cough?)';
			}
			
			let pepEmbed = await getNewEmbed(pepperoni, personality, 'https://www.imgur.com/U9CQXvL.png', 'A day at the park!', descriptionContents);
			await interaction.reply({ embeds: [pepEmbed] });
			await hasDied(pepperoni, interaction, false, deaths);
			if(pepperoni.alive == 1){
				await giveExperience(pepperoni, interaction, false, 5);
			}
			await pepperoni.save();
		}
	},
};

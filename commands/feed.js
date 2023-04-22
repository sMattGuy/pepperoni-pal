const { SlashCommandBuilder } = require('discord.js');
const { giveExperience, createNewPepperoni, hasDied, getNewEmbed, checkPepperoniSleeping } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('feed')
		.setDescription('Lets you feed Pepperoni!'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else if(await checkPepperoniSleeping(pepperoni, interaction)){
			return;
		}
		else{
			let personality = await pepperoni.getPersonality(pepperoni);
			pepperoni.hunger += Math.floor(Math.random()*6)+10;
			if(personality.hungerMod > 0)
				pepperoni.hunger += Math.floor(Math.random()*5)+1;
			if(personality.hungerMod < 0)
				pepperoni.hunger -= Math.floor(Math.random()*5)+1;
			
			let pepEmbed = await getNewEmbed(pepperoni, personality, 'https://www.imgur.com/6Du3IQg.png', `Dinner time!`, `${pepperoni.name} enjoyed a nice meal!`);
			await interaction.reply({ embeds: [pepEmbed] });	
			await hasDied(pepperoni, interaction, false, deaths);
			if(pepperoni.alive == 1){
				await giveExperience(pepperoni, interaction, false, 5);
			}
		}
	},
};

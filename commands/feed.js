const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, hasDied, getNewEmbed } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('feed')
		.setDescription('Lets you feed Pepperoni!'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			let personality = await pepperoni.getPersonality(pepperoni);
			pepperoni.hunger += Math.floor(Math.random()*6)+10;
			if(personality.hungerMod > 0)
				pepperoni.hunger += Math.floor(Math.random()*5)+1;
			if(personality.hungerMod < 0)
				pepperoni.hunger -= Math.floor(Math.random()*5)+1;
			
			let pepEmbed = getNewEmbed(pepperoni, personality, 'https://www.imgur.com/6Du3IQg.png', `Dinner time!`, `${pepperoni.name} enjoyed a nice meal!`);
			await interaction.reply({ embeds: [pepEmbed] });	
			await hasDied(pepperoni, interaction, false, deaths);
		}
	},
};

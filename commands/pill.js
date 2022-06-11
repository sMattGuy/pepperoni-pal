const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, hasDied, getNewEmbed } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pill')
		.setDescription('Give pepperoni a pill when he\'s feeling sick!'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			if(pepperoni.sick == 0){
				interaction.reply({content:`Pepperoni isn't sick, so he doesn't need medicine!`,ephemeral:true});
			}
			else{
				let personality = await pepperoni.getPersonality(pepperoni);
				
				pepperoni.sick = 0;
				pepperoni.hunger += 1;
				if(personality.hungerMod > 0)
					pepperoni.hunger += 1;
				if(personality.hungerMod < 0)
					pepperoni.hunger -= 1;
				
				let pepEmbed = getNewEmbed(pepperoni, personality, 'https://www.imgur.com/K1q6bKC.png', `Get well soon ${pepperoni.name}!`, `${pepperoni.name} took the cheese pill and feels better!`);
				await interaction.reply({ embeds: [pepEmbed] });	
			}
			await hasDied(pepperoni, interaction, false, deaths);
		}
	},
};

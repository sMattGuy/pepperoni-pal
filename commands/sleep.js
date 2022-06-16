const { SlashCommandBuilder } = require('@discordjs/builders');
const { giveExperience, createNewPepperoni, hasDied, getNewEmbed, checkPepperoniSleeping } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sleep')
		.setDescription('Puts your Pepperoni to sleep...'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else if(await checkPepperoniSleeping(pepperoni, interaction)){
			return;
		}
		else{
			await pepperoni.startSleeping(pepperoni);
			let personality = await pepperoni.getPersonality(pepperoni);
			let pepEmbed = await getNewEmbed(pepperoni, personality, 'https://i.imgur.com/exOL68v.png', `Goodnight Pepperoni`, `${pepperoni.name} is off to bed!`);
			await interaction.reply({ embeds: [pepEmbed] });	
		}
	},
};

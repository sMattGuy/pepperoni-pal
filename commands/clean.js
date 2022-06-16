const { SlashCommandBuilder } = require('@discordjs/builders');
const { giveExperience, createNewPepperoni, hasDied, getNewEmbed, checkPepperoniSleeping } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clean')
		.setDescription('Lets you clean Pepperoni!'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
			return;
		}
		else if(await checkPepperoniSleeping(pepperoni, interaction)){
			return;
		}
		else{
			pepperoni.cleanliness += Math.floor(Math.random()*6)+10;
			let personality = await pepperoni.getPersonality(pepperoni);
			
			let pepEmbed = await getNewEmbed(pepperoni, personality, 'https://www.imgur.com/uTP7IUI.png', `Bath time!`, `${pepperoni.name} is nice and clean now!`);
			await interaction.reply({ embeds: [pepEmbed] });
			await hasDied(pepperoni, interaction, false, deaths);
			if(pepperoni.alive == 1){
				await giveExperience(pepperoni, interaction, false, 5);
			}
		}
	},
};


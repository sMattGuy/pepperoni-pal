const { SlashCommandBuilder } = require('@discordjs/builders');
const { giveExperience, createNewPepperoni, hasDied, getNewEmbed } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pet')
		.setDescription('Lets you pet Pepperoni!'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			await interaction.reply({ content:`${pepperoni.name} liked that!`, files:['./images/dance.gif']});	
		}
	},
};

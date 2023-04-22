const { SlashCommandBuilder } = require('discord.js');
const { createNewPepperoni, hasDied, getNewEmbed, checkPepperoniSleeping } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rename')
		.setDescription('Lets you rename your Pepperoni!')
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('The new name of you pepperoni')
				.setRequired(true)),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else if(await checkPepperoniSleeping(pepperoni, interaction)){
			return;
		}
		else{
			let newName = interaction.options.getString('name');
			let personality = await pepperoni.getPersonality(pepperoni);
			let oldName = pepperoni.name;
			pepperoni.name = newName;
			
			let pepEmbed = await getNewEmbed(pepperoni, personality, 'https://www.imgur.com/6cZYyC5.png', `Trip to the DMV!`, `${oldName} has been renamed to ${pepperoni.name}!`);
			await interaction.reply({ embeds: [pepEmbed] });	
			await hasDied(pepperoni, interaction, false, deaths);
		}
	},
};

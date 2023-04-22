const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Sends you see the help link!'),
	async execute(interaction, pepperoni, deaths) {
		await interaction.reply({ content:`Heres the link! https://matthewflammia.xyz/mediawiki/index.php/Pepperoni_Pal` });	
	},
};

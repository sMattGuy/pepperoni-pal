const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { createNewPepperoni, getNewEmbed} = require('../helper.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows you Pepperoni\'s stats!'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
		}
		else{
			let birthday = new Date(pepperoni.startDate);
			let personality = await pepperoni.getPersonality(pepperoni);
			let pepEmbed = getNewEmbed(pepperoni, personality, 'https://www.imgur.com/PRcSnWE.png', `${pepperoni.name} Stats`, `${pepperoni.name}, Gen. ${pepperoni.generation}. Born on ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()}`);
			
			await interaction.reply({embeds:[pepEmbed]});
			let stats = await pepperoni.getStats(pepperoni);

			let statEmbed = new MessageEmbed()
				.setColor('#F099C8')
				.setTitle('Stats')
				.addFields(
					{name:`Level`, value:`${stats.level}`, inline:true},
					{name:`Experience`, value:`${stats.experience}/${stats.nextLevel}`, inline:true},
					{name:`Attack`, value:`${stats.attack}`, inline:true},
					{name:`Defense`, value:`${stats.defense}`, inline:true},
					{name:`Evade`, value:`${stats.evade}`, inline:true},
				);
			await interaction.followUp({embeds:[statEmbed]});
		}
	},
};
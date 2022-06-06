const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { createNewPepperoni } = require('../helper.js')

const { testClean,testHappiness,testHunger,testSick } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows you Pepperoni\'s stats!'),
	async execute(interaction, pepperoni) {
		if(pepperoni.alive == 0){
			createNewPepperoni(pepperoni, interaction);
		}
		else{
			let birthday = new Date(pepperoni.startDate);
			let hunger = testHunger(pepperoni.hunger);
			let happiness = testHappiness(pepperoni.happiness);
			let cleanliness = testClean(pepperoni.cleanliness);
			let sickness = testSick(pepperoni.sick);

			const pepEmbed = new MessageEmbed()
				.setColor('#F099C8')
				.setTitle(`${pepperoni.name} Stats`)
				.setDescription(`${pepperoni.name}, Gen. ${pepperoni.generation}. Born on ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()}`)
				.addFields(
					{name:`Hunger`, value:`${hunger}`, inline:true},
					{name:`Happiness`, value:`${happiness}`, inline:true},
					{name:`Cleanliness`, value:`${cleanliness}`, inline:true},
					{name:`Sickness`, value:`${sickness}`, inline:true},
				);
				interaction.reply({embeds:[pepEmbed]});
		}
	},
};
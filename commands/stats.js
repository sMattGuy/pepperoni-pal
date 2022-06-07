const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { createNewPepperoni,testClean,testHappiness,testHunger,testSick} = require('../helper.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows you Pepperoni\'s stats!'),
	async execute(interaction, pepperoni, deaths) {
		if(pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
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
				.setThumbnail('https://i.imgur.com/PRcSnWE.png')
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
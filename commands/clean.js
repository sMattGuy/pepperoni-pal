const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, checkDeathConditions, recordDeath,testClean,testHappiness,testHunger,testSick } = require('../helper.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clean')
		.setDescription('Lets you clean Pepperoni!'),
	async execute(interaction, pepperoni) {
		if(pepperoni.alive == 0){
			createNewPepperoni(pepperoni, interaction);
		}
		else{
			pepperoni.cleanliness += Math.floor(Math.random()*4)+1;
			
			//get flavor text for pepperoni
			let hunger = testHunger(pepperoni.hunger);
			let happiness = testHappiness(pepperoni.happiness);
			let cleanliness = testClean(pepperoni.cleanliness);
			let sickness = testSick(pepperoni.sick);
			//design embed
			const pepEmbed = new MessageEmbed()
				.setColor('#F099C8')
				.setTitle(`Bath time!`)
				.setDescription(`${pepperoni.name} is nice and clean now!`)
				.setThumbnail('./images/wash.png')
				.addFields(
					{name:`Hunger`, value:`${hunger}`, inline:true},
					{name:`Happiness`, value:`${happiness}`, inline:true},
					{name:`Cleanliness`, value:`${cleanliness}`, inline:true},
					{name:`Sickness`, value:`${sickness}`, inline:true},
				);
			await interaction.reply({ embeds: [pepEmbed] });	
		}
		let death = checkDeathConditions(pepperoni);
		if(death.death){
			interaction.followUp({content:`Pepperoni has suffered from ${death.cause}. With his death, the thread of prophecy is severed. Revive Pepperoni to restore the weave of fate, or persist in the doomed world you have created.`,files:[`./images/death_${death.cause}.png`]});
			recordDeath(pepperoni, death.cause, interaction.user.username);
		}
	},
};


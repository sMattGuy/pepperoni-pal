const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const hungerLevels = ["Starving","Hungry","Satisfied","Full","Bursting"];
const happyLevels = ["Depressed","Upset","Neutral","Happy","Jovial"];
const cleanLevels = ["Filthy","Dirty","Clean","Shiny","Sparkling"];
const sickLevels = ["Normal","Sick","Fevered","Bedridden","Dying"];
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows you Pepperoni\'s stats!'),
	async execute(interaction, pepperoni) {
		if(pepperoni.alive == 0){
			await interaction.reply(`Looks like Pepperoni isn't alive right now. Let me reincarnate him quickly...`);
			createNewPepperoni(pepperoni);
			interaction.followUp({content:`The ${pepperoni.generation} pepperoni is born!`,files:['./images/born.png']});
		}
		else{
			let birthday = new Date(pepperoni.startDate);
			let hunger = testHunger(pepperoni.hunger);
			let happiness = testHappiness(pepperoni.happiness);
			let cleanliness = testClean(pepperoni.cleanliness);
			let sickness = testSick(pepperoni.sick);

			const pepEmbed = new MessageEmbed()
				.setColor('#F099C8')
				.setTitle('Pepperoni Stats')
				.setDescription(`Pepperoni Gen. ${pepperoni.generation}. Born on ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()}`)
				.addFields(
					{name:`Hunger`, value:`${hunger}`},
					{name:`Happiness`, value:`${happiness}`},
					{name:`Cleanliness`, value:`${cleanliness}`},
					{name:`Sickness`, value:`${sickness}`},
				);
				interaction.reply({embeds:[pepEmbed]});
		}
	},
};

function testHunger(value){
	if(value < 5)
		return hungerLevels[0];
	if(value < 10)
		return hungerLevels[1];
	if(value < 15)
		return hungerLevels[2];
	if(value < 25)
		return hungerLevels[3];
	if(value >=25)
		return hungerLevels[4];
}
function testHappiness(value){
	if(value < 5)
		return happyLevels[0];
	if(value < 10)
		return happyLevels[1];
	if(value < 15)
		return happyLevels[2];
	if(value < 25)
		return happyLevels[3];
	if(value >=25)
		return happyLevels[4];
}
function testClean(value){
	if(value < 5)
		return cleanLevels[0];
	if(value < 10)
		return cleanLevels[1];
	if(value < 15)
		return cleanLevels[2];
	if(value < 25)
		return cleanLevels[3];
	if(value >=25)
		return cleanLevels[4];
}
function testSick(value){
	if(value < 1)
		return sickLevels[0];
	if(value < 3)
		return sickLevels[1];
	if(value < 5)
		return sickLevels[2];
	if(value < 6)
		return sickLevels[3];
	if(value >=9)
		return sickLevels[4];
}
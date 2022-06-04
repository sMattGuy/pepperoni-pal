const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, checkDeathConditions, recordDeath } = require('../helper.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Lets you play with Pepperoni!'),
	async execute(interaction, pepperoni) {
		if(pepperoni.alive == 0){
			await interaction.reply(`Looks like Pepperoni isn't alive right now. Let me reincarnate him quickly...`);
			createNewPepperoni(pepperoni);
			interaction.followUp({content:`The ${pepperoni.generation} pepperoni is born!`,files:['./images/born.png']});
		}
		else{
			await interaction.reply({content:`Pepperoni had fun playing, but its made him a bit dirty and hungry!`,files:['./images/play.png']});
			pepperoni.hunger -= Math.floor(Math.random()*3)+1;
			pepperoni.happiness += Math.floor(Math.random()*6)+1;
			pepperoni.cleanliness -= Math.floor(Math.random()*3)+1;
			if(Math.random() <= 0.05){
				pepperoni.sick += 1;
				interaction.followUp('(He also seems to have a cough?)');
			}
		}
		let death = checkDeathConditions(pepperoni);
		if(death.death){
			interaction.followUp({content:`Pepperoni has suffered from ${death.cause}. With his death, the thread of prophecy is severed. Revive Pepperoni to restore the weave of fate, or persist in the doomed world you have created.`,files:[`./images/death_${death.cause}.png`]});
			recordDeath(pepperoni, death.cause, interaction.user.username);
		}
	},
};

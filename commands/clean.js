const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, checkDeathConditions, recordDeath } = require('../helper.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('clean')
		.setDescription('Lets you clean Pepperoni!'),
	async execute(interaction, pepperoni) {
		if(pepperoni.alive == 0){
			await interaction.reply(`Looks like Pepperoni isn't alive right now. Let me reincarnate him quickly...`);
			createNewPepperoni(pepperoni);
			interaction.followUp({content:`The ${pepperoni.generation} pepperoni is born!`,files:['./images/born.png']});
		}
		else{
			pepperoni.cleanliness += Math.floor(Math.random()*4)+1;
			pepperoni.happiness -= Math.floor(Math.random()*3)+1;
			await interaction.reply({content:`Pepperoni is a bit cleaner, but he didn't like the bath!`,files:['./images/wash.png']});
		}
		let death = checkDeathConditions(pepperoni);
		if(death.death){
			interaction.followUp({content:`Pepperoni has suffered from ${death.cause}. With his death, the thread of prophecy is severed. Revive Pepperoni to restore the weave of fate, or persist in the doomed world you have created.`,files:[`./images/death_${death.cause}.png`]});
			recordDeath(pepperoni, death.cause, interaction.user.username);
		}
	},
};


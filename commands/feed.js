const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, checkDeathConditions, recordDeath } = require('../helper.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('feed')
		.setDescription('Lets you feed Pepperoni!'),
	async execute(interaction, pepperoni) {
		if(pepperoni.alive == 0){
			await interaction.reply(`Looks like Pepperoni isn't alive right now. Let me reincarnate him quickly...`);
			createNewPepperoni(pepperoni);
			interaction.followUp({content:`The ${pepperoni.generation} pepperoni is born!`,files:['./images/born.png']});
		}
		else{
			pepperoni.hunger += Math.floor(Math.random()*5)+1;
			pepperoni.happiness += Math.floor(Math.random()*2)+1;
			await interaction.reply({content:`Pepperoni enjoyed a nice meal!`,files:['./images/eating.png']});
		}
		let death = checkDeathConditions(pepperoni);
		if(death.death){
			interaction.followUp({content:`Pepperoni has suffered from ${death.cause}. With his death, the thread of prophecy is severed. Revive Pepperoni to restore the weave of fate, or persist in the doomed world you have created.`,files:[`./images/death_${death.cause}.png`]});
			recordDeath(pepperoni, death.cause, interaction.user.username);
		}
	},
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { createNewPepperoni, checkDeathConditions, recordDeath } = require('../helper.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pill')
		.setDescription('Give pepperoni a pill when he\'s feeling sick!'),
	async execute(interaction, pepperoni) {
		if(pepperoni.alive == 0){
			await interaction.reply(`Looks like Pepperoni isn't alive right now. Let me reincarnate him quickly...`);
			createNewPepperoni(pepperoni);
			interaction.followUp({content:`The ${pepperoni.generation} pepperoni is born!`,files:['./images/born.png']});
		}
		else{
			if(pepperoni.sick == 0){
				interaction.reply(`Pepperoni isn't sick, so he doesn't need medicine!`);
			}
			else{
				pepperoni.sick = 0;
				pepperoni.hunger += 1;
				await interaction.reply({content:`Pepperoni took the cheese pill and feels better!`,files:['./images/pill.png']});
			}
		}
		let death = checkDeathConditions(pepperoni);
		if(death.death){
			interaction.followUp({content:`Pepperoni has suffered from ${death.cause}. With his death, the thread of prophecy is severed. Revive Pepperoni to restore the weave of fate, or persist in the doomed world you have created.`,files:[`./images/death_${death.cause}.png`]});
			recordDeath(pepperoni, death.cause, interaction.user.username);
		}
	},
};
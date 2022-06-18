const { SlashCommandBuilder } = require('@discordjs/builders');
const { giveExperience, createNewPepperoni, hasDied, getNewEmbed, checkPepperoniSleeping } = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wake')
		.setDescription('Wakes up your Pepperoni...'),
	async execute(interaction, pepperoni, deaths) {
		if(!pepperoni || pepperoni.alive == 0){
			await createNewPepperoni(pepperoni, interaction);
			return;
		}
		let sleepStatus = await pepperoni.checkSleeping(pepperoni);
		if(sleepStatus.sleep == 1){
			let personality = await pepperoni.getPersonality(pepperoni);
			//wake up pepperoni
			let timeDiff = Date.now() - sleepStatus.time;
			let time = 21600000 - timeDiff;
			let timeSeconds = Math.floor(time/1000);
			let timeMins = Math.floor(timeSeconds/60);
			let timeHours = Math.floor(timeMins/60);
			
			let unhappyEffect = 10 * timeHours;
			
			await pepperoni.wakeUp(pepperoni);
			pepperoni.happiness -= unhappyEffect;
			
			let xpDrain = 5 - timeHours;
			await giveExperience(pepperoni, interaction, false, xpDrain);
			let pepEmbed = await getNewEmbed(pepperoni, personality, 'https://i.imgur.com/qcr2PiR.png', `Wake up, Pepperoni!`, `${pepperoni.name} has been forced awake, this is really upsetting!`);
			await interaction.reply({ embeds: [pepEmbed] });	
			await hasDied(pepperoni, interaction, false, deaths);
		}
		else{
			await interaction.reply({content:`${pepperoni.name} isn't sleeping!`, ephemeral: true});	
		}
	},
};

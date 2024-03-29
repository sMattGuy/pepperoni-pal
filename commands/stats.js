const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createNewPepperoni, getNewEmbed} = require('../helper.js')
const { pepperoni } = require('../dbObjects.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows you Pepperoni\'s stats!'),
	async execute(interaction, pepperoniTag, deaths) {
		if(!pepperoniTag || pepperoniTag.alive == 0){
			await createNewPepperoni(pepperoniTag, interaction);
		}
		else{
			if(pepperoniTag.alive == 0){
				await interaction.reply({content:'No Pepperonis are alive!',ephemeral: true});
				return;
			}
			let birthday = new Date(pepperoniTag.startDate);
			let personality = await pepperoniTag.getPersonality(pepperoniTag);
			let pepEmbed = await getNewEmbed(pepperoniTag, personality, 'https://www.imgur.com/PRcSnWE.png', `${pepperoniTag.name} Stats`, `${pepperoniTag.name}, Gen. ${pepperoniTag.generation}. Born on ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()}`);
			
			await interaction.reply({embeds:[pepEmbed]});
			let stats = await pepperoniTag.getStats(pepperoniTag);

			let statEmbed = new EmbedBuilder()
				.setColor('#F099C8')
				.setTitle('Stats')
				.addFields(
					{name:`Level`, value:`${stats.level}`, inline:true},
					{name:`Experience`, value:`${stats.experience}/${stats.nextLevel}`, inline:true},
					{name:`Fluffliness`, value:`${stats.fluffliness}`, inline:true},
					{name:`Cuteness`, value:`${stats.cuteness}`, inline:true},
					{name:`Adoration`, value:`${stats.adoration}`, inline:true},
				);
			await interaction.followUp({embeds:[statEmbed]});
		}
	},
};

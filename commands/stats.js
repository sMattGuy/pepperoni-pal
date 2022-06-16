const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { createNewPepperoni, getNewEmbed} = require('../helper.js')
const { pepperoni } = require('../dbObjects.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows you Pepperoni\'s stats!')
		.addUserOption(option => 
			option
				.setName("user")
				.setDescription("Who you want to view")
				.setRequired(false)),
	async execute(interaction, pepperoniTag, deaths) {
		if(!pepperoniTag || pepperoniTag.alive == 0){
			await createNewPepperoni(pepperoniTag, interaction);
		}
		else{
			const target = interaction.options.getUser('user') ?? interaction.user;
			
			pepperoniTag = await pepperoni.findOne({where:{userid:target.id}});
			
			if(!pepperoniTag){
				await interaction.reply({content:'That Pepperoni doesn\'t exist!',ephemeral: true});
				return;
			}
			let birthday = new Date(pepperoniTag.startDate);
			let personality = await pepperoniTag.getPersonality(pepperoniTag);
			let pepEmbed = await getNewEmbed(pepperoniTag, personality, 'https://www.imgur.com/PRcSnWE.png', `${pepperoniTag.name} Stats`, `${pepperoniTag.name}, Gen. ${pepperoniTag.generation}. Born on ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()}`);
			
			await interaction.reply({embeds:[pepEmbed]});
			let stats = await pepperoniTag.getStats(pepperoniTag);

			let statEmbed = new MessageEmbed()
				.setColor('#F099C8')
				.setTitle('Stats')
				.addFields(
					{name:`Level`, value:`${stats.level}`, inline:true},
					{name:`Experience`, value:`${stats.experience}/${stats.nextLevel}`, inline:true},
					{name:`Attack`, value:`${stats.attack}`, inline:true},
					{name:`Defense`, value:`${stats.defense}`, inline:true},
					{name:`Evade`, value:`${stats.evade}`, inline:true},
				);
			await interaction.followUp({embeds:[statEmbed]});
		}
	},
};

const { SlashCommandBuilder, codeBlock } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deathlog')
		.setDescription('Shows the deaths Pepperoni has gone through...')
		.addIntegerOption(option => 
			option.setName('gen')
			.setDescription('The generation you want to see')
			.setMinValue(1)
			.setRequired(false)
		),
	async execute(interaction, pepperoni, deaths) {
		let gen_num = interaction.options.getInteger('gen') ?? -1;
		let results = '';
		await interaction.deferReply();
		if(gen_num == -1){
			results = await deaths.findAll({limit: 5, order:[['id','DESC']]});
			if(results.length != 0){
				let message = "Pepperoni Deaths\n";
				for(let i=0;i<results.length;i++){
					let deathDay = new Date(results[i].time);
					let birthday = new Date(results[i].birth);
					message += `${results[i].name}, Gen. ${results[i].generation}: ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()} - ${deathDay.getMonth()+1}/${deathDay.getDate()}/${deathDay.getFullYear()}  died from: ${results[i].cause}, because of ${results[i].person}\n`;
				}
				await interaction.editReply({content:codeBlock(message)});
			}
			else{
				await interaction.editReply({content:`No Pepperoni has died! You're doing great!`});
			}
		}
		else{
			results = await deaths.findOne({where:{generation: gen_num}});
			if(results){
				let deathDay = new Date(results.time);
				let birthday = new Date(results.birth);
				let message = `${results.name}, Gen. ${results.generation}: ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()} - ${deathDay.getMonth()+1}/${deathDay.getDate()}/${deathDay.getFullYear()}  died from: ${results.cause}, because of ${results.person}\n`;
				await interaction.editReply({content:codeBlock(message)});
			}
			else{
				await interaction.editReply({content:`Couldn't find that Pepperoni!`});
			}
		}
	},
};

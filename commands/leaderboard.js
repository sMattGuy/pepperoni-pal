const { SlashCommandBuilder } = require('@discordjs/builders');
const { pepperoni } = require('../dbObjects.js');
const { Formatters } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Lets you see who is best and worst!')
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('The type of leaderboard to see')
				.setRequired(true)
				.addChoices(
					{name:'Best Owner', value:'best'},
					{name:'Worst Owner', value:'worst'})),
	async execute(interaction, pepperoniTag, deaths) {
		await interaction.reply({content:`Please Wait...`});
		let boardType = interaction.options.getString('type');
		
		if(boardType == 'best'){
			let tags = await pepperoni.findAll({where:{alive:1}});
			let bestMap = new Map();
			for(let i=0;i<tags.length;i++){
				let timeAlive = Date.now() - tags[i].startDate;
				bestMap.set(tags[i].userid, timeAlive);
			}
			const sortedBoard = new Map([...bestMap.entries()].sort((a,b)=>b[1]-a[1]));
			sendBoard(sortedBoard, "Best Owner");
		}
		else{
			let tags = await deaths.findAll();
			let worstMap = new Map();
			for(let i=0;i<tags.length;i++){
				let newTotal = worstMap.get(tags[i].owner) + 1;
				if(isNaN(newTotal)){
					newTotal = 1;
				}
				worstMap.set(tags[i].owner, newTotal);
			}
			const sortedBoard = new Map([...worstMap.entries()].sort((a,b)=>b[1]-a[1]));
			sendBoard(sortedBoard, "Worst Owner");
		}
		async function sendBoard(sortedBoard, boardName){
			let leaderboardMessage = 'The Leaderboard\n';
			let position = 1;
			for(let [key, value] of sortedBoard){
				try{
					const username = await interaction.guild.members.fetch(key).then(userf => {return userf.displayName});
					if(boardName == "Best Owner"){
						let pepperoniName = await pepperoni.findOne({where:{userid:key}});
						let timeSeconds = Math.floor(value/1000);
						let timeMins = Math.floor(timeSeconds/60);
						let timeHours = Math.floor(timeMins/60);
						if(timeSeconds < 60){
							leaderboardMessage += `(${position}). ${username}, ${pepperoniName.name}: Alive Time: ${timeSeconds} seconds\n`;
						}
						else if(timeMins < 60){
							leaderboardMessage += `(${position}). ${username}, ${pepperoniName.name}: Alive Time: ${timeMins} minutes\n`;
						}
						else{
							leaderboardMessage += `(${position}). ${username}, ${pepperoniName.name}: Alive Time: ${timeHours} hours\n`;
						}
					}
					else{
						leaderboardMessage += `(${position}). ${username}: Dead: ${value} deaths\n`;
					}
					position++;
				} catch(error){
					//user not in server
				}
				if(position > 10){
					//exit and send top 10 players
					break;
				}
			}
			interaction.editReply({content:Formatters.codeBlock(`${leaderboardMessage}`) });
		}
	},
};

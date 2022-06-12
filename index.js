const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { giveExperience, hasDied, foods } = require('./helper.js');
const { pepperoni, deaths } = require('./dbObjects.js');
const cron = require('cron')

const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MEMBERS]});

const mainChannel = '119870239298027520';

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready');
});

client.on('interactionCreate', async interaction => {
	if(!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if(!command) return;
	try{
		const pepperoniTag = await pepperoni.findOne({where:{"userid":interaction.user.id}});
		await command.execute(interaction, pepperoniTag, deaths);
		if(interaction.commandName != 'deathlog' && pepperoniTag)
			pepperoniTag.save();
	} catch(error){
		console.error(error);
		await interaction.followUp({content:'There was an error with this command!',ephemeral:true});
	}
});

let hourlyDrain = new cron.CronJob('0 * * * *', async () => {
	const pepperoniTag = await pepperoni.findAll();
	for(let i=0;i<pepperoniTag.length;i++){
		if(pepperoniTag[i].alive == 1){
			try{
				let pepperoniOwner = await client.users.fetch(pepperoniTag[i].userid);
				let personality = await pepperoniTag[i].getPersonality(pepperoniTag[i]);
				let prevSickness = pepperoniTag[i].sick;
				
				let feedAmount = Math.floor(Math.random()*3)+1;
				let happyAmount = Math.floor(Math.random()*3)+1;
				
				if(personality.happinessMod > 0){
					happyAmount++;
				}
				if(personality.happinessMod < 0){
					happyAmount--;
				}
				
				pepperoniTag[i].hunger -= feedAmount;
				pepperoniTag[i].happiness -= happyAmount;
				
				let sickChance = 0.05;
				if(personality.sickMod > 0){
					sickChance += 0.05;
				}
				if(personality.sickMod < 0){
					sickChance -= 0.04;
				}
				
				if(Math.random() <= sickChance){
					pepperoniTag[i].sick++;
				}
				if(pepperoniTag[i].hunger <= 5){
					let randFood = foods[Math.floor(Math.random()*foods.length)];
					await pepperoniOwner.send(`I'm hungwy -w- I weally want some ${randFood} -w-`);
				}
				if(pepperoniTag[i].happiness <= 5){
					await pepperoniOwner.send(`I'm vewy boawed -w-`);
				}
				if(prevSickness != pepperoniTag[i].sick){
					await pepperoniOwner.send(`I fweel swick umu`);
				}
				await hasDied(pepperoniTag[i], pepperoniOwner, true, deaths);
				
				let currentTime = new Date();
				
				if(pepperoniTag[i].alive == 1 && currentTime.getHours() == 0){
					//if pepperoni still alive at 12am reward some xp
					let timeAlive = pepperoniTag[i].startDate - currentTime.valueOf();
					let timeSeconds = Math.floor(value/1000);
					let timeMins = Math.floor(timeSeconds/60);
					let timeHours = Math.floor(timeMins/60);
					let daysAlive = Math.floor(timeHours/24);
					await giveExperience(pepperoniTag[i], pepperoniOwner, true, 10*daysAlive);
				}
				pepperoniTag[i].save();
			}
			catch(err){
				console.log(err);
			}
		}
	}
});
hourlyDrain.start();
client.login(token);


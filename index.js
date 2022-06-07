const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { hasDied, foods } = require('./helper.js');
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
		const pepperoniTag = await pepperoni.findOne({where:{"activePepperoni":1}});
		await command.execute(interaction, pepperoniTag, deaths);
		pepperoniTag.save();
	} catch(error){
		console.error(error);
		await interaction.followUp({content:'There was an error with this command!',ephemeral:true});
	}
});

let hourlyDrain = new cron.CronJob('0 * * * *', async () => {
	const pepperoniTag = await pepperoni.findOne({where:{"activePepperoni":1}});
	if(pepperoniTag.alive == 1){
		pepperoniTag.hunger -= Math.floor(Math.random()*5)+1;
		pepperoniTag.happiness -= Math.floor(Math.random()*5)+1;
		if(Math.random() <= 0.05){
			pepperoniTag.sick++;
		}
		if(pepperoniTag.hunger <= 5){
			let randFood = foods[Math.floor(Math.random()*foods.length)];
			await client.channels.cache.get(mainChannel).send(`I'm hungwy -w- I weally want some ${randFood} -w-`);
		}
		if(pepperoniTag.happiness <= 5){
			await client.channels.cache.get(mainChannel).send(`I'm vewy boawed -w-`);
		}
		if(pepperoniTag.sick > 0){
			await client.channels.cache.get(mainChannel).send(`I fweel swick umu`);
		}
		
		await hasDied(pepperoniTag, client, true, "Everyone", deaths);
		
		pepperoniTag.save();
	}
});
hourlyDrain.start();
client.login(token);


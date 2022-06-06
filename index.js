const fs = require('node:fs');
const {Client, Collection, Intents} = require('discord.js');
const {token} = require('./config.json');
const { checkDeathConditions, recordDeath, foods } = require('./helper.js');
const cron = require('cron')
const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MEMBERS]});

const mainChannel = '119870239298027520';

client.commands = new Collection();

const rawpepperoni = fs.readFileSync('./pepperoni.json');
const pepperoni = JSON.parse(rawpepperoni);

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
		await command.execute(interaction, pepperoni);
		fs.writeFileSync('./pepperoni.json',JSON.stringify(pepperoni));
	} catch(error){
		console.error(error);
		await interaction.reply({content:'There was an error with this command!',ephemeral:true});
	}
});

let hourlyDrain = new cron.CronJob('0 * * * *', () => {
	if(pepperoni.alive == 1){
		pepperoni.hunger -= Math.floor(Math.random()*3)+1;
		pepperoni.happiness -= Math.floor(Math.random()*3)+1;
		if(Math.random() <= 0.05){
			pepperoni.sick++;
		}
		if(pepperoni.hunger <= 5){
			let randFood = foods[Math.floor(Math.random()*foods.length)];
			client.channels.cache.get(mainChannel).send(`I'm hungwy -w- I weally want some ${randFood} -w-`);
		}
		if(pepperoni.happiness <= 5){
			client.channels.cache.get(mainChannel).send(`I'm vewy boawed -w-`);
		}
		if(pepperoni.sick > 0){
			client.channels.cache.get(mainChannel).send(`I fweel swick umu`);
		}
		let death = checkDeathConditions(pepperoni);
		if(death.death){
			client.channels.cache.get(mainChannel).send({content:`Pepperoni has suffered from ${death.cause}. With his death, the thread of prophecy is severed. Revive Pepperoni to restore the weave of fate, or persist in the doomed world you have created.`,files:[`./images/death_${death.cause}.png`]});
			recordDeath(pepperoni, death.cause, "Everyone");
		}
		fs.writeFileSync('./pepperoni.json',JSON.stringify(pepperoni));
	}
});
hourlyDrain.start();
client.login(token);


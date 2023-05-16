const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const { token } = require('./config.json');
const { giveExperience, hasDied, foods, getNewEmbed } = require('./helper.js');
const { pepperoni, deaths } = require('./dbObjects.js');
const cron = require('cron');
const haiku = require('haiku-detect');

const client = new Client({intents:[GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent]});
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection`
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

let main_channel = '';
client.once(Events.ClientReady, async () => {
	console.log('Ready');
	main_channel = await client.guilds.fetch('119870239298027520').then(g => {return g.systemChannel});
});



client.on(Events.MessageCreate, async message => {
	if(message.content.length == 0 || message.author.bot || message.content.includes("://"))
		return;
	let foundHaiku 
	try{
		foundHaiku = haiku.detect(message.content);
	}
	catch(e){
		foundHaiku = false;
	}
	if(foundHaiku){
		let cleanHaiku = haiku.format(message.content);
		let formatedHaiku = '*' + cleanHaiku[0] + '\n' + cleanHaiku[1] + '\n' + cleanHaiku[2] + '\n\nYou wrote a haiku!*';
		message.channel.send(formatedHaiku);
	}
});
client.on(Events.InteractionCreate, async interaction => {
	if(!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if(!command) return;
	try{
		const pepperoniTag = await pepperoni.findOne({where:{id: 1}});
		await command.execute(interaction, pepperoniTag, deaths);
	} catch(error){
		console.error(error);
		await interaction.followUp({content:'There was an error with this command!',ephemeral:true});
	}
});
let hourlyDrain = new cron.CronJob('0 * * * *', async () => {
	const pepperoniTag = await pepperoni.findOne({where:{id: 1}});
	if(pepperoniTag.alive == 1){
		try{
			let personality = await pepperoniTag.getPersonality(pepperoniTag);
			let prevSickness = pepperoniTag.sick;
			
			let feedAmount = Math.floor(Math.random()*3)+1;
			let happyAmount = Math.floor(Math.random()*3)+1;
			
			if(personality.happinessMod > 0){
				happyAmount++;
			}
			if(personality.happinessMod < 0){
				happyAmount--;
			}
			
			pepperoniTag.hunger -= feedAmount;
			pepperoniTag.happiness -= happyAmount;
			
			let sickChance = 0.05;
			if(personality.sickMod > 0){
				sickChance += 0.05;
			}
			if(personality.sickMod < 0){
				sickChance -= 0.04;
			}
			sickChance += (pepperoniTag.sick * 0.1);	
			if(Math.random() <= sickChance){
				pepperoniTag.sick++;
			}
			if(pepperoniTag.hunger <= 5){
				let randFood = foods[Math.floor(Math.random()*foods.length)];
				await main_channel.send(`I'm hungwy -w- I weally want some ${randFood} -w-`);
			}
			if(pepperoniTag.happiness <= 5){
				await main_channel.send(`I'm vewy boawed -w-`);
			}
			if(prevSickness != pepperoniTag.sick){
				await main_channel.send(`I fweel swick umu`);
			}
			await hasDied(pepperoniTag, main_channel, true, deaths);
			
			let currentTime = new Date();
			
			if(pepperoniTag.alive == 1 && currentTime.getHours() == 0){
				//if pepperoni still alive at 12am reward some xp
				let timeAlive = currentTime.valueOf() - pepperoniTag.startDate;
				let timeSeconds = Math.floor(timeAlive/1000);
				let timeMins = Math.floor(timeSeconds/60);
				let timeHours = Math.floor(timeMins/60);
				let daysAlive = Math.floor(timeHours/24);
				await giveExperience(pepperoniTag, main_channel, true, 10*daysAlive);
			}
			pepperoniTag.save();
		}
		catch(err){
			console.log(err);
		}
	}
});
hourlyDrain.start();
client.login(token);


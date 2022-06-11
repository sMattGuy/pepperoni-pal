const { MessageAttachment, MessageEmbed } = require('discord.js');

/*
IMAGE LINKS
born	https://i.imgur.com/LoHGf48.png
death_dirty https://i.imgur.com/6YItYte.png
death_overfed https://i.imgur.com/1IqStfy.png
death_overwashed https://i.imgur.com/MUhjvPd.png
death_sick https://i.imgur.com/HB92e4s.png
death_starved https://i.imgur.com/vFb6u46.png
death_unhappy https://i.imgur.com/ARYRMcm.png
death_lostRPS https://i.imgur.com/2DZ1ORN.png
default https://i.imgur.com/PRcSnWE.png
eating https://i.imgur.com/6Du3IQg.png
pill https://i.imgur.com/K1q6bKC.png
play https://i.imgur.com/U9CQXvL.png
wash https://i.imgur.com/uTP7IUI.png
namechange https://i.imgur.com/6cZYyC5.png
*/

const { pepperoni } = require('./dbObjects.js');

const deathMap = new Map();
deathMap.set('dirty', 'https://www.imgur.com/6YItYte.png');
deathMap.set('overfed', 'https://www.imgur.com/1IqStfy.png');
deathMap.set('overwashed', 'https://www.imgur.com/MUhjvPd.png');
deathMap.set('sick', 'https://www.imgur.com/HB92e4s.png');
deathMap.set('starved', 'https://www.imgur.com/vFb6u46.png');
deathMap.set('unhappy', 'https://www.imgur.com/ARYRMcm.png');
deathMap.set('lostRPS', 'https://www.imgur.com/2DZ1ORN.png');

const petNames = ["Pepperoni","Dusty","Rocky","Miffy","Bosco","Walter","Chanel","Bruno","Morbius","Pebbles","Guava Flame","Poopy","Momo","Dumbass","Misty","Joji","Fred","Throwback","Cooper","Stinky","Gordon","Jessie","Steve","Ian","Gildian","Peter","Matt","Dan","Momi","Yato"];
async function createNewPepperoni(pepperoniTag, interaction){
	await interaction.reply({content:`Looks like There isn't a Pepperoni alive right now. Let me reincarnate him quickly...`});
	let generation = 1;
	if(pepperoniTag){
		generation = pepperoniTag.generation + 1;
	}
	await pepperoni.upsert({
		userid : interaction.user.id,
		alive : 1,
		name : petNames[Math.floor(Math.random()*petNames.length)],
		generation: generation,
		hunger : Math.floor(Math.random() * 5) + 12,
		happiness : Math.floor(Math.random() * 5) + 8,
		cleanliness : Math.floor(Math.random() * 5) + 8,
		sick : 0,
		startDate : Date.now()
	});
	pepperoniTag = await pepperoni.findOne({where:{userid:interaction.user.id}});

	let hunger = testHunger(pepperoniTag.hunger);
	let happiness = testHappiness(pepperoniTag.happiness);
	let cleanliness = testClean(pepperoniTag.cleanliness);
	let sickness = testSick(pepperoniTag.sick);

	const pepEmbed = new MessageEmbed()
		.setColor('#F099C8')
		.setTitle('He has risen!')
		.setDescription(`The ${pepperoniTag.generation} pepperoni, ${pepperoniTag.name} is born!`)
		.setThumbnail('https://i.imgur.com/LoHGf48.png')
		.addFields(
			{name:`Hunger`, value:`${hunger}`, inline:true},
			{name:`Happiness`, value:`${happiness}`, inline:true},
			{name:`Cleanliness`, value:`${cleanliness}`, inline:true},
			{name:`Sickness`, value:`${sickness}`, inline:true},
		);
	await interaction.followUp({ embeds: [pepEmbed]});
	pepperoniTag.save();
}
async function lostGame(pepperoniTag, interaction, deaths, gameName){
	await recordDeath(pepperoniTag, gameName, deaths, interaction, true);
	const pepEmbed = new MessageEmbed()
		.setColor('#FF2222')
		.setTitle('Game Over!')
		.setDescription(`${pepperoniTag.name} has suffered from ${gameName}. With his death, the thread of prophecy is severed. Resurect a new Pepperoni to restore the weave of fate, or persist in the doomed world you have created.`)
		.setThumbnail(deathMap.get(gameName));
	
	await interaction.send({ embeds: [pepEmbed]}).catch(err => {console.log(err)});
}
async function hasDied(pepperoniTag, interaction, hourly, deaths){
	let results = checkDeathConditions(pepperoniTag);
	if(results.death){
		await recordDeath(pepperoniTag, results.cause, deaths, interaction, hourly);
		const pepEmbed = new MessageEmbed()
			.setColor('#FF2222')
			.setTitle('Game Over!')
			.setDescription(`${pepperoniTag.name} has suffered from ${results.cause}. With his death, the thread of prophecy is severed. Resurect a new Pepperoni to restore the weave of fate, or persist in the doomed world you have created.`)
			.setThumbnail(deathMap.get(results.cause));
		
		if(hourly){
			try{
				await interaction.send({ embeds: [pepEmbed]});
			}
			catch(error){
				console.log(error)
			}
		}
		else{
			await interaction.followUp({ embeds: [pepEmbed]});
		}
	}
}
async function recordDeath(pepperoniTag, causeOfDeath, deaths, interaction, hourly){
	pepperoniTag.alive = 0;
	let userid = "";
	let username = "";
	if(hourly){
		userid = interaction.id;
		username = interaction.username;
	}
	else{
		userid = interaction.user.id;
		username = interaction.user.username;
	}
	await deaths.create({ 
		"owner":userid,
		"name":pepperoniTag.name,
		"generation":pepperoniTag.generation,
		"cause":causeOfDeath,
		"person":username,
		"birth":pepperoniTag.startDate,
		"time":Date.now()
	});
}
function checkDeathConditions(pepperoniTag){
	if(pepperoniTag.hunger <= 0){
		return {"death":true,"cause":"starved"};
	}
	else if(pepperoniTag.hunger >= 30){
		return {"death":true,"cause":"overfed"};
	}
	else if(pepperoniTag.happiness <= 0){
		return {"death":true,"cause":"unhappy"};
	}
	else if(pepperoniTag.cleanliness <= 0){
		return {"death":true,"cause":"dirty"};
	}
	else if(pepperoniTag.cleanliness >= 30){
		return {"death":true,"cause":"overwashed"};
	}
	else if(pepperoniTag.sick > 5){
		return {"death":true,"cause":"sick"};
	}
	else{
		return {"death":false,"cause":"none"};
	}
}
const foods = ["kibble and bits","slop","wetfood","dryfood","steaks","hamburger","water without any ice","mystery meat"];

const hungerLevels = ["Starving","Hungry","Satisfied","Full","Bursting"];
const happyLevels = ["Depressed","Upset","Neutral","Happy","Jovial"];
const cleanLevels = ["Filthy","Dirty","Clean","Shiny","Blinding"];
const sickLevels = ["Normal","Sick","Fevered","Bedridden","Dying"];
function testHunger(value){
	if(value < 5)
		return hungerLevels[0];
	if(value < 10)
		return hungerLevels[1];
	if(value < 15)
		return hungerLevels[2];
	if(value < 25)
		return hungerLevels[3];
	if(value >=25)
		return hungerLevels[4];
}
function testHappiness(value){
	if(value < 5)
		return happyLevels[0];
	if(value < 10)
		return happyLevels[1];
	if(value < 15)
		return happyLevels[2];
	if(value < 25)
		return happyLevels[3];
	if(value >=25)
		return happyLevels[4];
}
function testClean(value){
	if(value < 5)
		return cleanLevels[0];
	if(value < 10)
		return cleanLevels[1];
	if(value < 15)
		return cleanLevels[2];
	if(value < 25)
		return cleanLevels[3];
	if(value >=25)
		return cleanLevels[4];
}
function testSick(value){
	if(value < 1)
		return sickLevels[0];
	if(value < 2)
		return sickLevels[1];
	if(value < 3)
		return sickLevels[2];
	if(value < 4)
		return sickLevels[3];
	if(value >=5)
		return sickLevels[4];
}

module.exports = {createNewPepperoni,hasDied,foods,testClean,testHappiness,testHunger,testSick,lostGame}

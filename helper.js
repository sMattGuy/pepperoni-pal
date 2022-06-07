const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require('node:fs');
const mainChannel = '119870239298027520';
/*
IMAGE LINKS
born	https://i.imgur.com/LoHGf48.png
death_dirty https://i.imgur.com/6YItYte.png
death_overfed https://i.imgur.com/1IqStfy.png
death_overwashed https://i.imgur.com/MUhjvPd.png
death_sick https://i.imgur.com/HB92e4s.png
death_starved https://i.imgur.com/vFb6u46.png
death_unhappy https://i.imgur.com/ARYRMcm.png
default https://i.imgur.com/PRcSnWE.png
eating https://i.imgur.com/6Du3IQg.png
pill https://i.imgur.com/K1q6bKC.png
play https://i.imgur.com/U9CQXvL.png
wash https://i.imgur.com/uTP7IUI.png
*/

const deathMap = new Map();
deathMap.set('dirty', 'https://i.imgur.com/6YItYte.png');
deathMap.set('overfed', 'https://i.imgur.com/1IqStfy.png');
deathMap.set('overwashed', 'https://i.imgur.com/MUhjvPd.png');
deathMap.set('sick', 'https://i.imgur.com/HB92e4s.png');
deathMap.set('starved', 'https://i.imgur.com/vFb6u46.png');
deathMap.set('unhappy', 'https://i.imgur.com/ARYRMcm.png');

const petNames = ["Pepperoni","Dusty","Rocky","Miffy","Bosco","Walter","Chanel","Bruno","Morbius","Pebbles","Guava Flame","Poopy","Momo","Dumbass","Misty","Joji","Fred","Throwback"];
async function createNewPepperoni(pepperoni, interaction){
	await interaction.reply(`Looks like There isn't a Pepperoni alive right now. Let me reincarnate him quickly...`);
	
	pepperoni.alive = 1;
	pepperoni.name = petNames[Math.floor(Math.random()*petNames.length)];
	pepperoni.generation++;
	pepperoni.hunger = Math.floor(Math.random() * 5) + 12;
	pepperoni.happiness = Math.floor(Math.random() * 5) + 8;
	pepperoni.cleanliness = Math.floor(Math.random() * 5) + 8;
	pepperoni.sick = 0;
	pepperoni.startDate = Date.now();
	
	let hunger = testHunger(pepperoni.hunger);
	let happiness = testHappiness(pepperoni.happiness);
	let cleanliness = testClean(pepperoni.cleanliness);
	let sickness = testSick(pepperoni.sick);

	const pepEmbed = new MessageEmbed()
		.setColor('#F099C8')
		.setTitle('He has risen!')
		.setDescription(`The ${pepperoni.generation} pepperoni, ${pepperoni.name} is born!`)
		.setThumbnail('https://i.imgur.com/LoHGf48.png')
		.addFields(
			{name:`Hunger`, value:`${hunger}`, inline:true},
			{name:`Happiness`, value:`${happiness}`, inline:true},
			{name:`Cleanliness`, value:`${cleanliness}`, inline:true},
			{name:`Sickness`, value:`${sickness}`, inline:true},
		);
		await interaction.followUp({ embeds: [pepEmbed] });
		fs.writeFileSync('./pepperoni.json',JSON.stringify(pepperoni));
}
async function hasDied(pepperoni, interaction, everyonesfault, person){
	let results = checkDeathConditions(pepperoni);
	if(results.death){
		recordDeath(pepperoni, results.cause, person);
		const pepEmbed = new MessageEmbed()
			.setColor('#FF2222')
			.setTitle('Game Over!')
			.setDescription(`${pepperoni.name} has suffered from ${results.cause}. With his death, the thread of prophecy is severed. Resurect a new Pepperoni to restore the weave of fate, or persist in the doomed world you have created.`)
			.setThumbnail(deathMap.get(results.cause));
		
		if(everyonesfault){
			await interaction.channels.cache.get(mainChannel).send({ embeds: [pepEmbed] });
		}
		else{
			await interaction.followUp({ embeds: [pepEmbed] });
		}
		fs.writeFileSync('./pepperoni.json',JSON.stringify(pepperoni));
	}
}
function recordDeath(pepperoni, causeOfDeath, person){
	pepperoni.alive = 0;
	let death = {
		"name": pepperoni.name,
		"generation":pepperoni.generation,
		"cause":causeOfDeath,
		"person":person,
		"birth":pepperoni.startDate,
		"time":Date.now()
	}
	pepperoni.deaths.push(death);
}
function checkDeathConditions(pepperoni){
	if(pepperoni.hunger <= 0){
		return {"death":true,"cause":"starved"};
	}
	else if(pepperoni.hunger >= 30){
		return {"death":true,"cause":"overfed"};
	}
	else if(pepperoni.happiness <= 0){
		return {"death":true,"cause":"unhappy"};
	}
	else if(pepperoni.cleanliness <= 0){
		return {"death":true,"cause":"dirty"};
	}
	else if(pepperoni.cleanliness >= 30){
		return {"death":true,"cause":"overwashed"};
	}
	else if(pepperoni.sick > 5){
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

module.exports = {createNewPepperoni,hasDied,foods,testClean,testHappiness,testHunger,testSick}
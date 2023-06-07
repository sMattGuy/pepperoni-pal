const { EmbedBuilder } = require('discord.js');

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
dios https://i.imgur.com/iKBe2dd.png
levelup https://i.imgur.com/8n1SZ6o.png
lostBattle https://i.imgur.com/HaHoH17.png
runaway https://i.imgur.com/5YdHXUk.png
death_heartfluffliness https://i.imgur.com/aaHBM1J.png
sleeping https://i.imgur.com/exOL68v.png
*/

const { pepperoni } = require('./dbObjects.js');

const deathMap = new Map();
deathMap.set('dirty', 'https://www.imgur.com/6YItYte.png');
deathMap.set('overfed', 'https://www.imgur.com/1IqStfy.png');
deathMap.set('overwashed', 'https://www.imgur.com/MUhjvPd.png');
deathMap.set('sick', 'https://www.imgur.com/HB92e4s.png');
deathMap.set('starved', 'https://www.imgur.com/vFb6u46.png');
deathMap.set('unhappy', 'https://www.imgur.com/ARYRMcm.png');
deathMap.set('heartAttack', 'https://i.imgur.com/aaHBM1J.png');

const petNames = ["Pepperoni","Dusty","Rocky","Miffy","Bosco","Walter","Chanel","Bruno","Morbius","Pebbles","Guava Flame","Poopy","Momo","Dumbass","Misty","Joji","Fred","Throwback","Cooper","Stinky","Gordon","Jessie","Steve","Ian","Gildian","Peter","Matt","Dan","Momi","Yato"];
const pronouns = ["He","She","It"];
async function createNewPepperoni(pepperoniTag, interaction){
	await interaction.reply({content:`Looks like There isn't a Pepperoni alive right now. Let me reincarnate him quickly...`});
	let generation = 1;
	if(pepperoniTag){
		generation = pepperoniTag.generation + 1;
	}
	await pepperoni.upsert({
		id : 1,
		alive : 1,
		name : petNames[Math.floor(Math.random()*petNames.length)],
		generation: generation,
		hunger : Math.floor(Math.random() * 5) + 12,
		happiness : Math.floor(Math.random() * 5) + 8,
		cleanliness : Math.floor(Math.random() * 5) + 8,
		sick : 0,
		startDate : Date.now(),
		personality: 1,
	});
	pepperoniTag = await pepperoni.findOne({where:{id: 1}});
	await pepperoniTag.setPersonality(pepperoniTag);
	let personality = await pepperoniTag.getPersonality(pepperoniTag);
	
	let stats = await pepperoniTag.getStats(pepperoniTag);
	stats.level = 1;
	stats.experience = 0;
	stats.nextLevel = 20;
	stats.fluffliness = 0;
	stats.cuteness = 0;
	stats.adoration = 0;
	stats.save();
	let pronoun = pronouns[Math.floor(Math.random()*pronouns.length)];
	const pepEmbed = await getNewEmbed(pepperoniTag, personality, 'https://i.imgur.com/LoHGf48.png', `${pronoun} has risen!`, `The ${pepperoniTag.generation} pepperoni, ${pepperoniTag.name} is born!`);
	await interaction.followUp({ embeds: [pepEmbed]});
	pepperoniTag.save();
}
async function hasDied(pepperoniTag, interaction, hourly, deaths){
	let results = checkDeathConditions(pepperoniTag);
	if(results.death){
		await recordDeath(pepperoniTag, results.cause, deaths, interaction, hourly);
		const pepEmbed = new EmbedBuilder()
			.setColor('#FF2222')
			.setTitle('Game Over!')
			.setDescription(`${pepperoniTag.name} has suffered from ${results.cause}. With his death, the thread of prophecy is severed. Resurrect a new Pepperoni to restore the weave of fate, or persist in the doomed world you have created.`)
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
	pepperoniTag.save();
	let userid = "";
	let username = "";
	if(hourly){
		userid = interaction.id;
		username = 'everyone';
	}
	else{
		userid = interaction.user.id;
		username = interaction.user.username;
	}
	await deaths.create({ 
		"name":pepperoniTag.name,
		"generation":pepperoniTag.generation,
		"cause":causeOfDeath,
		"person":username,
		"birth":pepperoniTag.startDate,
		"time":Date.now()
	});
}
const maximumValue = 45;
function checkDeathConditions(pepperoniTag){
	if(pepperoniTag.hunger <= 0){
		return {"death":true,"cause":"starved"};
	}
	else if(pepperoniTag.hunger >= maximumValue){
		return {"death":true,"cause":"overfed"};
	}
	else if(pepperoniTag.happiness <= 0){
		return {"death":true,"cause":"unhappy"};
	}
	else if(pepperoniTag.happiness >= maximumValue){
		return {"death":true,"cause":"heartAttack"}
	}
	else if(pepperoniTag.cleanliness <= 0){
		return {"death":true,"cause":"dirty"};
	}
	else if(pepperoniTag.cleanliness >= maximumValue){
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
const happyLevels = ["Depressed","Upset","Neutral","Happy","Over Excited"];
const cleanLevels = ["Filthy","Dirty","Clean","Shiny","Blinding"];
const sickLevels = ["Normal","Sick","Fevered","Bedridden","Dying"];

function testHunger(value){
	if(value < maximumValue*0.2)
		return hungerLevels[0];
	if(value < maximumValue*0.4)
		return hungerLevels[1];
	if(value < maximumValue*0.6)
		return hungerLevels[2];
	if(value < maximumValue*0.8)
		return hungerLevels[3];
	if(value < maximumValue)
		return hungerLevels[4];
	else
		return "OVERLOAD!";
}
function testHappiness(value){
	if(value < maximumValue*0.2)
		return happyLevels[0];
	if(value < maximumValue*0.4)
		return happyLevels[1];
	if(value < maximumValue*0.6)
		return happyLevels[2];
	if(value < maximumValue*0.8)
		return happyLevels[3];
	if(value < maximumValue)
		return happyLevels[4];
	else
		return "OVERLOAD!";
}
function testClean(value){
	if(value < maximumValue*0.2)
		return cleanLevels[0];
	if(value < maximumValue*0.4)
		return cleanLevels[1];
	if(value < maximumValue*0.6)
		return cleanLevels[2];
	if(value < maximumValue*0.8)
		return cleanLevels[3];
	if(value < maximumValue)
		return cleanLevels[4];
	else
		return "OVERLOAD!";
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
	if(value >= 5)
		return sickLevels[4];
}
async function getNewEmbed(pepperoni, personality, thumbnail, title, description){
	//get flavor text for pepperoni
	let hunger = testHunger(pepperoni.hunger);
	let happiness = testHappiness(pepperoni.happiness);
	let cleanliness = testClean(pepperoni.cleanliness);
	let sickness = testSick(pepperoni.sick);
	//design embed
	const pepEmbed = new EmbedBuilder()
		.setColor('#F099C8')
		.setTitle(title)
		.setDescription(description)
		.setThumbnail(thumbnail)
		.addFields(
			{name:`Hunger`, value:`${hunger}`, inline:true},
			{name:`Happiness`, value:`${happiness}`, inline:true},
			{name:`Cleanliness`, value:`${cleanliness}`, inline:true},
			{name:`Sickness`, value:`${sickness}`, inline:true},
			{name:`Personality`, value:`${personality.name}`, inline:true},
		);
	return pepEmbed;
}
async function giveExperience(pepperoni, interaction, hourly, xpAmount){
	let stats = await pepperoni.getStats(pepperoni);
	stats.experience += xpAmount;
	if(stats.experience < 0)
		stats.experience = 0;
	if(stats.experience >= stats.nextLevel){
		//user has leveled up
		let levelsToGain = 0;
		while(stats.experience >= stats.nextLevel){
			stats.experience -= stats.nextLevel;
			stats.level += 1;
			levelsToGain += 1;
			stats.nextLevel = Math.floor(25*Math.pow(stats.level, 1.5));
		}
		for(let i=0;i<levelsToGain;i++){
			let randomStat = Math.random();
			if(randomStat <= 0.33){
				//up fluffliness
				stats.fluffliness += 1;
			}
			else if(randomStat <= 0.66){
				//up cuteness
				stats.cuteness += 1;
			}
			else{
				//up adoration
				stats.adoration += 1;
			}
		}
		if(stats.experience < 0)
			stats.experience = 0;
		const pepEmbed = new EmbedBuilder()
		.setColor('#F099C8')
		.setTitle(`Congratulations! ${pepperoni.name} has leveled up!`)
		.setThumbnail('https://i.imgur.com/8n1SZ6o.png')
		.addFields(
			{name:`Level`, value:`${stats.level}`, inline:true},
			{name:`Experience`, value:`${stats.experience}/${stats.nextLevel}`, inline:true},
			{name:`Fluffliness`, value:`${stats.fluffliness}`, inline:true},
			{name:`Cuteness`, value:`${stats.cuteness}`, inline:true},
			{name:`Adoration`, value:`${stats.adoration}`, inline:true},
		);
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
	stats.save();
}
module.exports = {giveExperience,createNewPepperoni,hasDied,foods,testClean,testHappiness,testHunger,testSick,getNewEmbed}

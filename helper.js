const petNames = ["Pepperoni","Dusty","Rocky","Miffy","Bosco","Walter","Chanel","Bruno","Morbius","Pebbles","Guava Flame","Poopy","Momo","Dumbass","Misty","Joji","Fred","Throwback"];
function createNewPepperoni(pepperoni, interaction){
	await interaction.reply(`Looks like There isn't a Pepperoni alive right now. Let me reincarnate him quickly...`);
	
	pepperoni.alive = 1;
	pepperoni.name = Math.floor(Math.random()*petNames.length);
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
		.setThumbnail('./images/born.png')
		.addFields(
			{name:`Hunger`, value:`${hunger}`, inline:true},
			{name:`Happiness`, value:`${happiness}`, inline:true},
			{name:`Cleanliness`, value:`${cleanliness}`, inline:true},
			{name:`Sickness`, value:`${sickness}`, inline:true},
		);
		await interaction.followUp({ embeds: [pepEmbed] });
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

module.exports = {createNewPepperoni,recordDeath,checkDeathConditions,foods,testClean,testHappiness,testHunger,testSick}
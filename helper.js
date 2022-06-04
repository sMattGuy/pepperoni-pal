function createNewPepperoni(pepperoni){
	pepperoni.alive = 1;
	pepperoni.generation++;
	pepperoni.hunger = Math.floor(Math.random() * 5) + 12;
	pepperoni.happiness = Math.floor(Math.random() * 5) + 8;
	pepperoni.cleanliness = Math.floor(Math.random() * 5) + 8;
	pepperoni.sick = 0;
	pepperoni.startDate = Date.now();
}
function recordDeath(pepperoni, causeOfDeath, person){
	pepperoni.alive = 0;
	let death = {
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
	else if(pepperoni.sick >= 10){
		return {"death":true,"cause":"sick"};
	}
	else{
		return {"death":false,"cause":"none"};
	}
}
const foods = ["kibble and bits","slop","wetfood","dryfood","steaks","hamburger","water without any ice","mystery meat"];

module.exports = {createNewPepperoni,recordDeath,checkDeathConditions,foods}
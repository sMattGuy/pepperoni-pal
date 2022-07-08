const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const page0 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('Welcome to PepperoniPal!')
	.setDescription(`Hello! Thank you for taking the time to own your own Pepperoni! They are fragile creatures, but the bond you share with them will bring on a long, happy life. In this short guide we will go over how to take care of a Pepperoni.`);
	
const page1 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('Commands')
	.setDescription(`Here is a list of every command in PepperoniPal`)
	.addFields(
		{name:`Basics`, value:`clean, feed, play, pill`},
		{name:`PvP`, value:`battle, rps`},
		{name:`Statistics`, value:`stats, leaderboard, deathlog`},
		{name:`Helpful`, value:`sleep, wake, rename`},
		{name:`Random`, value:`pet`},
	);
	
const page2 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('Summoning a Pepperoni')
	.setDescription(`To summon a Pepperoni, just use any command. A new Pepperoni will be reborn for you to care for! Commands that can summon a Pepperoni are clean, feed, pill, play, stats. When a new Pepperoni is born, it is typically weak, make sure to feed, clean and play with them!`);
	
const page3 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('Basic Commands')
	.setDescription(`Pepperoni's naturally get hungry and bored as time passes. To keep a Pepperoni alive, you will need to make sure it is kept full, happy, clean and disease free. Your Pepperoni will display its stats after each command, make sure not to overdo any of the commands, otherwise you risk your Pepperoni getting damaged! `)
	.addFields(
		{name:`Feed`, value:`Feeds your Pepperoni, but don't overdo it!`},
		{name:`Clean`, value:`Cleans your Pepperoni, but dont over-wash it!`},
		{name:`Play`, value:`Play with Pepperoni to make him happy, but dont overexcite him!`},
		{name:`Pill`, value:`Helps Pepperoni when sick, otherwise wont do anything.`},
	);
	
const page4 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('Progression')
	.setDescription(`As you care for your Pepperoni more, it will get stronger! After leveling up your Pepperoni will get a point in a random stat. Each Stat is self explanitory and used in battle.`);
	
const page5 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('Battle')
	.setDescription(`Even though caring for your Pepperoni is important, battling proves your dominance as the best Pepperoni Owner. By using /battle you can challenge another Pepperoni user to a fight!`)
	.addFields(
		{name:`Attack`, value:`When attacking, you can choose to Attack (Roll 1 D6 + Attack Stat), your opponent has to decide how they block this attack!`},
		{name:`Skill`, value:`You can use your Skill once in battle. Skills are determined by your Pepperoni's personality, each is different! You can read yours by using /stats. Its important to remember not all Skills are useful in battle, some effect how Pepperonis work entirely!`},
	);
	
const page6 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('Battle Defense')
	.setDescription(`When defending in a battle you have two options: You can Defend or Evade. Use your options wisely, and you'll minimize your damage and win!`)
	.addFields(
		{name:`Defend`, value:`Defending will (Roll 1 D6 + Defense Stat) this is then subtracted from the damage of the attack, but no matter what you will always take a minimum of 1 damage!`},
		{name:`Evade`, value:`Evading is more risky, (Roll 1 D6 + Evade Stat) and if its higher than the damage of the attack, you take 0 damage! But if its less than or equal, you take the full damage!`},
	);	
	
const page7 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('RPS')
	.setDescription(`Feeling more risky? You can challenge another use to Rock Paper Scissors! This is a single round, and the loser will have their Pepperoni die!`);	
	
const page8 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('Statistics')
	.setDescription(`Pepperoni's have quite a lot of information inside them, these commands help view that info.`)
	.addFields(
		{name:`Stats`, value:`/stats will give you information about you, or someone elses Pepperoni.`},
		{name:`Deaths`, value:`/deathlog will show how your Pepperoni has died over all generations, try to keep this as small as possible!`},
		{name:`Leaderboards`, value:`/leaderboard can show either the Best Owners or Worst Owners. Best being those who keep their Pepperoni alive, and worst being those who let it die.`},
		{name:`Rename`, value:`Unhappy with your Pepperoni's name? You can change it with /rename to anything you want (But be polite!)`},
	);	
	
const page9 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('Sleeping')
	.setDescription(`Pepperoni's also get tired! (not really, but YOU get tired) If you want to make sure your Pepperoni doesn't die while you sleep, use /sleep!`)
	.addFields(
		{name:`Sleep`, value:`You can put your Pepperoni to sleep for 6 hours using /sleep. During that time, your Pepperoni wont get hungry or unhappy, and will gain 1 Experience point per hour. After 6 hours your Pepperoni will wake up on its own.`},
		{name:`Wake`, value:`If you really can't wait, you can use /wake to force your Pepperoni up, but be warned, the earlier you wake up the pepperoni, the more upset he will be!`},
	);	
	
const page10 = new MessageEmbed()
	.setColor('#F099C8')
	.setTitle('Final Points')
	.setDescription(`You can pet Pepperoni with /pet.\nI truly hope you enjoy taking care of your Pepperoni, its a major acomplishment to keep it alive through constant struggle!\nIf youre interested in seeing details on updates, you can view this link:\nhttps://matthewflammia.xyz/gitweb/?p=discordBots/pepperoniPal\nThank you for playing PepperoniPal!`);	

const pages = [page0,page1,page2,page3,page4,page5,page6,page7,page8,page9,page10];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows you the ropes of owning a Pepperoni!'),
	async execute(interaction, pepperoni, deaths) {
		let pageIndex = 0;
		const flipPages = i => (i.customId === 'next' || i.customId === 'prev') && i.user.id === interaction.user.id;
		const pageCollector = await interaction.channel.createMessageComponentCollector({filter:flipPages});
		
		const nextPage = new MessageButton()
			.setCustomId('next')
			.setLabel('Next')
			.setStyle('PRIMARY')
			.setDisabled(false);
		const prevPage = new MessageButton()
			.setCustomId('prev')
			.setLabel('Previous')
			.setStyle('SECONDARY')
			.setDisabled(true);
		
		const flipRow = new MessageActionRow()
			.addComponents(
				prevPage,
				nextPage,
			);
		await interaction.reply({ embeds: [pages[pageIndex]], ephemeral: true, components: [flipRow]});
		
		pageCollector.on('collect', async buttInteraction => {
			if(buttInteraction.customId == 'next'){
				pageIndex++
				prevPage.setDisabled(false);
				if(pageIndex == pages.length-1){
					nextPage.setDisabled(true);
				}
			}
			else if(buttInteraction.customId == 'prev'){
				pageIndex--
				nextPage.setDisabled(false);
				if(pageIndex == 0){
					prevPage.setDisabled(true);
				}
			}
			await buttInteraction.update({ embeds: [pages[pageIndex]], ephemeral: true, components: [flipRow]});
		});
	},
};
/*
help menu pages
page 0 welcome page
Hello! Thank you for taking the time to own your own Pepperoni! They are fragile creatures, but the bond you share with them will bring on a long, happy life. In this short guide we will go over how to take care of a Pepperoni.

page 1 commands
clean
feed
play
pill

sleep
wake
rename

battle
rps

stats
leaderboard
deathlog

pet

page 2 summoning Pepperoni
To summon a Pepperoni, just use any command. A new Pepperoni will be reborn for you to care for! Commands that can summon a Pepperoni are clean, feed, pill, play, stats. When a new Pepperoni is born, it is typically weak, make sure to feed, clean and play with them!

page 3 basic commands
Pepperoni's naturally get hungry and bored as time passes. To keep a Pepperoni alive, you will need to make sure it is kept full, happy, clean and disease free. Your Pepperoni will display its stats after each command, make sure not to overdo any of the commands, otherwise you risk your Pepperoni getting damaged! 
/feed will feed your Pepperoni
/clean will make sure your Pepperoni stays clean
/play will keep your Pepperoni happy
/pill is only used for if Pepperoni is sick

page 4 leveling
As you care for your Pepperoni more, it will get stronger! After leveling up your Pepperoni will get a point in a random stat. Each Stat is self explanitory and used in battle.

page 5 battle
Even though caring for your Pepperoni is important, battling proves your dominance as the best Pepperoni Owner. By using /battle you can challenge another Pepperoni user to a fight!
When attacking, you can choose to Attack (Roll 1 D6 + Attack Stat)
Or you can use your Skill. Skills are determined by your Pepperoni's personality, each is different! You can read yours by using /stats
Its important to remember not all Skills are useful in battle, some effect how Pepperonis work entirely!

page 6 battle cont
When defending in a battle you have two options: You can Defend or Evade
Defending will (Roll 1 D6 + Defense Stat) this is then subtracted from the damage of the attack, but no matter what you will always take a minimum of 1 damage!
Evading is more risky, (Roll 1 D6 + Evade Stat) and if its higher than the damage of the attack, you take 0 damage! But if its less than or equal, you take the full damage!
Use your options wisely, and you'll minimize your damage and win!

page 7 RPS
Feeling more risky? You can challenge another use to Rock Paper Scissors! This is a single round, and the loser will have their Pepperoni die!

page 8 statistical
You can view your stats at anytime with /stats
You can view how many deaths your Pepperoni has gone through with /deathlog
You can see who is doing the best and the worst with /leaderboard
If you don't like your Pepperoni's name, you can use /rename to choose a new one

page 9 sleeping
You can put your Pepperoni to sleep for 6 hours using /sleep
During that time, your Pepperoni wont get hungry or unhappy, and will gain 1 Experience point per hour. After 6 hours your Pepperoni will wake up on its own.
If you really can't wait, you can use /wake to force your Pepperoni up, but be warned, the earlier you wake up the pepperoni, the more upset he will be!

page 10 final points
You can pet Pepperoni with /pet
I truly hope you enjoy taking care of your Pepperoni, its a major acomplishment to keep it alive through constant struggle!
If youre interested in seeing details on updates, you can view this link:
https://matthewflammia.xyz/gitweb/?p=discordBots/pepperoniPal

Thank you for playing PepperoniPal!
*/
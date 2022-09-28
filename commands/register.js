const { SlashCommandBuilder} = require('discord.js');
const path = require('node:path');
const { Player } = require(path.resolve("model/player.js"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription("register to be a player"),
		
	async execute(interaction) {
		let player = Player.getPlayerById(interaction.user.id);
		if(player){ // user id already in db
			await interaction.reply(`${interaction.user.tag} has registered already`);
			return;
		}
		await interaction.reply(`Welcome ${interaction.user.tag}!`);
		await interaction.followUp("Please enter a nickname for yourself\nplease note you can't change it in the future!");
		
		// get user's player name
		const filter = m => interaction.user.id === m.author.id;
		let playerName;
		await interaction.channel.awaitMessages({filter, time: 30000, max:1})
			.then(messages => {
				playerName = messages.first().content;
			})
			.catch(() => {
				interaction.followUp("No reply received, registration is not completed.");
			});
		if(!playerName)
			return;
		new Player(interaction.user.id, playerName);
		interaction.followUp(`Hello ${playerName}, 欢乐爆金币！`);
	},
};
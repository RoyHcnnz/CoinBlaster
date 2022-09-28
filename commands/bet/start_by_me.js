const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');
const { Bet } = require(path.resolve("model/bet.js"));
const { Player } = require(path.resolve("model/player.js"));

module.exports = {
	subcmd: new SlashCommandSubcommandBuilder()
			.setName('started_by_me')
			.setDescription('display the ids of all open games started by me'),

	async execute(interaction) {
		const userId = interaction.user.id;
		const player = Player.getPlayerById(userId);
		let result = "";
		const games = player.startedBet;
		if(games.length === 0){
			await interaction.reply({
				content: "You currently have no open games!", 
				ephemeral: true
			});
			return;
		}
		
		myGamesDetails = [];
		
		games.forEach( g => {
			myGamesDetails.push({
				name: g,
				value: Bet.getBetById(g).topic
			})
		})
		
		let resultEmbed = {
			color: 0xe6b800,
			title: "All Bet Games from me",
			fields: myGamesDetails,
			footer: { text: 'Coin Blaster 欢乐爆金币' }
		};
		
		await interaction.reply({ embeds: [resultEmbed], ephemeral: true });
	},
};
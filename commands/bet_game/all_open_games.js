const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');
const { Bet } = require(path.resolve("model/bet.js"));

module.exports = {
	subcmd: new SlashCommandSubcommandBuilder()
		.setName('all_open_games')
		.setDescription('display the ids of all open games'),
		
	async execute(interaction) {
		const allGames = Bet.getAllGames();
		
		let allGamesDetails = [];
		
		for(const g in allGames){
			allGamesDetails.push( {
				name: allGames[g].betId,
				value: allGames[g].topic
			} )
		}
		
		let title = "All Bet Games";
		if(allGamesDetails.length === 0){
			title = "Currenly there is no bet game going on."
		}
			
		let resultEmbed = {
			color: 0xe6b800,
			title: title,
			fields: allGamesDetails,
			footer: { text: 'Coin Blaster 欢乐爆金币' }
		};
		
		await interaction.reply({ embeds: [resultEmbed], ephemeral: true });
	},
	
	
};
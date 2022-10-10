const { SlashCommandSubcommandBuilder, userMention } = require('discord.js');
const path = require('node:path');
const Bet = require(path.resolve("model/bet.js"));

module.exports = {
	subcmd: new SlashCommandSubcommandBuilder()
		.setName('close_bet')
		.setDescription('close a bet game')
		.addStringOption(option => option
			.setName('game_id')
			.setDescription('The id of the bet game you wanna close')
			.setRequired(true))
		.addIntegerOption(option => option
			.setName('winning_option')
			.setDescription('The index of the winning option')
			.setRequired(true)),

	async execute(interaction) {
		const gameId = interaction.options.getString("game_id");
		const winningOpt = interaction.options.getInteger("winning_option") - 1;

		const game = await Bet.findById(gameId);
		if (game.creatorId != interaction.user.id) {
			await interaction.reply({
				content: "Error: Only the creator of the bet game can close the game.",
				ephemeral: true
			});
			return;
		}

		const gameTopic = game.topic;
		//const winningOptStr = game.options[winningOpt].optionName;
		const winnerList = await game.closeGame(winningOpt);
		await interaction.reply({
			content: "Game Closed."
		});
		// [{playerId, betAmount, reward, optStr}]
		winnerList.forEach(res => {
			let message = `<@${res.playerId}>`;
			if (res.reward > 0) {
				message += ` won ${res.reward} `;
			} else {
				message += ` lost ${res.betAmount} `;
			}
			message += `for betting ${res.betAmount} coins on ${res.optStr} in the game ${gameTopic}.`;
			interaction.followUp(message);
		})

		/*
		await interaction.reply({
			content: "Successfully bet " + betAmount + " coins on " + betOptString + " regarding on " + game.topic + " \nGood Luck", 
			ephemeral: true
		});
		*/
	},
};
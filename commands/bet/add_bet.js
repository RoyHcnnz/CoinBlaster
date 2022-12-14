const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');
const Bet = require(path.resolve("model/bet.js"));
const Player = require(path.resolve("model/player.js"));

module.exports = {
	subcmd: new SlashCommandSubcommandBuilder()
		.setName('add_bet')
		.setDescription('bet on a game')
		.addStringOption(option => option
			.setName('gameid')
			.setDescription('The id of the bet game')
			.setRequired(true))
		.addIntegerOption(option => option
			.setName('option')
			.setDescription('The index of the option you want to bet on')
			.setRequired(true))
		.addIntegerOption(option => option
			.setName('amount')
			.setDescription('how many coins you wanna bet')
			.setRequired(true)),

	async execute(interaction) {
		const gameId = interaction.options.getString("gameid");
		const betOptIdx = interaction.options.getInteger("option") - 1;
		const betAmount = interaction.options.getInteger("amount");

		if (betAmount < 0) {
			const pName = await Player.getName(interaction.user.id);
			await interaction.reply({
				content: "Nice try " + pName + ", nice try.",
			});
			return;
		}

		if (betAmount === 0) {
			await interaction.reply({
				content: "穷逼滚粗！",
			});
			return;
		}

		let game = await Bet.findById(gameId);
		try {
			await game.addBetToGame(interaction.user.id, betOptIdx, betAmount);
		} catch (e) {
			await interaction.reply({
				content: "Error: " + e,
				ephemeral: true
			});
			return;
		}
		await game.save();
		// reply 
		const betOptString = game.options[betOptIdx].optionName;
		await interaction.reply({
			content: `<@${interaction.user.id}>` + " successfully bet "
				+ betAmount + " coins on " + betOptString + " regarding on "
				+ game.topic + " \nGood Luck"
		});
	},
};
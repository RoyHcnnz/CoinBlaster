const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');
const Bet = require(path.resolve("model/bet.js"));

module.exports = {
	subcmd: new SlashCommandSubcommandBuilder()
		.setName('display')
		.setDescription('display details a bet game')
		.addStringOption(option => option
			.setName('game_id')
			.setDescription('The id of the bet game you wanna display')
			.setRequired(true)),

	async execute(interaction) {
		const betId = interaction.options.getString("game_id");

		const game = await Bet.findById(betId);
		const betInfoEmbed = game.getBetInfoEmbed();
		await interaction.reply({ embeds: [betInfoEmbed] });
	},
};
const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');
const { Bet } = require(path.resolve("model/bet.js"));

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
		
		let betInfoEmbed = Bet.getBetInfoEmbed(betId);
		await interaction.reply({ embeds: [betInfoEmbed] });
		
	},
};
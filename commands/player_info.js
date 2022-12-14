const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const Player = require(path.resolve("model/player.js"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('player_info')
		.setDescription("shows player's profile")
		.addUserOption(option =>
			option.setName("player")
				.setDescription('The player you want to check profile')
				.setRequired(true)
		),
	async execute(interaction) {
		let targetUser = interaction.options.getUser('player');
		const player = await Player.findById(targetUser.id);
		await interaction.reply({ embeds: [player.getPlayerInfoEmbed()] });
	},
};
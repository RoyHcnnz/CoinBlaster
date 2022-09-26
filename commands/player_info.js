const { SlashCommandBuilder} = require('discord.js');
const path = require('node:path');
const { getPlayerById } = require(path.resolve('middleware/playerDBHandler.js'));
const { Player } = require(path.resolve("model/player.js"));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('player_info')
		.setDescription("shows player's profile")
		.addUserOption(option =>
			option.setName("player")
				.setDescription('The player you want to check time')
				.setRequired(true)
		),
	async execute(interaction) {
		let targetUser = interaction.options.getUser('player');
		
		let player = getPlayerById(targetUser.id);
		if(!player){
			await interaction.reply(`${targetUser.tag} has not registered`);
			return;
		}
		// print player info
		
		await interaction.reply(Player.info(player));
	},
};
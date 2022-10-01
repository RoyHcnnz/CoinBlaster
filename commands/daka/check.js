const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');
const { Player } = require(path.resolve("model/player.js"));

module.exports = {
	subcmd: new SlashCommandSubcommandBuilder()
		.setName('check')
		.setDescription('check if a player 打卡了没有')
		.addUserOption(option => option
			.setName('target')
			.setDescription('The user you wanna check')
			.setRequired(true)),

	async execute(interaction) {
		const playerId = interaction.options.getUser("target").id;
		if(!Player.getPlayerById(playerId)){
			interaction.reply(`The user you are checking has not registered yet.`);
		}
		if(Player.checkPunchInToday(playerId)){
			interaction.reply(`<@${playerId}> has already done some good job today.`);
		}else{
			interaction.reply(`<@${playerId}> has been lazy today. <@${interaction.user}> is watching you :eyes:`);
		}
		
	},
};
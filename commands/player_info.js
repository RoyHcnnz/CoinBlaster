const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const { getPlayerById } = require(path.resolve('middleware/playerDBHandler.js'));
const { Player } = require(path.resolve("model/player.js"));

function getPlayerInfoEmbed(player){
	return new EmbedBuilder()
		.setColor(0xe6b800)
		.setTitle(`${player.playerName}'s profile`)
		//.setDescription('Some description here')
		.addFields(
			{ name: '\:coin:', value: `${player.coin}`, inline: true },
			{ name: '\:hot_face:', value: `${player.rep}`, inline: true },
		)
		.setFooter({ text: 'Coin Blaster 欢乐爆金币' });
}

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
		
		await interaction.reply({ embeds: [getPlayerInfoEmbed(player)] });
	},
};
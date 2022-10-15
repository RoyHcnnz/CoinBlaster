const { SlashCommandBuilder, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// 1. create subcmd builder feed .setSubcommand
//		check all file in bet_game folder and addSubcmd tp slashCmd
// 2. create collection for execute 
let slashCmd = new SlashCommandBuilder()
	.setName('bet')
	.setDescription("create or participate or view bet games");

let subcmdCollection = new Collection();
const subcommandsPath = path.resolve('commands/bet/');
const subcommandFiles = fs.readdirSync(subcommandsPath).filter(file => file.endsWith('.js'));

for (const subcmdfile of subcommandFiles) {
	const filePath = path.join(subcommandsPath, subcmdfile);
	const subcommand = require(filePath);

	subcmdCollection.set(subcommand.subcmd.name, subcommand);
	slashCmd.addSubcommand(subcommand.subcmd);
}

module.exports = {
	data: slashCmd,

	async execute(interaction) {
		let subcmdName = interaction.options.getSubcommand();
		let subcmd = subcmdCollection.get(subcmdName);
		await subcmd.execute(interaction);
	},
};

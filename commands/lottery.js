const { SlashCommandBuilder, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

let slashCmd = new SlashCommandBuilder()
    .setName('lottery')
    .setDescription("buy a lottery ticket or check info about lottery");

let subcmdCollection = new Collection();
const subcommandsPath = path.resolve('commands/lottery/');
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

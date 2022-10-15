const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');
const Lottery = require(path.resolve("model/lottery.js"));

module.exports = {
    subcmd: new SlashCommandSubcommandBuilder()
        .setName('my')
        .setDescription('list all my lottery tickets'),

    async execute(interaction) {

        const list = await Lottery.listTickets(interaction.user.id);
        let res = "";
        if (list) {
            list.forEach(ele => {
                res += ele.ticket + " x " + ele.multiplier + "\n";
            });
        } else {
            res = "You don't have any lottery tickets."
        }
        await interaction.reply({
            content: res
        });

    },
};
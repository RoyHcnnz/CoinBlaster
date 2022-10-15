const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');
const Lottery = require(path.resolve("model/lottery.js"));

module.exports = {
    subcmd: new SlashCommandSubcommandBuilder()
        .setName('buy')
        .setDescription('buy a lottery ticket')
        .addIntegerOption(option => option
            .setName('number1')
            .setDescription('pick a number from 64 to 89')
            .setMinValue(64)
            .setMaxValue(89))
        .addIntegerOption(option => option
            .setName('number2')
            .setDescription('pick a number from 64 to 89')
            .setMinValue(64)
            .setMaxValue(89))
        .addIntegerOption(option => option
            .setName('number3')
            .setDescription('pick a number from 64 to 89')
            .setMinValue(64)
            .setMaxValue(89))
        .addIntegerOption(option => option
            .setName('multiplier')
            .setDescription('add a multiplier for your ticket')
            .setMinValue(1)),

    async execute(interaction) {
        let n1 = interaction.options.getInteger('number1');
        let n2 = interaction.options.getInteger('number2');
        let n3 = interaction.options.getInteger('number3');
        let m = interaction.options.getInteger('multiplier');
        if (typeof m !== 'number') {
            m = 1;
        }

        let t;
        //player.save();
        try {
            t = await Lottery.buyTicket(interaction.user.id
                , [n1, n2, n3], m);
        } catch (e) {
            await interaction.reply({
                content: "Error: " + e,
                ephemeral: true
            });
            return;
        }

        await interaction.reply({
            content: `<@${interaction.user.id}>` + " successfully bought "
                + t.ticket + " x " + m + " for " + t.cost + " coins"
        });

    },
};
const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');
const Lottery = require(path.resolve("model/lottery.js"));

module.exports = {
    subcmd: new SlashCommandSubcommandBuilder()
        .setName('info')
        .setDescription('info about the next lottery game'),

    async execute(interaction) {

        const timeInMs = await Lottery.timeToNext();
        const poolVol = await Lottery.getPool();
        const hour = Math.floor(timeInMs / 1000 / 60 / 60);
        const min = Math.floor((timeInMs % (1000 * 60 * 60)) / 1000 / 60);
        const sec = Math.floor((timeInMs % (1000 * 60)) / 1000);

        await interaction.reply(
            `距离下次开奖还${hour}小时${min}分钟${sec}秒，奖池中现有${poolVol}金币`
        );

    },
};
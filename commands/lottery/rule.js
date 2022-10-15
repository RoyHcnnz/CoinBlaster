const { EmbedBuilder } = require('discord.js');
const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');

module.exports = {
    subcmd: new SlashCommandSubcommandBuilder()
        .setName('rule')
        .setDescription('规则介绍'),

    async execute(interaction) {
        let rply = new EmbedBuilder()
            .setColor(0xe6b800)
            .setTitle("彩票规则")
            .setDescription('每注彩票包含从64到89中的三个数字，每注价格2个coin。')
            .addFields(
                {
                    name: '奖项',
                    value: "\t三等奖：一个数字与中奖数字相同，奖金3个coin\n"
                        + "\t二等奖：两个数字与中奖数字相同，奖金10个coin\n"
                        + "\t一等奖：三个数字与中奖数字都相同，奖金1700个coin 另加奖池奖金\n"
                },
                {
                    name: '如何购买',
                    value: "使用 /lottery buy 命令购买彩票\n"
                        + "number1， number2，number3 可以输入64-89任何数字(不可重复)，"
                        + "不填则获取随机号码。multiplier 输入购买注数，留空默认为一注。"
                        + "如果购买n注，如中奖，奖金会翻n倍，彩票价格也会相应翻n倍。"
                },
                {
                    name: '何时开奖',
                    value: "美西时间每天13:00开奖，使用/lottery info 可查询下次开奖时间"
                },
                {
                    name: '关于奖池',
                    value: "所有没中奖的彩票会有2/3金币流入奖池累积，一等奖获得者"
                        + "将获得奖池中所有金币，如有多个一等奖获得者，奖池奖金将按照"
                        + "multiplier比例分配。奖池奖励为额外奖励，换句话说，就算奖池为0"
                        + "，一等奖获得者也会获得1700金币的基础奖励。奖池奖励不会按照"
                        + "multiplier翻倍"
                }
            )
            .setFooter({ text: 'Coin Blaster 欢乐爆金币' })
        await interaction.reply({ embeds: [rply] });

    },
};
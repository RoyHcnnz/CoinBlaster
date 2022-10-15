const path = require('node:path');
const Player = require(path.resolve("./model/player.js"));
const { randn_bm: random } = require(path.resolve("utils/randomNumber.js"));

const daily = async function (msg) {
    let player = await Player.findById(msg.author.id);
    if (!player) return;
    if (!player.haveSpokenToday) {
        const dailyCoinRe = Math.round(random(0, 100));
        const dailyRepRe = 25;
        player.earnCoins(dailyCoinRe);
        player.earnRep(dailyRepRe);
        player.haveSpokenToday = true;
        msg.channel.send(`<@${msg.author.id}> speak for the first time`
            + ` today, here is your daily reward!\n`
            + `(+ ${dailyCoinRe} coins + ${dailyRepRe} rep)`);
    }
    player.msgSent = player.msgSent + 1;
    const msgRewardThreshold = 200;
    const msgCoinReward = Math.round(random(0, 40));
    const msgRepReward = 10;
    while (player.msgSent >= msgRewardThreshold) {
        player.msgSent = player.msgSent - msgRewardThreshold;
        player.earnCoins(msgCoinReward);
        msg.channel.send(`<@${msg.author.id}> has sent ${msgRewardThreshold} `
            + `messages! Here's some gifts for you!\n`
            + `(+ ${msgCoinReward} coins) + ${msgRepReward} rep)`);
    }
    player.save();
}

module.exports = daily;
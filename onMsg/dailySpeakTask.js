const path = require('node:path');
const Player = require(path.resolve("./model/player.js"));

const daily = async function (msg) {
    let player = await Player.findById(msg.author.id);
    if (!player) return;
    if (!player.haveSpokenToday) {
        const dailyCoinRe = 50;
        player.earnCoins(dailyCoinRe);
        player.haveSpokenToday = true;
        msg.channel.send(`<@${msg.author.id}> speak for the first time
            today, here is your daily reward!\n(+ ${dailyCoinRe} coins)`);
    }
    player.msgSent = player.msgSent + 1;
    const msgRewardThreshold = 200;
    const msgCoinReward = 20;
    while (player.msgSent >= msgRewardThreshold) {
        player.msgSent = player.msgSent - msgRewardThreshold;
        player.earnCoins(msgCoinReward);
        msg.channel.send(`<@${msg.author.id}> has sent ${msgRewardThreshold} 
            messages! Here's some gifts for you!\n(+ ${msgCoinReward} coins)`);
    }
    player.save();
}

module.exports = daily;
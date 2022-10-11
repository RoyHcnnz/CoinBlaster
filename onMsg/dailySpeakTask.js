const path = require('node:path');
const Player = require(path.resolve("./model/player.js"));

const daily = async function (msg) {
    let player = await Player.findById(msg.author.id);
    if (!player) return;
    if (!player.haveSpokenToday) {
        player.earnCoins(50);
        player.haveSpokenToday = true;
        msg.channel.send("<@" + msg.author.id + "> speak for the first time "
            + "today, here is your daily award!");
    }
    player.msgSent = player.msgSent + 1;
    while (player.msgSent >= 150) {
        player.msgSent = player.msgSent - 150;
        player.earnCoins(10);
        msg.channel.send("<@" + msg.author.id + "> has sent 150 messages! "
            + "Here's some gifts for you!");
    }
    player.save();
}

module.exports = daily;
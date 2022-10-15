const path = require('node:path');
const Player = require(path.resolve("./model/player.js"));

const punchIn = async function (msg) {
    const player = await Player.findById(msg.author.id);
    if (!player) {
        msg.channel.send("You have not registered yet. Please /register "
            + "first!");
        return;
    }
    const reward = player.punchIn();
    player.save();
    if (reward > 0) {
        // punch in success
        msg.channel.send("<@" + msg.author.id + "> just received " + reward
            + " coins for the hardworking! ( ˶º̬˶ )୨⚑\n"
            + "已连续打卡" + player.punchInCombo + "天！");
        msg.react("<:hl_good:980793051997937674>");
    } else {
        msg.channel.send("<@" + msg.author.id + "> You have already punched"
            + " in today so no coins until tomorrow. Well done for more of"
            + " your hardwork tho.");
    }
}

module.exports = punchIn;
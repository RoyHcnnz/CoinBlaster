const CronJob = require('cron').CronJob;
const path = require('node:path');
const Player = require(path.resolve("./model/player.js"));

const resetPlayerHaveSpokenToday = async () => {
    Player.updateMany({}, { haveSpokenToday: false }, (err, writeResult) => { });
};
git
module.exports = new CronJob('0 0 * * *', async () => {
    await resetPlayerHaveSpokenToday();
}, null, false, 'America/Los_Angeles');
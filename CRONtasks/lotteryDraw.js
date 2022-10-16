const CronJob = require('cron').CronJob;
const path = require('node:path');
const Lottery = require(path.resolve("./model/lottery.js"));

const constructLotteryDrawCRON = function (ch) {
    return new CronJob({
        cronTime: '0 13 * * *',
        // cronTime: '30 20 * * *',
        onTick: async function () {
            // close game and send out result
            const lotteryRes = await Lottery.closeTicket();
            const winnerL = lotteryRes.winnerList;
            const winningNumber = lotteryRes.winningNumber;
            let rplymsg = `The lottery Winning Number is ${winningNumber}\n`;
            // { pid, ticket: {ticket: [], multiplier: 1}, match, reward }
            winnerL.forEach(element => {
                rplymsg += `Congrats! <@${element.pid}>'s ticket ${element.ticket.ticket} x ${element.ticket.multiplier}`
                    + ` matched ${element.match} numbers and won ${element.reward}!\n`;
            });
            this.channel.send(rplymsg);

            // update next date
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(20, 00, 00);  // LA 13pm = UTC 20pm
            Lottery.setNextDate(tomorrow);

        },
        timeZone: 'America/Los_Angeles',
        context: { channel: ch }
    });
};

module.exports = constructLotteryDrawCRON;

/*
if (msg.content.startsWith("lot close")) {
    const lotteryRes = await Lottery.closeTicket();
    const winnerL = lotteryRes.winnerList;
    const winningNumber = lotteryRes.winningNumber;
    let rplymsg = `The lottery Winning Number is ${winningNumber}\n`;
    // { pid, ticket: {ticket: [], multiplier: 1}, match, reward }
    winnerL.forEach(element => {
        rplymsg += `Congrats! <@${element.pid}>'s ticket ${element.ticket.ticket} x ${element.ticket.multiplier}`
            + ` matched ${element.match} numbers and won ${element.reward}!\n`;
    });
    msg.channel.send(rplymsg);
}channel 1023380720820961300
*/
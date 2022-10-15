const mongoose = require('mongoose');
const path = require('node:path');
const Player = require(path.resolve("model/player.js"));
const { randomIntRange } = require(path.resolve("utils/randomNumber.js"));

const Schema = mongoose.Schema;

// return how many ele match in two sorted array
function sortedArrayMatch(a1, a2) {
    let i1 = 0;
    let i2 = 0;
    let match = 0;
    while (i1 < a1.length && i2 < a2.length) {
        if (a1[i1] == a2[i2]) {
            match++;
            i1++;
            i2++;
        } else if (a1[i1] < a2[i2])
            i1++;
        else
            i2++;
    }
    return match;
}

const lotterySchema = new Schema({
    pool: { type: Number, default: 0 },
    tickets: {
        type: Map,
        of: [{
            ticket: [Number],
            multiplier: Number
        }]
    },
    nextDate: Date
});

lotterySchema.methods = {
    buyTicket: async function (pid, input, m) {
        let player = await Player.findById(pid);
        player.spendCoins(2 * m);
        player.save();

        // create ticket
        let ticket = [];
        for (const i of input) {
            if (typeof i === 'number') {
                if (!ticket.includes(i))
                    ticket.push(i);
                else
                    throw "Please no duplicated number, you can leave it blank"
                    + " to get a random number."
            }
        }
        while (ticket.length < 3) {
            let n = 0;
            do {
                n = randomIntRange(64, 89);
            } while (ticket.includes(n));
            ticket.push(n);
        }
        ticket.sort();

        // save ticket
        let update = false;
        let playerTickets;
        if (this.tickets)
            playerTickets = this.tickets.get(pid);
        else
            this.tickets = new Map();
        if (playerTickets) {
            playerTickets.forEach((ele, i) => {
                if (ele.ticket[0] === ticket[0]
                    && ele.ticket[1] === ticket[1]
                    && ele.ticket[2] === ticket[2]) {
                    playerTickets[i].multiplier += m;
                    update = true;
                }
            })
        } else {
            playerTickets = [];
        }
        if (!update) {
            playerTickets.push({ ticket: ticket, multiplier: m });
        }
        this.tickets.set(pid, playerTickets);

        return { ticket: ticket, cost: 2 * m };
    },

    closeTicket: async function () {

        let winningTicket = [];
        let tempPool = 0;
        let grandWinner = [];   // {player, mutli}
        let winnerlist = [];   // a list of winner and there ticker obj
        let winnerM = 0;
        // { pid, ticket: {ticket: [], multiplier: 1}, match, reward }

        // generate winning numbers

        while (winningTicket.length < 3) {
            let n = 0;
            do {
                n = randomIntRange(64, 89);
            } while (winningTicket.includes(n));
            winningTicket.push(n);
        }

        // winningTicket = [71, 77, 89];
        // redeem every ticket
        const mapIterator = this.tickets[Symbol.iterator]();
        for (const item of mapIterator) {
            //this.tickets.forEach(async (playerTickets, pid) => {
            let pid = item[0];
            let playerTickets = item[1];
            let player = await Player.findById(pid);
            // playerTickets.forEach(ticketObj => {
            for (ticketObj of playerTickets) {
                const res = sortedArrayMatch(winningTicket, ticketObj.ticket);
                let reward = 0;
                if (res == 0) tempPool += 2 * ticketObj.multiplier;
                if (res == 1) {
                    reward = 3 * ticketObj.multiplier;
                    winnerlist.push({
                        pid: pid,
                        ticket: ticketObj,
                        match: res,
                        reward: reward
                    });
                    player.earnCoins(reward);
                }
                if (res == 2) {
                    reward = 10 * ticketObj.multiplier;
                    winnerlist.push({
                        pid: pid,
                        ticket: ticketObj,
                        match: res,
                        reward: reward
                    });
                    player.earnCoins(reward);
                }
                if (res == 3) {
                    grandWinner.push({
                        p: player,
                        multi: ticketObj.multiplier
                    });
                    winnerM += ticketObj.multiplier;
                }
            };
            this.tickets.delete(pid);
            await player.save();
        }

        // redeem grandwinner
        // ele = {p, mutli}
        grandWinner.forEach(ele => {
            let reward = 1700 * ele.multi;
            reward += Math.round(this.pool * ele.multi * 2 / 3 / winnerM);
            winnerlist.push({
                pid: ele.p._id,
                ticket: {
                    ticket: winningTicket,
                    multiplier: ele.multi
                },
                match: 3,
                reward: reward
            });
            ele.p.earnCoins(reward);
            ele.p.save();
        });

        // put money into pool
        if (grandWinner.length > 0)
            this.pool = 0;
        this.pool += tempPool;

        return { winningNumber: winningTicket, winnerList: winnerlist };
    },

    listTickets: function (pid) {
        return this.tickets.get(pid);
    },

    timeToNext: function () {
        return this.nextDate.getTime() - (new Date()).getTime();
    },

    getPool: function () {
        return Math.round(this.pool * 2 / 3);
    },

    setNextDate: function (d) {
        this.nextDate = d;
    }
};

lotterySchema.statics = {
    buyTicket: async function (pid, input, m) {
        let lot = await this.findOne({});
        const res = await lot.buyTicket(pid, input, m);
        lot.markModified('tickets');
        lot.save();
        return res;
    },

    closeTicket: async function () {
        let lot = await this.findOne({});
        const res = await lot.closeTicket();
        lot.markModified('tickets');
        lot.save();
        return res;
    },

    listTickets: async function (pid) {
        const lot = await this.findOne({});
        const tickets = lot.listTickets(pid);
        return tickets;
    },

    timeToNext: async function () {
        const lot = await this.findOne({});
        return lot.timeToNext();
    },

    getPool: async function () {
        const lot = await this.findOne({});
        return lot.getPool();
    },

    setNextDate: async function (date) {
        const lot = await this.findOne({});
        lot.setNextDate(date);
        lot.markModified('nextDate');
        lot.save();
    }
};

module.exports = mongoose.model("Lottery", lotterySchema);
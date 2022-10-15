const { EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const path = require('node:path');
const { isToday, isYesterday } = require(path.resolve("utils/dateOp.js"));
const { randn_bm: rand, randomIntRange }
	= require(path.resolve("utils/randomNumber.js"));

const Schema = mongoose.Schema;

const playerSchema = new Schema({
	_id: String,
	name: String,
	coin: {
		type: Number,
		default: 100
	},
	rep: {
		type: Number,
		default: 50
	},

	startedBet: [{ type: Number, ref: 'Bet' }],
	punchInDate: Date,
	punchInCombo: { type: Number, default: 0 },
	haveSpokenToday: { type: Boolean, default: true },
	msgSent: { type: Number, default: 0 },
	lotteryTicket: [{
		ticket: [Number],
		multiplier: Number
	}]
}, { _id: false });

playerSchema.methods = {
	getPlayerInfoEmbed: function () {
		return new EmbedBuilder()
			.setColor(0xe6b800)
			.setTitle(`${this.name}'s profile`)
			//.setDescription('Some description here')
			.addFields(
				{ name: '\:coin:', value: `${this.coin}`, inline: true },
				{ name: '\:crown:', value: `${this.rep}`, inline: true },
			)
			.setFooter({ text: 'Coin Blaster 欢乐爆金币' });
	},

	spendCoins: function (amount) {
		if (amount > this.coin)
			throw "player does not have enough coins";
		this.coin -= amount;
	},

	earnCoins: function (amount) {
		this.coin += amount;
	},

	earnRep: function (amount) {
		this.rep += amount;
	},

	removeBetGame: function (gameId) {
		const idx = this.startedBet.indexOf(gameId);
		if (idx > -1) {	// if game id found
			this.startedBet.splice(idx, 1);
		}
	},

	// return reward if punch in succ
	// return 0 (no reward) if failed
	punchIn: function () {
		const reward = Math.round(rand(0, 40));

		const lastDate = this.punchInDate;
		if (!lastDate) {	// punch in 
			this.punchInDate = new Date();
			this.coin += reward;
			this.punchInCombo = 1;
			return reward;
		}

		if (isToday(lastDate)) {
			return 0;
		}

		if (isYesterday(lastDate)) {
			this.punchInCombo += 1;
		} else {
			this.punchInCombo = 1;
		}


		this.punchInDate = new Date();
		this.coin += reward;
		return reward;
	},

	checkPunchInToday: function () {
		let lastDate = this.punchInDate;
		if (!lastDate) {
			return false;
		}

		return isToday(lastDate);
	},


};

playerSchema.statics = {
	getName: async function (id) {
		const p = await this.findById(id);
		return p.name;
	}
};

module.exports = mongoose.model("Player", playerSchema);
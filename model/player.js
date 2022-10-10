const { EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');

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
	punchInDate: Date
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

	removeBetGame: function (gameId) {
		const idx = this.startedBet.indexOf(gameId);
		if (idx > -1) {	// if game id found
			this.startedBet.splice(idx, 1);
		}
	},

	// return reward if punch in succ
	// return 0 (no reward) if failed
	punchIn: function () {
		const reward = 20;
		const date = new Date();
		const y = date.getYear();
		const m = date.getMonth();
		const d = date.getDay();

		const lastDate = this.punchInDate;
		if (!lastDate) {	// punch in 
			this.punchInDate = date;
			this.coin += reward;
			return reward;
		}
		const lastD = lastDate.getDay();
		const lastM = lastDate.getMonth();
		const lastY = lastDate.getYear();

		if (y == lastY && m == lastM && d == lastD) {
			return 0;
		}

		this.punchInDate = date;
		this.coin += reward;
		return reward;
	},

	checkPunchInToday: function () {
		let lastDate = this.punchInDate;
		if (!lastDate) {
			return false;
		}
		let lastD = lastDate.getDay();
		let lastM = lastDate.getMonth();
		let lastY = lastDate.getYear();

		const date = new Date();
		const y = date.getYear();
		const m = date.getMonth();
		const d = date.getDay();

		if (y == lastY && m == lastM && d == lastD) {
			return true;
		} else {
			return false;
		}
	}
};

playerSchema.statics = {
	getName: async function (id) {
		const p = await this.findById(id);
		return p.name;
	}
};

module.exports = mongoose.model("Player", playerSchema);
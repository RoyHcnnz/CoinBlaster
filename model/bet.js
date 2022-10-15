const mongoose = require('mongoose');
const path = require('node:path');
const Player = require(path.resolve("model/player.js"));
const { randomIntRange } = require(path.resolve("utils/randomNumber.js"));

const Schema = mongoose.Schema;

const betSchema = new Schema({
	_id: Number,
	creatorId: { type: String, ref: 'Player' },
	options: [{ optionName: String, optionBetAmount: Number }],
	topic: String,
	bets: [{
		playerId: { type: String, ref: 'Player' },
		optionIdx: Number,
		amount: { type: Number, default: 0 }
	}],
	totalBetAmount: { type: Number, default: 0 },
}, { _id: false });

betSchema.methods = {
	getBetInfoEmbed: function () {
		let optionDetails = [];
		this.options.forEach((ele, idx) => {
			let oddsStr = "odds: " + this.totalBetAmount + "/" + ele.optionBetAmount;
			if (ele.optionBetAmount > 0) {
				const num = this.totalBetAmount / ele.optionBetAmount;
				// round at most two decimal places
				oddsStr += " = " + (Math.round(num * 100) / 100);
			}
			optionDetails.push({
				name: (idx + 1) + ": " + ele.optionName,
				value: oddsStr
			})
		})
		const embed = {
			color: 0xe6b800,
			title: this.topic,
			description: "bet game id: " + this._id,
			fields: optionDetails,
			footer: { text: 'Coin Blaster 欢乐爆金币' }
		}
		return embed;
	},

	// update player's coin
	// will throw no such option or no enough coins
	addBetToGame: async function (userId, optionIdx, amount) {
		if (optionIdx > this.options.length)
			throw 'No such option';

		let player = await Player.findById(userId);
		// try cost player coin
		player.spendCoins(amount);
		player.earnRep(-5);
		player.save();

		// add bet entry
		const resultIdx = this.bets.findIndex(
			b => userId === b.playerId && optionIdx === b.optionIdx
		);
		if (resultIdx === -1) { // not found such bet
			this.bets.push({
				playerId: userId,
				optionIdx: optionIdx,
				amount: amount
			});
		} else {
			this.bets[resultIdx].amount += amount;
		}
		// update option amount 
		this.options[optionIdx].optionBetAmount += amount;
		// update total amount
		this.totalBetAmount += amount;
	},

	// returns result as[{playerId, betAmount, reward, optStr}]
	// will give winner's reward
	closeGame: async function (winningOpt) {
		const totalWinningAmt = this.options[winningOpt].optionBetAmount;
		let resultList = [];

		for (const b of this.bets) {
			// bets: [playerId: optionIdx: amount: ]
			let reward = 0;

			if (b.optionIdx == winningOpt) {
				reward = Math.round(b.amount / totalWinningAmt * this.totalBetAmount);
				let player = await Player.findById(b.playerId);
				player.earnCoins(reward);
				player.save();
			}

			resultList.push({
				playerId: b.playerId,
				betAmount: b.amount,
				reward: reward,
				optStr: this.options[b.optionIdx].optionName
			});
		};
		// remove game
		this.remove();
		let creator = await Player.findById(this.creatorId);
		creator.removeBetGame(this._id);
		creator.save();
		return resultList;
	}
};

betSchema.statics = {

	getTopic: async function (id) {
		const g = await this.findById(id);
		return g.topic;
	}
};

betSchema.pre('save', async function (next) {
	if (this.isNew) {
		let id;
		let betCheck;
		do {
			id = randomIntRange(10, 99);
			betCheck = await betModel.findById(id);
		} while (betCheck)
		this._id = id;
		this.options.forEach((ele) => {
			ele.optionBetAmount = 0;
		});
		this.bets = [];

		let player = await Player.findById(this.creatorId);
		player.startedBet.push(this._id);
		player.earnRep(-10);
		player.save();
	}
	next();
});

const betModel = mongoose.model("Bet", betSchema);
module.exports = betModel;
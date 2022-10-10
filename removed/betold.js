const path = require('node:path');
const { Player } = require(path.resolve("model/player.js"));
const { 
	getBetById: getBetByIdFromDB, 
	setBet, 
	addBetToGame, 
	getAllGames: getAllGamesFromDB, 
	removeGame 
} = require(path.resolve('middleware/betDBHandler.js'));

class Bet{
	constructor(creatorId, opts, topic){
		let d = new Date();
		this.betId = d.getTime().toString();
		this.creatorId = creatorId;
		this.options = [];
		opts.forEach((ele) => {
			this.options.push({optionName: ele, optionBetAmount: 0});
		});
		this.topic = topic;
		this.bets = []; // userId: optionIdx: amount: 
		this.totalBetAmount = 0;
		setBet(this);
		
		// add game id to creator's profile
		let creator = Player.getPlayerById(creatorId);
		creator.startedBet.push(this.betId);
		Player.updatePlayer(creator);
	}
	
	static getBetById(id){
		return getBetByIdFromDB(id);
	}
	
	static getBetInfoEmbed(betId){
		const game = this.getBetById(betId);
		let optionDetails = [];
		game.options.forEach((ele, idx) => {
			let oddsStr = "odds: " + game.totalBetAmount + "/" + ele.optionBetAmount;
			if(ele.optionBetAmount >0 ){
				const num = game.totalBetAmount / ele.optionBetAmount;
				// round at most two decimal places
				oddsStr += " = " + (Math.round(num * 100) / 100);	
			}
			optionDetails.push( {
				name: (idx+1) + ": " + ele.optionName,
				value: oddsStr 
			} )
		})
		const embed ={
			color: 0xe6b800,
			title: game.topic,
			description: "bet game id: " + game.betId,
			fields: optionDetails,
			footer: { text: 'Coin Blaster 欢乐爆金币' }
		}
		return embed;
	}
	
	static upsertBet(bet){
		setBet(bet);
	}
	
	static addBetToGame(betId, userId, optionIdx, amount){
		let game = this.getBetById(betId);
		if(!game)
			throw 'Game id not found';
		if(optionIdx > game.options.length)
			throw 'No such option';
		
		// try cost player coin
		Player.spendCoins(userId, amount);
		
		// add bet entry
		const resultIdx = game.bets.findIndex(
			b => userId === b.userId && optionIdx === b.optionIdx
		);
		if(resultIdx === -1){ // not found such bet
			game.bets.push({
				userId: userId,
				optionIdx: optionIdx,
				amount: amount
			});
		}else{
			game.bets[resultIdx].amount += amount;
		}
		// update option amount 
		game.options[optionIdx].optionBetAmount += amount;
		// update total amount
		game.totalBetAmount += amount;
		// update game
		this.upsertBet(game);
	}
	
	static getAllGames(){
		return getAllGamesFromDB();
	}
	
	// returns result as[{playerId, betAmount, reward, optIdx}]
	static closeGame(gameId, winningOpt){
		const game = getBetByIdFromDB(gameId);
		const totalWinningAmt = game.options[winningOpt].optionBetAmount;
		let resultList = [];
		
		game.bets.forEach(b => {
			// bets = [{userId: optionIdx: amount:}]
			let reward = 0;
			
			if(b.optionIdx == winningOpt){
				reward = Math.round(b.amount / totalWinningAmt * game.totalBetAmount);
				Player.earnCoins(b.userId, reward);
			}
			
			resultList.push({
				playerId: b.userId,
				betAmount: b.amount,
				reward: reward,
				optIdx: b.optionIdx
			});
		});
		// remove game
		removeGame(gameId);
		Player.removeBetGame(game.creatorId, gameId);
		return resultList;
	}
	
}

module.exports = {
    Bet
}
const { EmbedBuilder } = require('discord.js');
const path = require('node:path');
const { getPlayerById: getPlayerByIdFromDB, setPlayer } = require(path.resolve('middleware/playerDBHandler.js'));

class Player{
	constructor(userId, playerName){
		this.userId = userId;
		this.playerName = playerName;
		this.coin = 50;
		this.rep = 25;
		this.startedBet = [];
		setPlayer(this);
	}
	
	static getName(id){
		return getPlayerByIdFromDB(id).playerName;
	}
	
	static info(p){
		return `${p.playerName} profile: \n\
				\tcoin: ${p.coin}\n\
				\trep:${p.rep}`;
	}
	
	static getPlayerInfoEmbed(id){
		const player = getPlayerByIdFromDB(id);
		if(!player){
			return new EmbedBuilder()
				.setColor(0xe6b800)
				.setTitle(`The user has not registered`)
				//.setDescription('Some description here')
				.setFooter({ text: 'Coin Blaster 欢乐爆金币' });
		}
		return new EmbedBuilder()
			.setColor(0xe6b800)
			.setTitle(`${player.playerName}'s profile`)
			//.setDescription('Some description here')
			.addFields(
				{ name: '\:coin:', value: `${player.coin}`, inline: true },
				{ name: '\:hot_face:', value: `${player.rep}`, inline: true },
			)
			.setFooter({ text: 'Coin Blaster 欢乐爆金币' });
	}
	
	static getPlayerById(id){
		return getPlayerByIdFromDB(id);
	}
	
	static updatePlayer(player){
		setPlayer(player);
	}
	
	static spendCoins(playerId, amount){
		let player = this.getPlayerById(playerId);
		if(amount > player.coin)
			throw "player does not have enough coins";
		player.coin -= amount;
		this.updatePlayer(player);
	}
	
	static earnCoins(playerId, amount){
		let player = this.getPlayerById(playerId);
		player.coin += amount;
		this.updatePlayer(player);
	}
	
	static mention(playerId, message = ""){
		p = getPlayerByIdFromDB(playerId);
		return p.tostring + message;
	}
	
	static removeBetGame(playerId, gameId){
		let player = getPlayerByIdFromDB(playerId);
		const idx = player.startedBet.indexOf(gameId);
		if(idx > -1){	// if game id found
			player.startedBet.splice(idx, 1);
		}
		setPlayer(player);
	}
	
}

module.exports = {
    Player
}
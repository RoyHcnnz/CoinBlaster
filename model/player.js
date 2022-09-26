class Player{
	constructor(userId, playerName){
		this.userId = userId;
		this.playerName = playerName;
		this.coin = 50;
		this.rep = 25;
	}
	
	static getPlayerName(p){
		return p.playerName;
	}
	
	static getCoin(p){
		return p.coin;
	}
	
	static getRep(p){
		return p.rep;
	}
	
	static info(p){
		return `${p.playerName} profile: \n\
				\tcoin: ${p.coin}\n\
				\trep:${p.rep}`;
	}
}

module.exports = {
    Player
}
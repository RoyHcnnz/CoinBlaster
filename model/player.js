class Player{
	constructor(userId, playerName){
		this.userId = userId;
		this.playerName = playerName;
		this.coin = 50;
		this.rep = 25;
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
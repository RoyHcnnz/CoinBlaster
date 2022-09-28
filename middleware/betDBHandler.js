const fs = require('fs');
const path = require('node:path');
const Bet = require(path.resolve("model/bet.js"));

const dbName = "betDB.json";
const dbPath = path.resolve(dbName);

function checkJSONFile(){
    if (!fs.existsSync(dbPath)){
		fs.writeFileSync(dbPath, JSON.stringify({}));
		console.log("File created!");
	}
}

const getBetById = function(id){
	checkJSONFile();
	const data = require(dbPath);
	if(!data) return undefined;
	return data[id];
};

const setBet = function(bet){
	checkJSONFile();
	const data = require(dbPath);
	data[bet.betId] = bet;
	fs.writeFileSync(dbPath, JSON.stringify(data), err =>{
		if(err) throw err;
	});
};

const getAllGames = function(){
	checkJSONFile();
	data = require(dbPath);
	return data
}

const removeGame = function(id){
	checkJSONFile();
	const data = require(dbPath);
	delete data[id];
	fs.writeFileSync(dbPath, JSON.stringify(data), err =>{
		if(err) throw err;
	});
}

module.exports = { getBetById, setBet, getAllGames, removeGame }
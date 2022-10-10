const fs = require('fs');
const path = require('node:path');

const dbName = "fakeDB.json";
const dbPath = path.resolve(dbName);

function checkJSONFile(){
    if (!fs.existsSync(dbPath)){
		fs.writeFileSync(dbPath, JSON.stringify({}));
		console.log("File created!");
	}
}

const getPlayerById = function(id){
	checkJSONFile();
	const data = require(dbPath);
	if(!data) return undefined;
	return data[id];
};

const setPlayer = function(player){
	checkJSONFile();
	const data = require(dbPath);
	data[player.userId] = player;
	fs.writeFileSync(dbPath, JSON.stringify(data), err =>{
		if(err) throw err;
	});
};

module.exports = { getPlayerById, setPlayer }
//const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const path = require('node:path');
const Player = require(path.resolve('./model/player.js'));
const Bet = require(path.resolve('./model/bet.js'));
const pdb = require(path.resolve('fakeDB.json'));
const bdb = require(path.resolve('betDB.json'));
const { mangodbUsername, mangodbPassword, dbname, dbClusterURL }
    = require(path.resolve('./config.json'));

async function main() {

    const uri = `mongodb+srv://${mangodbUsername}:${mangodbPassword}`
        + `@${dbClusterURL}/beidaihe?retryWrites=true&w=majority`;

    // const client = new MongoClient(uri);
    console.log(uri)
    // Connect to the MongoDB cluster
    await mongoose.connect(uri);
    Player.updateMany({}, { $set: { haveSpokenToday: false, msgSent: 0 } }, (err, writeResult) => { });
    // Make the appropriate DB calls
    // await listDatabases(client);
    /*
    for (const p in pdb) {
        let newplayer = new Player({
            _id: pdb[p].userId,
            name: pdb[p].playerName,
            coin: pdb[p].coin,
            rep: pdb[p].rep,
            startedBet: pdb[p].startedBet
        });
        newplayer.save();
    }
    for (const b in bdb) {
        let newbet = new Bet({
            _id: parseInt(bdb[b].betId),
            creatorId: bdb[b].creatorId,
            options: bdb[b].options,
            topic: bdb[b].topic,
            bets: bdb[b].bets,
            totalBetAmount: bdb[b].totalBetAmount
        });
        newbet.save();
    }
    */
}

main().catch(console.error);
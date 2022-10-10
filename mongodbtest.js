//const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const path = require('node:path');
const Player = require(path.resolve('./model/player.js'));
const { mangodbUsername, mangodbPassword, dbname, dbClusterURL }
    = require(path.resolve('./config.json'));

async function main() {

    const uri = `mongodb+srv://${mangodbUsername}:${mangodbPassword}`
        + `@${dbClusterURL}/?retryWrites=true&w=majority`;

    // const client = new MongoClient(uri);
    console.log(uri)
    // Connect to the MongoDB cluster
    await mongoose.connect(uri);

    // Make the appropriate DB calls
    // await listDatabases(client);
    const newPlayer = new Player({
        _id: "8964",
        name: "Tank"
    });

    newPlayer.save();
}

main().catch(console.error);
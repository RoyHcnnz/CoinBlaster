const { MongoClient } = require('mongodb');
const path = require('node:path');
const { mangodbUsername, mangodbPassword, dbname, dbClusterURL }
    = require(path.resolve('./config.json'));

async function main() {

    const uri = `mongodb+srv://${mangodbUsername}:${mangodbPassword}`
        + `@${dbClusterURL}/test?retryWrites=true&w=majority`;

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
const { REST, Routes } = require('discord.js');
const path = require('node:path');
const { clientId,  token } = require(path.resolve('config.json'));

const rest = new REST({ version: '10'}).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then (() => console.log('Successfully deleted application command'))
	.catch(console.error);
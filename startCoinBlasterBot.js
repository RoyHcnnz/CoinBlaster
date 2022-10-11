// Require the necessary discord.js classes
const fs = require('node:fs');
const mongoose = require('mongoose');
const path = require('node:path');
const Player = require(path.resolve("./model/player.js"));
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, mangodbUsername, mangodbPassword, dbname, dbClusterURL }
	= require(path.resolve('config.json'));
const resetPlayerHaveSpokenTodayCron
	= require(path.resolve('middleware/resetEveryDayMsg.js'));
const msgCountAndDaily = require(path.resolve('onMsg/dailySpeakTask.js'))

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

// load cmds
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Commands reply
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	if (interaction.commandName != "register") {
		const player = await Player.findById(interaction.user.id);
		if (!player) {
			interaction.channel.send("You have not registered yet. Please /register first!");
			return;
		}
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
});

client.on('messageCreate', async msg => {
	if ((msg.channel.id == "968856957907775538"
		|| msg.channel.id == "968858315935322162")
		&& (msg.content.startsWith("打卡"))) {
		const player = await Player.findById(msg.author.id);
		if (!player) {
			msg.channel.send("You have not registered yet. Please /register "
				+ "first!");
			return;
		}
		const reward = player.punchIn();
		player.save();
		if (reward > 0) {
			// punch in success
			msg.channel.send("<@" + msg.author.id + "> just received " + reward
				+ " coins for the hardworking! ( ˶º̬˶ )୨⚑");
			msg.react("<:hl_good:980793051997937674>");
		} else {
			msg.channel.send("<@" + msg.author.id + "> You have already punched"
				+ " in today so no coins until tomorrow. Well done for more of"
				+ " your hardwork tho.");
		}
	}

	// count msg to the register user
	msgCountAndDaily(msg);
});

async function main() {

	const uri = `mongodb+srv://${mangodbUsername}:${mangodbPassword}`
		+ `@${dbClusterURL}/${dbname}?retryWrites=true&w=majority`;

	// Connect to the MongoDB cluster
	await mongoose.connect(uri);
	resetPlayerHaveSpokenTodayCron.start();
	// Login to Discord with your client's token
	client.login(token);
}

main().catch(console.error);


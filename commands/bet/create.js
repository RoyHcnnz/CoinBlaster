const { SlashCommandSubcommandBuilder } = require('discord.js');
const path = require('node:path');
const Bet = require(path.resolve("model/bet.js"));

module.exports = {
	subcmd: new SlashCommandSubcommandBuilder()
		.setName('create')
		.setDescription('Create a bet game')
		.addStringOption(option => option
			.setName('topic')
			.setDescription('The topic of the bet')
			.setRequired(true))
		.addStringOption(option => option
			.setName('option1')
			.setDescription('The first option of the bet')
			.setRequired(true))
		.addStringOption(option => option
			.setName('option2')
			.setDescription('The second option of the bet')
			.setRequired(true))
		.addStringOption(option => option
			.setName('option3')
			.setDescription('The third option of the bet'))
		.addStringOption(option => option
			.setName('option4')
			.setDescription('The fourth option of the bet'))
		.addStringOption(option => option
			.setName('option5')
			.setDescription('The fifth option of the bet')),

	async execute(interaction) {
		// Create new bet game
		let betTopic = interaction.options.getString("topic");
		let opts = [];
		for (let i = 1; i <= 5; i++) {
			let optText = interaction.options.getString("option" + i);
			if (optText)
				opts.push({ optionName: optText });
		}
		let creatorId = interaction.user.id;

		const newGame = new Bet({
			creatorId: creatorId,
			options: opts,
			topic: betTopic,
		})
		await newGame.save();

		let betInfoEmbed = newGame.getBetInfoEmbed(newGame.betId);
		await interaction.reply({ embeds: [betInfoEmbed] });
	},
};
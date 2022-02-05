const { SlashCommandBuilder } = require('@discordjs/builders');
// const { MessageEmbed } = require('discord.js');
const ytsr = require('ytsr');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Pour les commandes de test (jsp si elles fonctionnent)'),

	async execute(interaction) {

		// Envoi de message privé
		// interaction.user.send('Ceci est un MP').catch(e => console.log(e));

		// test ytsr
		const searchResults = await ytsr('vtubervostfr').catch(e => console.log(e));
		console.log(searchResults);
		await interaction.reply({ content: `[${searchResults.items[0].title}](${searchResults.items[0].url})` });

	},
};
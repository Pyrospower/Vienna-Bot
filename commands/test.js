const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Pour les commandes de test (jsp si elles fonctionnent)'),

	async execute(interaction) {
		// Envoi de message privé
		// interaction.user.send('Ceci est un MP').catch(e => console.log(e));

		await interaction.reply({ content: `Hello world!` });
	},
};
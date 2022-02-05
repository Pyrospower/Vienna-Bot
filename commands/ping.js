const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Répond "Pong !"'),
	async execute(interaction) {
		// Calcul du délai
		const intDate = new Date().getTime();
		const delay = interaction.createdTimestamp - intDate;
		// Réponse et affichage du délai
		await interaction.reply({ content: `🏓 Pong ! \`${delay}ms\`` });
		// Websocket heartbeat: ${client.ws.ping}ms

		// Récupère des infos sur la réponse
		/* const message = await interaction.fetchReply();
		console.log(message);
		console.log(`Délai entre /ping et réponse : ${(message.createdTimestamp - interaction.createdTimestamp)}ms`); */
	},
};
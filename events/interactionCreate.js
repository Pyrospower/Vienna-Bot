const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// const client = require('../index.js');
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
			console.log(`${interaction.user.tag} a utilisé /${interaction.commandName} dans ${interaction.guild} (#${interaction.channel.name}) à ${interaction.createdAt.toTimeString()}`);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: `Error executing ${interaction.commandName}`, ephemeral: true });
		}
	},
};
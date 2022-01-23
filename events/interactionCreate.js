module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		const client = require('../index.js');
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			command.execute(interaction);
			console.log(`${interaction.user.tag} a utilisé /${interaction.commandName} dans ${interaction.guild} (#${interaction.channel.name}) à ${interaction.createdAt.toTimeString()}`);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
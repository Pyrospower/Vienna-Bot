const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`C'est bon ! Connecté en tant que ${client.user.tag}.`);
	},
};
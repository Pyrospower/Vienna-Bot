// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

// Mes commandes
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// Mes événements
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Lien du repo
const repoLink = 'https://github.com/Pyrospower/Vienna-Bot/';

// Login to Discord with your client's token
client.login(token);

module.exports = client;

client.on('messageCreate', async message => {
	if (message.author.bot) return;

	// Tri du type de channel du message
	switch (message.channel.type) {
		case 'DM':
			console.log(`MP de ${message.author.username} : ${message.content}`);
		break;

		default:
			// Ratio
			if (message.content.toLowerCase().includes('ratio') || message.content.toLowerCase().startsWith('et ce ratio')) {
				console.log(`Ratio de ${message.author.username} dans ${message.guild.name} (#${message.channel.name})`);
				message.react('🔁')
					.then(() => message.react('❤️'))
					.then(() => message.react('💬'))
					.catch(error => console.error(`L'une des réactions n'a pas été envoyée |`, error));
			}
			// Pour plus tard : mettre un collector


			// Commandes avec préfixe v!
			if (message.content.substring(0, 2) == 'v!') {
				// Récupère la commande utilisée
				const args = message.content.substring(2).split(" ");
				const command = args[0].toLowerCase();

				// 🕵️
				const vCmdLog = `${message.author.tag} a utilisé v!${command} dans ${message.guild.name} (#${message.channel.name}) à ${new Date().toTimeString()}`;

				switch (command) {
					case 'repo':
					// fall through
					case 'repository':
						message.channel.send(`Repo Github du bot : ${repoLink}`);
						console.log(vCmdLog);
					break;
					case 'vostfr':
						message.channel.send(`Vidéos avec le hashtag **#vtuber${command}** :\nhttps://youtube.com/hashtag/vtuber${command}`);
						console.log(vCmdLog);
					break;
				}
			}
		break;
	}
});
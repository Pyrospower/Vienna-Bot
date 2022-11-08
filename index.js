// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// Mes commandes
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Mes événements
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord with your client's token
client.login(token);

client.on('messageCreate', async message => {
	if (message.author.bot) return;

	// Tri du type de channel du message
	switch (message.channel.type) {
		case 1:
			console.log(`MP de ${message.author.username} : ${message.content ? message.content : `${message.attachments.size} fichier${message.attachments.size > 1 ? "s" : ""}`}`);
		break;

		default: {
			// Ratio
			// possibilité d'ajouter message.type == 'reply'
			if (message.content.toLowerCase().includes('ratio') || message.content.toLowerCase().startsWith('et ce ratio')) {
				console.log(`Tentative de ratio de ${message.author.username} dans ${message.guild.name} (#${message.channel.name})...`);
				try {
					await message.react('🔁');
					await message.react('❤️');
					await message.react('💬');
				}
				catch (error) {
					console.error(`L'une des réactions n'a pas été envoyée |`, error);
				}

				// Statistiques au bout d'une minute
				const filter = (reaction, user) => {
					return (reaction.emoji.name === '🔁' || reaction.emoji.name === '❤️' || reaction.emoji.name === '💬') && user != '932401286882676756';
				};

				const collector = message.createReactionCollector({ filter, time: 60000 });

				// Affiche dans la console les réactions collectées
				collector.on('collect', (reaction, user) => {
					if (!user.bot) {
						console.log(`${reaction.emoji.name} de ${user.tag} collecté.`);
					}
				});

				// Affiche dans la console à la fin du compteur
				collector.on('end', collected => {
					// Affiche le nombre d'items collectés dans la console
					console.log(`Nombres d'objets collectés : ${collected.size}`);

					if (!collected.get('🔁')) return;
					if (!collected.get('❤️')) return;
					if (!collected.get('💬')) return;
					// Variables stockant, s'il y en a, le nombre de 🔁/❤️/💬
					const rtAmount = collected.get('🔁').count;
					const likesAmount = collected.get('❤️').count;
					const commsAmount = collected.get('💬').count;

					// Mets tous les ClientUser qui ont 🔁/❤️/💬 dans des tableaux
					const rtUsers = Array.from(collected.get('🔁').users.cache.values());
					const likesUsers = Array.from(collected.get('❤️').users.cache.values());
					const commsUsers = Array.from(collected.get('💬').users.cache.values());

					const rtUsersList = [];
					rtUsers.forEach(person => {
						rtUsersList.push(person.username);
					});
					const likesUsersList = [];
					likesUsers.forEach(person => {
						likesUsersList.push(person.username);
					});
					const commsUsersList = [];
					commsUsers.forEach(person => {
						commsUsersList.push(person.username);
					});
					/* Enlève le bot des 3 tableaux
					rtUsersList.shift();
					likesUsersList.shift();
					commsUsersList.shift();
					*/

					// Affiche les utilisateurs qui ont contribué au ratio dans la console
					console.log(`${rtAmount} 🔁: ${rtUsersList.join(', ')}
${likesAmount} ❤️: ${likesUsersList.join(', ')}
${commsAmount} 💬: ${commsUsersList.join(', ')}`);
					});
			}
		break;
		}
	}
});
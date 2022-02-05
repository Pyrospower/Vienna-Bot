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

		default: {
			// Ratio
			// possibilité d'ajouter message.type == 'reply'
			if (message.content.toLowerCase().includes('ratio') || message.content.toLowerCase().startsWith('et ce ratio')) {
				console.log(`Tentative de ratio de ${message.author.username} dans ${message.guild.name} (#${message.channel.name})...`);
				message.react('🔁')
					.then(() => message.react('❤️'))
					.then(() => message.react('💬'))
					.catch(error => console.error(`L'une des réactions n'a pas été envoyée |`, error));

					// Statistiques au bout d'une minute
					const filter = (reaction, user) => {
						return (reaction.emoji.name === '🔁' || reaction.emoji.name === '❤️' || reaction.emoji.name === '💬') && user != '932401286882676756';
					};

					const collector = message.createReactionCollector({ filter, time: 15000 });

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

						// Met tous les ClientUser qui ont 🔁/❤️/💬 dans des tableaux
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
	}
});
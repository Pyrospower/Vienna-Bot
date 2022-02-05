const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const ytpl = require('ytpl');

// Fonction conversion du temps en seconde en temps en String en format xx:xx:xx (s/o walid)
function conversionHMS(timeToConvert) {
  if (timeToConvert >= 60) {
    if (timeToConvert >= 3600) {
      const nb = Math.floor(timeToConvert / 3600);
      const timebis = timeToConvert - (nb * 3600);
      return (nb + ":" + Math.floor(timebis / 60) + ":" + (timeToConvert % 60));
    }
	else {
      return (`${Math.floor(timeToConvert / 60)}:${timeToConvert % 60}`);
    }
  }
  else {
      return (`${timeToConvert}s`);
  }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clips')
		.setDescription(`Pour voir des clips (beta)`)
		.addSubcommand(subcommand =>
			subcommand
				// dans le futur, voir si c'est pas remplaçable par playlist.author.name
				.setName('pyrospower')
				.setDescription('Clips dans la playlist de Pyrospower'),
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('yayaka')
                .setDescription('Clips dans la playlist de Yayaka'),
			),

	async execute(interaction) {

		// Récupère la playlist avec son ID
		const plPyr = await ytpl('PLJDM6ZLBk7fdgmGfvMvbo6DcO-WRH2sz6');
        const plYyk = await ytpl('PLVnifEJVnue9UmFZ7asJJ11bs1s2lquVp');

        // Initialisation de la variable pour la visibilité de la playlist
		let plVisibility = '';
        // Initialisation de la variable pour sa durée
		let plDuration = 0;

        switch (interaction.options.getSubcommand()) {
            case 'pyrospower': {
                // Visibilité de la playlist
                switch (plPyr.visibility) {
                    case 'everyone':
                        plVisibility = 'Publique';
                        break;
                    case 'unlisted':
                        plVisibility = 'Non répertoriée';
                        break;
                }
                // Durée totale de la playlist
                plPyr.items.forEach(vid => {
                    plDuration += vid.durationSec;
                });

                // Embed avec les informations de la playlist
                const embedPlaylist = new MessageEmbed()
                .setColor('#073D79')
                .setAuthor({ name: `Clips de ${plPyr.author.name}`, iconURL: plPyr.author.bestAvatar.url, url: plPyr.url })
                .setThumbnail(plPyr.bestThumbnail.url)
                .setTitle(plPyr.title)
                .setDescription(plPyr.description)
                .addFields(
                    { name: 'Vidéos', value: `${plPyr.estimatedItemCount}`, inline: true },
                    { name: 'Durée totale', value: `${conversionHMS(plDuration)}`, inline: true },
                    { name: 'Visibilité', value: plVisibility, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

                // Réponse
                await interaction.reply({ embeds: [embedPlaylist] });


                // Tableau qui contient tous les embeds de clips
                const clips = [];
                // Un embed par clip (devrait crash s'il y en a + que 9)
                for (let i = 0; i < plPyr.items.length; i++) {
                    const embedClip = new MessageEmbed()
                    .setColor('#073D79')
                    .setTitle(plPyr.items[i].title)
                    .setURL(plPyr.items[i].url)
                    .addFields(
                        { name: 'Auteur', value: `[${plPyr.items[i].author.name}](${plPyr.items[i].author.url})`, inline: true },
                        // possible de check si c'est un vtuber d'hololive, Nijisanji ou autre avec un if (plPyr.items[i].title.includes ?? mais flemme
                        { name: 'Durée', value: plPyr.items[i].duration, inline: true },
                    )
                    .setImage(plPyr.items[i].bestThumbnail.url);

                    // Les embeds sont envoyés dans le tableau
                    clips.push(embedClip);
                }

                // followUp avec tous les clips (devrait crash s'il y en a + que 9)
                await wait(2000);
                await interaction.followUp({ embeds: clips, ephemeral: true }).catch(e => console.log(e));
            break;
            }

            case 'yayaka': {
                // Visibilité de la playlist
                switch (plYyk.visibility) {
                    case 'everyone':
                        plVisibility = 'Publique';
                        break;
                    case 'unlisted':
                        plVisibility = 'Non répertoriée';
                        break;
                }
                // Durée totale de la playlist
                plYyk.items.forEach(vid => {
                    plDuration += vid.durationSec;
                });

                // Embed avec les informations de la playlist
                const embedPlaylist = new MessageEmbed()
                .setColor('#073D79')
                .setAuthor({ name: `Clips de ${plYyk.author.name}`, iconURL: plYyk.author.bestAvatar.url, url: plYyk.url })
                .setThumbnail(plYyk.bestThumbnail.url)
                .setTitle(plYyk.title)
                .setDescription(plYyk.description)
                .addFields(
                    { name: 'Vidéos', value: `${plYyk.estimatedItemCount}`, inline: true },
                    { name: 'Durée totale', value: `${conversionHMS(plDuration)}`, inline: true },
                    { name: 'Visibilité', value: plVisibility, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

                // Réponse
                await interaction.reply({ embeds: [embedPlaylist] });


                // Tableau qui contient tous les embeds de clips
                const clips = [];
                // Un embed par clip (devrait crash s'il y en a + que 9)
                for (let i = 0; i < plYyk.items.length; i++) {
                    const embedClip = new MessageEmbed()
                    .setColor('#073D79')
                    .setTitle(plYyk.items[i].title)
                    .setURL(plYyk.items[i].url)
                    .addFields(
                        { name: 'Auteur', value: `[${plYyk.items[i].author.name}](${plYyk.items[i].author.url})`, inline: true },
                        // possible de check si c'est un vtuber d'hololive, Nijisanji ou autre avec un if (plPyr.items[i].title.includes ?? mais flemme
                        { name: 'Durée', value: plYyk.items[i].duration, inline: true },
                    )
                    .setImage(plYyk.items[i].bestThumbnail.url);

                    // Les embeds sont envoyés dans le tableau
                    clips.push(embedClip);
                }

                // followUp avec tous les clips (devrait crash s'il y en a + que 9)
                await wait(2000);
                await interaction.followUp({ embeds: clips, ephemeral: true }).catch(e => console.log(e));
            break;
            }
            // Voir plus tard pour utiliser des boutons pour naviguer entre les clips (?)
        }
    },
};
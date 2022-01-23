const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription(`Donne des informations sur un utilisateur ou sur le serveur`)
		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Informations sur un utilisateur')
				.addUserOption(option => option.setName('target').setDescription(`L'utilisateur dont vous voulez les informations`)),
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('Informations sur le serveur'),
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('owner')
				.setDescription('Informations sur le propriétaire du serveur'),
			),

	async execute(interaction) {
		// Récupère le serveur dans lequel la commande a été effectuée
		const srv = interaction.guild;
		// Récupère le propriétaire du serveur et sa photo de profil
		const owner = await srv.members.fetch(srv.ownerId);
		const ownerAvatar = owner.user.avatarURL({ dynamic: true });
		// Récupère l'utilisateur qui a effectué la commande
		const intUser = interaction.user;
		const intUserInfo = await intUser.fetch(intUser.id);
		// Récupère la cible de la commande /info user
		const user = interaction.options.getUser('target');

		// Embed
		const embed = new MessageEmbed()
		.setColor('#073D79')
		.setTimestamp()
		.setFooter({ text: `Demandé par ${intUser.tag}`, iconURL: intUser.avatarURL({ dynamic: true }) });

		switch (interaction.options.getSubcommand()) {
			case 'user':
				if (user) {
					// Pour récupérer la date à laquelle l'utilisateur a rejoint le serveur
					const userInfo = await srv.members.fetch(user.id);
					const userJoinedT = userInfo.joinedTimestamp;
					// Ajout des informations sur un utilisateur spécifique
					embed.setAuthor({ name: user.tag, iconURL: user.avatarURL({ dynamic: true }) });
					embed.addFields(
						{ name: 'ID', value: user.id, inline: true },
						{ name: 'Pseudo sur ce serveur', value: `${user}`, inline: true },
						{ name: 'Compte créé le', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>` },
						{ name: 'Serveur rejoint le', value: `<t:${Math.floor(userJoinedT / 1000)}:F>` },
					);
					embed.setThumbnail(`${user.avatarURL({ dynamic: true })}`);
					await interaction.reply({ embeds: [embed] });
				}
				else {
					// Pour récupérer la date à laquelle l'utilisateur a rejoint le serveur (ça marche pas psk jsp coder)
					const intUserInfoJoinedT = intUserInfo.joinedTimestamp;
					// Ajout des informations sur l'utilisateur
					embed.setAuthor({ name: intUser.tag, iconURL: intUser.avatarURL({ dynamic: true }) });
					embed.addFields(
						{ name: 'ID', value: intUser.id, inline: true },
						{ name: 'Pseudo sur ce serveur', value: `${intUser}`, inline: true },
						{ name: 'Compte créé le', value: `<t:${Math.floor(intUser.createdTimestamp / 1000)}:F>` },
						{ name: 'Serveur rejoint le', value: `<t:${Math.floor(intUserInfoJoinedT / 1000)}:F>` },
					);
					embed.setThumbnail(`${intUser.avatarURL({ dynamic: true })}`);
					await interaction.reply({ embeds: [embed] });
				}
				break;

			case 'server':
				// Ajout des informations sur le serveur
				embed.setAuthor({ name: srv.name, iconURL: srv.iconURL({ dynamic: true }) });
				embed.setThumbnail(`${srv.iconURL({ dynamic: true })}`);
				embed.setTitle(`ID : ${srv.id}`);
				embed.addFields(
					{ name: 'Niveau de vérification', value: srv.verificationLevel },
					{ name: 'Région', value: srv.preferredLocale, inline: true },
					{ name: 'Membres', value: `${srv.memberCount}`, inline: true },
					{ name: 'Boosts', value: `${srv.premiumSubscriptionCount}`, inline: true },
					{ name: 'Propriétaire du serveur', value: `${owner} [${owner.user.id}]` },
				);
				embed.addField('Serveur créé le', `<t:${Math.floor(srv.createdTimestamp / 1000)}:F>`);
				await interaction.reply({ embeds: [embed] });
			break;

			case 'owner':
				// Ajout des informations sur le propriétaire du serveur
				embed.setAuthor({ name: owner.user.tag, iconURL: ownerAvatar });
				embed.setThumbnail(`${ownerAvatar}`);
				embed.addFields(
					{ name: 'ID', value: owner.user.id, inline: true },
					{ name: 'Pseudo sur ce serveur', value: `${owner}`, inline: true },
					{ name: 'Compte créé le', value: `<t:${Math.floor(owner.user.createdTimestamp / 1000)}:F>` },
				);
				embed.addField('Serveur créé le', `<t:${Math.floor(srv.createdTimestamp / 1000)}:F>`);
				await interaction.reply({ embeds: [embed] });
			break;
		}
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription(`Donne la photo de profil d'un utilisateur`)
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription(`L'utilisateur dont vous voulez la photo de profil`)
        .addUserOption(option => option.setName('target').setDescription(`L'utilisateur dont vous voulez la photo de profil`)),
      ),

	async execute(interaction) {
		// Récupère le serveur dans lequel la commande a été effectuée
		// const srv = interaction.guild;
		// Récupère le propriétaire du serveur et sa photo de profil
		// const owner = await srv.members.fetch(srv.ownerId);
		// const ownerAvatar = owner.user.avatarURL({ dynamic: true });

		// Récupère l'utilisateur qui a effectué la commande
		const intUser = interaction.user;
		// const intUserInfo = await intUser.fetch(intUser.id);

		// Récupère la cible de la commande /avatar user
		const user = interaction.options.getUser('target');

		// Embed
		const embed = new MessageEmbed()
		.setColor('#073D79')
		.setTimestamp()
		.setFooter({ text: `Demandé par ${intUser.tag}`, iconURL: intUser.avatarURL({ dynamic: true }) });

		switch (interaction.options.getSubcommand()) {
			case 'user':
				if (user) {
					// Ajout des informations sur un utilisateur spécifique
					embed.setAuthor({ name: user.tag, iconURL: user.avatarURL({ dynamic: true }) });
					embed.setDescription(`**[Lien de l'avatar](${user.avatarURL({ dynamic: true, size: 4096 })})**`);
          embed.setImage(`${user.avatarURL({ dynamic: true, size: 4096 })}`);

					await interaction.reply({ embeds: [embed] })
          .catch(e => console.log(e));
				}
				else {
					// Ajout des informations sur l'utilisateur
					embed.setAuthor({ name: intUser.tag, iconURL: intUser.avatarURL({ dynamic: true }) });
					embed.setDescription(`**[Lien de l'avatar](${intUser.avatarURL({ dynamic: true, size: 4096 })})**`);
					embed.setImage(`${intUser.avatarURL({ dynamic: true, size: 4096 })}`);

          await interaction.reply({ embeds: [embed] })
          .catch(e => console.log(e));
				}
			break;
		}
	},
};
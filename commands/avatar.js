const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription(`Donne la photo de profil d'un utilisateur`)
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription(`L'utilisateur dont vous voulez la photo de profil`)
				.setRequired(true),
		),

	async execute(interaction) {
		// Récupère l'utilisateur qui a effectué la commande et la cible
		const intUser = interaction.user;
		const user = interaction.options.getUser('target');

		// Embed
		const embed = new EmbedBuilder()
		.setColor('#073D79')
		.setTimestamp()
		.setFooter({ text: `Demandé par ${intUser.tag}`, iconURL: intUser.avatarURL({ dynamic: true }) });

		// Ajout des informations sur un utilisateur spécifique
		embed.setAuthor({ name: user.tag, iconURL: user.avatarURL({ dynamic: true }) });
		embed.setDescription(`**[Lien de l'avatar](${user.avatarURL({ dynamic: true, size: 4096 })})**`);
        embed.setImage(`${user.avatarURL({ dynamic: true, size: 4096 })}`);

		await interaction.reply({ embeds: [embed] }).catch(e => console.log(e));
	},
};
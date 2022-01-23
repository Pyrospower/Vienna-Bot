const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Pour les commandes de test (jsp si elles fonctionnent)'),

	async execute(interaction) {
		// test
		const montest = interaction.member._roles;
		// Embed avec les informations
		const embedOwner = new MessageEmbed()
		.setColor('#073D79')
		.setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
		.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
		.addFields(
			{ name: 'ID', value: interaction.applicationId, inline: true },
			{ name: 'Rôles', value: `test`, inline: true },
		)
		.setTimestamp()
		.setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		console.log(interaction.member);
		console.log(montest.join(' | '));
		montest.forEach(element => {
			console.log(`<@&${element}>`);
		});

		// Réponse
		await interaction.reply({ content: 'test :', embeds: [embedOwner], ephemeral: true });

		// test
		const varTest = await interaction.user.fetch('id');
		varTest.send('Ceci est un MP').catch(e => console.log(e));
	},
};
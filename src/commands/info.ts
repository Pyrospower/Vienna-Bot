import { SlashCommandBuilder, Role } from "discord.js";
import { createEmbed } from "../utils/embed";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription(
      "Donne des informations sur un utilisateur ou sur le serveur"
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Informations sur un utilisateur")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription(`L'utilisateur dont vous voulez les informations`)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("server").setDescription("Informations sur le serveur")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("owner")
        .setDescription("Informations sur le propriétaire du serveur")
    )
    .setDMPermission(false),
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // Récupère le serveur dans lequel la commande a été effectuée
    const srv = interaction.guild;
    if (!srv) return;

    // Liste des rôles du serveur
    const srvRoles = srv.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((r) => r);
    // Récupère le propriétaire du serveur et sa photo de profil
    const owner = await srv.members.fetch(srv.ownerId);
    const ownerAvatar = owner?.user.avatarURL();

    // Récupère l'utilisateur qui a effectué la commande
    const intUser = interaction.user;
    // Récupère la cible de la commande /info user
    const user = interaction.options.getUser("target");

    // Embed
    const embed = createEmbed();

    switch (interaction.options.getSubcommand()) {
      case "user":
        if (!user) return;
        // Pour récupérer les informations d'un utilisateur spécifique
        const userInfo = await srv.members.fetch(user.id);
        if (!userInfo) return;
        // Liste de ses rôles
        const userRoles = userInfo.roles.cache;
        const roles: Role[] = [];

        userRoles.forEach((e) => roles.push(e));

        // Date à laquelle l'utilisateur a rejoint le serveur
        const userJoinedT = userInfo.joinedTimestamp ?? 0;

        // Ajout des informations sur un utilisateur spécifique
        embed.setAuthor({
          name: user.tag,
          iconURL: user.avatarURL() || "",
        });
        embed.addFields(
          { name: "ID", value: user.id, inline: true },
          { name: "Pseudo sur ce serveur", value: `${user}`, inline: true },
          {
            name: "Compte créé le",
            value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
          },
          {
            name: "Serveur rejoint le",
            value: `<t:${Math.floor(userJoinedT / 1000)}:F>`,
          },
          { name: `Rôles [${roles.length}]`, value: roles.join(", ") }
        );
        embed.setThumbnail(`${user.avatarURL()}`);

        await interaction.reply({ embeds: [embed] });
        break;

      case "server":
        // Ajout des informations sur le serveur
        embed.setAuthor({
          name: srv.name,
          iconURL: srv.iconURL() || "",
        });
        embed.setThumbnail(srv.iconURL());
        embed.setTitle(`ID : ${srv.id}`);
        embed.addFields(
          { name: "Région", value: srv.preferredLocale, inline: true },
          { name: "Membres", value: `${srv.memberCount}`, inline: true },
          {
            name: "Boosts",
            value: `${srv.premiumSubscriptionCount}`,
            inline: true,
          },
          {
            name: "Propriétaire du serveur",
            value: `${owner} [${owner.user.id}]`,
          },
          {
            name: "Serveur créé le",
            value: `<t:${Math.floor(srv.createdTimestamp / 1000)}:F>`,
          },
          { name: `Rôles [${srvRoles.length}]`, value: srvRoles.join(",") }
        );
        await interaction.reply({ embeds: [embed] });
        break;

      case "owner":
        // Ajout des informations sur le propriétaire du serveur
        embed.setAuthor({ name: owner.user.tag, iconURL: ownerAvatar || "" });
        embed.setThumbnail(`${ownerAvatar}`);
        embed.addFields(
          { name: "ID", value: owner.user.id, inline: true },
          { name: "Pseudo sur ce serveur", value: `${owner}`, inline: true },
          {
            name: "Compte créé le",
            value: `<t:${Math.floor(owner.user.createdTimestamp / 1000)}:F>`,
          },
          {
            name: "Serveur créé le",
            value: `<t:${Math.floor(srv.createdTimestamp / 1000)}:F>`,
          }
        );
        await interaction.reply({ embeds: [embed] });
        break;
    }
  },
};

export default command;

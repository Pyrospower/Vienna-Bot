import { SlashCommandBuilder } from "discord.js";
import { createEmbed } from "../utils/embed";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Donne la photo de profil d'un utilisateur")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("L'utilisateur dont vous voulez la photo de profil")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    // Récupère l'utilisateur qui a effectué la commande et la cible
    const intUser = interaction.user;
    const user = interaction.options.getUser("target");
    if (!user) return;

    // Embed
    const embed = createEmbed(intUser);

    // Ajout des informations sur un utilisateur spécifique
    embed.setAuthor({
      name: user.tag,
      iconURL: user.avatarURL() || "",
    });
    embed.setDescription(
      `**[Lien de l'avatar](${user.avatarURL({ size: 4096 })})**`
    );
    embed.setImage(user.avatarURL({ size: 4096 }));

    await interaction.reply({ embeds: [embed] }).catch((e) => console.log(e));
  },
};

export default command;

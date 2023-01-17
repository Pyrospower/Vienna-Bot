import { EmbedBuilder, User } from "discord.js";

// TODO: Variable d'environnement
const embedColor = "#073D79";

// Embed générique
export function createEmbed(interactionUser: User) {
  const embed = new EmbedBuilder()
    .setColor(embedColor)
    .setTimestamp()
    .setFooter({
      text: `Demandé par ${interactionUser.tag}`,
      iconURL: interactionUser.avatarURL() || "",
    });

  return embed;
}

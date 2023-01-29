import { EmbedBuilder, User } from "discord.js";

// TODO: Variable d'environnement
const embedColor = "#073D79";

// Embed générique
export function createEmbed() {
  return new EmbedBuilder().setColor(embedColor);
}

export function createEmbedWithFooter(interactionUser: User) {
  return createEmbed()
    .setTimestamp()
    .setFooter({
      text: `Demandé par ${interactionUser.tag}`,
      iconURL: interactionUser.avatarURL() || "",
    });
}
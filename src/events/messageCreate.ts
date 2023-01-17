import {
  ChannelType,
  Events,
  Message,
  MessageReaction,
  User,
} from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    if (!message.guild || message.author.bot) return;

    // Tri du type de channel du message
    switch (message.channel.type) {
      case ChannelType.DM:
        // prettier-ignore
        console.info(`MP de ${message.author.username} : ${message.content ? message.content : `${message.attachments.size} fichier${message.attachments.size > 1 ? "s" : ""}`}`);
        break;

      case ChannelType.GuildText:
        // Ratio
        const pattern = /\b(ratio)\b/;
        // prettier-ignore
        if (pattern.test(message.content.toLowerCase()) || message.content.toLowerCase().startsWith("et ce ratio")) {
            console.log(`Tentative de ratio de ${message.author.username} dans ${message.guild.name} (#${message.channel.name})...`);

            try {
                await message.react("🔁");
                await message.react("❤️");
                await message.react("💬");
            } catch (error) {
                console.error(`L'une des réactions n'a pas été envoyée |`, error);
            }

            // Statistiques au bout d'une minute
            const filter = (reaction: MessageReaction, user: string | User) => {
                // prettier-ignore
                return ((reaction.emoji.name === "🔁" || reaction.emoji.name === "❤️" || reaction.emoji.name === "💬") && user != "932401286882676756");
            };

            const collector = message.createReactionCollector({ filter, time: 60000 });

            // Affiche dans la console les réactions collectées
            collector.on("collect", (reaction, user) => {
                if (!user.bot) console.log(`${reaction.emoji.name} de ${user.tag} collecté.`);
            });

            // Affiche dans la console à la fin du compteur
            collector.on("end", (collected) => {
                // Affiche le nombre d'items collectés dans la console
                console.log(`Nombres d'objets collectés : ${collected.size}`);

                ["🔁", "❤️", "💬"].forEach((emoji) => {
                    if (!collected.get(emoji)) return;

                    // Ne prend que les utilisateurs
                    const usersCollection = collected.get(emoji)?.users.cache.filter((user) => !user.bot);
                    if (!usersCollection) return;
                    
                    const users = usersCollection.map((user) => user.username);

                    // Affiche le pseudo des personnes ayant réagi au message pour chaque emoji
                    console.log(`${emoji} : ${users.join(", ")}`);
                });
            });
        }
        break;
    }
  },
};

export default event;

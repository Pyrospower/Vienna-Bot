import { SlashCommandBuilder, userMention } from "discord.js";
import { SlashCommand } from "../types";
import { createEmbed } from "../utils/embed";
import { timeToMilliseconds, timeToString } from "../utils/time";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Envoie un message dans un channel après un certain temps (à spécifier)")
    .addStringOption((option) =>
      option
        .setName("reminder")
        .setDescription("Le rappel à envoyer")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("secondes")
        .setDescription(
          "Le temps après lequel le message sera envoyé en secondes"
        )
        .setMinValue(0)
        .setMaxValue(59)
    )
    .addNumberOption((option) =>
      option
        .setName("minutes")
        .setDescription(
          "Le temps après lequel le message sera envoyé en minutes"
        )
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(59)
    )
    .addNumberOption((option) =>
      option
        .setName("heures")
        .setDescription(
          "Le temps après lequel le message sera envoyé en heures"
        )
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(59)
    )
    .addNumberOption((option) =>
      option
        .setName("jours")
        .setDescription(
          "Le nombre de jours après lequel le message sera envoyé"
        )
        .setRequired(false)
        .setMinValue(0)
    ),
  async execute(interaction) {
    if (!interaction.channel) return;
    // Récupère les arguments de la commande
    const time = {
      seconds: interaction.options.getNumber("secondes") ?? 0,
      minutes: interaction.options.getNumber("minutes") ?? 0,
      hours: interaction.options.getNumber("heures") ?? 0,
      days: interaction.options.getNumber("jours") ?? 0,
    };
    const reminder = interaction.options.getString("reminder");

    // Si le temps est égal à 0, on envoie un message d'erreur
    if (timeToMilliseconds(time) === 0) {
      await interaction.reply({
        content: "Erreur : vous n'avez pas spécifié de durée.",
        ephemeral: true,
      });
      return;
    }

    // Si le message est trop long, on envoie un message d'erreur
    if (reminder && reminder.length > 1000) {
      await interaction.reply({
        content: "Erreur : le message est trop long.",
        ephemeral: true,
      });
      return;
    }

    // On envoie un message de confirmation
    const remindmeTime = timeToString(time);

    const embed = createEmbed(interaction.user);
    embed.setDescription(`✅ Vous aurez un rappel dans ${remindmeTime}`);

    await interaction.reply({ embeds: [embed], ephemeral: true });

    // On envoie le message après le temps spécifié
    const { createdTimestamp } = interaction;

    const reminderEmbed = createEmbed(interaction.user)
      .setTitle("⏰ Rappel")
      .setDescription(reminder)
      .setTimestamp(createdTimestamp);

    setTimeout(async () => {
      await interaction.user
        .send({ embeds: [reminderEmbed] })
        .catch((e) => console.error(e));
    }, timeToMilliseconds(time));
  },
};

export default command;

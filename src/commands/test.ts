import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Pour les commandes de test (jsp si elles fonctionnent)"),
  execute: async (interaction) => {
    // Envoi de message privé
    // interaction.user.send('Ceci est un MP').catch(e => console.log(e));
    await interaction.reply({ content: `Hello world!` });
  },
};

export default command;

import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Donne le ping du bot"),
  execute: async (interaction) => {
    await interaction.reply({
      content: `🏓 Pong ! \`${interaction.client.ws.ping}ms\``,
    });
  },
};

export default command;

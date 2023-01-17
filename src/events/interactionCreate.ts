import { Events, Interaction } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      // prettier-ignore
      const command = interaction.client.commands.get(interaction.commandName);
      // console.log(interaction.client); // test
      if (!command) return;

      try {
        await command.execute(interaction);
        // prettier-ignore
        console.log(`${interaction.user.tag} a utilisé /${interaction.commandName} dans ${interaction.guild} à ${interaction.createdAt.toTimeString()}`);
      } catch (error) {
        console.error(error);
        // prettier-ignore
        interaction.reply({ content: `Error executing ${interaction.commandName}`, ephemeral: true });
      }
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        // prettier-ignore
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      try {
        if (!command.autocomplete) return;
        command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  },
};

export default event;

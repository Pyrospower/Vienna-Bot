import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import type { Command, SlashCommand } from "../types";

const commands: Command[] = [];
let commandsDir = join(__dirname, "../commands");

// Construit et prépare une instance du module REST
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

// Déploie les commandes
module.exports = async (client: Client) => {
  const commandFiles = readdirSync(commandsDir).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
  );

  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const command: SlashCommand = require(`${commandsDir}/${file}`).default;
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // La méthode put est utilisée pour actualiser toutes les commandes
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    // TODO: Trouver un meilleur type pour data ?
    console.log(
      `Successfully reloaded ${(data as any).length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
};

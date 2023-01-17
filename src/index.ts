// Require the necessary discord.js classes
import { Client, GatewayIntentBits, Collection, Partials } from "discord.js";
// prettier-ignore
const { DirectMessages, Guilds, GuildMessages, GuildMessageReactions, MessageContent } = GatewayIntentBits;
const { Channel } = Partials;

// Create a new client instance
const client = new Client({
  intents: [
    DirectMessages,
    Guilds,
    GuildMessages,
    GuildMessageReactions,
    MessageContent,
  ],
  partials: [Channel],
});

import type { SlashCommand } from "./types";

import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
config();

client.commands = new Collection<string, SlashCommand>();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) =>
  require(`${handlersDir}/${handler}`)(client)
);

client.login(process.env.DISCORD_TOKEN);

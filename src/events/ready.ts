import { Client, Events } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  execute: (client: Client) => {
    console.log(`C'est bon ! Connecté en tant que ${client.user?.tag}`);
  },
};

export default event;

import { SlashCommandBuilder } from "discord.js";
import { createEmbedWithFooter } from "../utils/embed";
import { SlashCommand } from "../types";
import { getPlaylist } from "../utils/youtube";

type IPlaylists = {
    [key: string]: string
};

// ID des 2 playlists
const playlists: IPlaylists = <const>{
    pyrospower: "PLJDM6ZLBk7fdgmGfvMvbo6DcO-WRH2sz6",
    yayaka: "PLVnifEJVnue9UmFZ7asJJ11bs1s2lquVp"
};

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("clips")
        .setDescription("Pour voir des clips (beta)")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("pyrospower")
                .setDescription("Clips dans la playlist de Pyrospower")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("yayaka")
                .setDescription("Clips dans la playlist de Yayaka")
        ),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const playlistId: keyof IPlaylists = playlists[subcommand];

        try {
            const playlist = await getPlaylist(playlistId);
            if (!playlist) return interaction.reply({ content: "Playlist introuvable", ephemeral: true });

            const { snippet } = playlist;

            const embed = createEmbedWithFooter(interaction.user)
                .setAuthor({ name: `Clips de ${snippet?.channelTitle || subcommand}` })
                .setThumbnail(snippet?.thumbnails?.high?.url || "")
                .setTitle(snippet?.title || "")
                .setURL(`https://www.youtube.com/playlist?list=${playlistId}`)
                .setDescription(snippet?.description || " ");

            // Réponse
            // TODO: Ajouter des informations à l'embed
            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            interaction.reply({
                content: "Une erreur est survenue.",
                ephemeral: true,
            });
        }
    },
};

export default command;
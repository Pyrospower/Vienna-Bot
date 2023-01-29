import { config } from "dotenv";
import { google } from "googleapis"; 

config();
const youtube = google.youtube("v3")

export async function getPlaylist(playlistId: string) {
  try {
    const res = await youtube.playlists.list({
      part: ["snippet"],
      id: [playlistId],
      key: process.env.YT_API_KEY,
    });

    const { items } = res.data;

    if (!items) throw new Error("Playlist introuvable");

    const playlist = items[0];

    return { ...playlist };
  } catch (err) {
    console.error(err);
  }
};

export async function getPlaylistItems(playlistId: string) {
  try {
    const res = await youtube.playlistItems.list({
      part: ["contentDetails", "snippet"],
      playlistId,
      maxResults: 50,
      key: process.env.YT_API_KEY,
    });

    const { items } = res.data;

    if (!items) throw new Error("Playlist introuvable");

    return items;
  } catch (err) {
    console.error(err);
  }
};

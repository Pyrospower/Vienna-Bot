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
      part: ["snippet"],
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

// Idée : faire une classe Playlist qui contient les infos de la playlist et les vidéos
// et qui a une méthode pour récupérer les vidéos
// et une méthode pour récupérer les infos de la playlist
// dans ./structures/playlist.ts par exemple
export async function getPlaylistInfo(playlistId: string) {
  try {
    const [playlist, playlistItems] = await Promise.all([
      getPlaylist(playlistId),
      getPlaylistItems(playlistId),
    ]);

    const videos = playlistItems?.map((item) => {
      if (!item.snippet) throw new Error("Vidéo introuvable");
      const { channelTitle, description, publishedAt, resourceId, title, thumbnails } = item.snippet;

      return {
        id: resourceId?.videoId,
        title,
        description: description?.split("\n")[0],
        publishedAt,
        thumbnail: thumbnails?.maxres?.url,
        channelTitle,
      };
    });

    return {
      ...playlist,
      videos,
    };

  } catch (err) {
    console.error(err);
  }
};
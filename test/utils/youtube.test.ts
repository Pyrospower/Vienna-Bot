import { beforeEach, describe, expect, test } from 'vitest'
import { getPlaylist, getPlaylistInfo, getPlaylistItems } from '../../src/utils/youtube'

type YTContext = { playlistId: string };

beforeEach<YTContext>(async (context) => {
  context.playlistId = "PLVnifEJVnue9UmFZ7asJJ11bs1s2lquVp"; // ID de la playlist de Yayaka
});

describe("getPlaylist", () => {
  test<YTContext>("should return a YouTube playlist", async (context) => {
    const playlist = await getPlaylist(context.playlistId);
    
    expect(playlist?.kind).toBeDefined();
    expect(playlist?.kind).toBe("youtube#playlist");
  });

  test<YTContext>("should have a title", async (context) => {
    const playlist = await getPlaylist(context.playlistId);
    
    expect(playlist?.snippet?.title).toBeDefined();
    expect(playlist?.snippet?.title).toBe("Vtuber clips"); // Titre de la playlist de Yayaka
  });
});

describe("getPlaylistItems", () => {
  test<YTContext>("should return an array of videos", async (context) => {
    const playlist = await getPlaylistItems(context.playlistId);
    expect(playlist).toBeInstanceOf(Array);
    expect(playlist?.length).toBeGreaterThan(0);
  });

  test<YTContext>("should return a list of playlist items", async (context) => {
    const playlist = await getPlaylistItems(context.playlistId);
    
    if (!playlist) throw new Error("No playlist returned");

    const firstVideo = playlist && playlist[0];
    expect(firstVideo.kind).toBeDefined();
    expect(firstVideo.kind).toBe("youtube#playlistItem");
  });
});

describe("getPlaylistInfo", () => {
  test<YTContext>("should return a playlist", async (context) => {
    const playlist = await getPlaylistInfo(context.playlistId);
    
    expect(playlist).toBeDefined();
    expect(playlist?.kind).toBe("youtube#playlist");
  });

  test<YTContext>("should return a playlist with videos", async (context) => {
    const playlist = await getPlaylistInfo(context.playlistId);
    
    expect(playlist?.videos).toBeInstanceOf(Array);
    expect(playlist?.videos?.length).toBeGreaterThan(0);
    expect(playlist?.videos?.[0].id).toBeDefined();
  });
});
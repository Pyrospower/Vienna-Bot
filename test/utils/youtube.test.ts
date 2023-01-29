import { beforeEach, describe, expect, test } from 'vitest'
import { getPlaylist, getPlaylistItems } from '../../src/utils/youtube'

type YTContext = { playlistId: string };

beforeEach<YTContext>(async (context) => {
  context.playlistId = "PLVnifEJVnue9UmFZ7asJJ11bs1s2lquVp";
});

describe("getPlaylist", () => {
  test<YTContext>("should be a YouTube playlist", async (context) => {
    const playlist = await getPlaylist(context.playlistId);
    
    expect(playlist?.kind).toBeDefined();
    expect(playlist?.kind).toBe("youtube#playlist");
  });

  test<YTContext>("should have a title", async (context) => {
    const playlist = await getPlaylist(context.playlistId);
    
    expect(playlist?.snippet?.title).toBeDefined();
    expect(playlist?.snippet?.title).toBe("Vtuber clips");
  });
});

describe("getPlaylistItems", () => {
  test<YTContext>("should return an array of videos", async (context) => {
    const playlist = await getPlaylistItems(context.playlistId);
    expect(playlist).toBeInstanceOf(Array);
  });

  test<YTContext>("should return a list of playlist items", async (context) => {
    const playlist = await getPlaylistItems(context.playlistId);
    
    if (!playlist) throw new Error("No playlist returned");

    const firstVideo = playlist && playlist[0];
    expect(firstVideo.kind).toBeDefined();
    expect(firstVideo.kind).toBe("youtube#playlistItem");
  });
});
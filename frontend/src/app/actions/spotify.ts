"use server";

import { fetchAlbumTracks as fetchTracks } from "@/lib/spotify";

export async function getTracksAction(albumId: string) {
    try {
        return await fetchTracks(albumId);
    } catch (err) {
        console.error("Server Action Error (getTracksAction):", err);
        return [];
    }
}

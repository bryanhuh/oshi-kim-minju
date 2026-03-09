export interface SpotifyAlbum {
    id: string;
    name: string;
    release_date: string;
    images: { url: string; height: number; width: number }[];
    external_urls: { spotify: string };
    total_tracks: number;
}

export interface SpotifyTrack {
    id: string;
    name: string;
    track_number: number;
    duration_ms: number;
}

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

async function getAccessToken() {
    if (!client_id || !client_secret || !refresh_token) {
        console.error("Missing Spotify credentials in .env");
        return {};
    }

    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh_token,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Spotify Token Error:", response.status, errorBody);
        return {};
    }

    return response.json();
}

export async function fetchIZONEAlbums(): Promise<SpotifyAlbum[]> {
    const { access_token } = await getAccessToken();
    if (!access_token) return [];

    const url = "https://api.spotify.com/v1/artists/5r1tUTxVSgvBHnoDuDODPH/albums?include_groups=album,single&limit=20";

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Spotify API Error:", response.status, errorBody);
        return [];
    }

    const data = await response.json();

    if (!data.items) {
        console.error("Spotify Response missing items:", data);
        return [];
    }

    // Filter out duplicates and Japanese versions if necessary, or just return all and let the client filter
    // For IZ*ONE, we want to prioritize the main Korean releases but keep the Japanese ones.
    // We'll sort by release date descending.
    return data.items.sort((a: any, b: any) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );
}

export async function fetchAlbumTracks(albumId: string): Promise<SpotifyTrack[]> {
    const { access_token } = await getAccessToken();

    const response = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );

    const data = await response.json();
    return data.items;
}

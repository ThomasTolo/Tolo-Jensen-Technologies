import type { MusicTrack } from "../../data/musicGames";

type ITunesResult = {
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  trackViewUrl?: string;
};

export type TrackPreview = {
  previewUrl: string;
  trackViewUrl?: string;
};

export async function fetchTrackPreview(track: MusicTrack): Promise<TrackPreview | null> {
  const params = new URLSearchParams({
    term: track.query,
    entity: "song",
    media: "music",
    limit: "8"
  });
  const response = await fetch(`https://itunes.apple.com/search?${params.toString()}`);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { results?: ITunesResult[] };
  const results = data.results ?? [];
  const exact =
    results.find(
      (result) =>
        result.previewUrl &&
        normalize(result.trackName ?? "") === normalize(track.title) &&
        normalize(result.artistName ?? "").includes(normalize(track.artist))
    ) ?? results.find((result) => Boolean(result.previewUrl));

  return exact?.previewUrl ? { previewUrl: exact.previewUrl, trackViewUrl: exact.trackViewUrl } : null;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

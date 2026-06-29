import { useEffect, useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { musicTracks, normalizeMusicAnswer, songlessDays } from "../../data/musicGames";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyPuzzle, getDailyStorageKey } from "../utilities/dailyPuzzle";
import { fetchTrackPreview, type TrackPreview } from "./preview";

type GuessResult = "wrong" | "artist" | "correct" | "skipped";

const snippetDurations = [0.5, 1, 2, 4, 8, 12];

export function SnippetGuessPage() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const track = useMemo(() => getDailyPuzzle(songlessDays), []);
  const storageKey = useMemo(() => getDailyStorageKey("tjt.snippet-guess.progress"), []);
  const [results, setResults] = useLocalStorage<GuessResult[]>(storageKey, []);
  const [guess, setGuess] = useState("");
  const [preview, setPreview] = useState<TrackPreview | null>(null);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState(norwegian ? "Spill dagens første klipp." : "Play today's first clip.");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const attempt = Math.min(results.length, snippetDurations.length - 1);
  const finished = results.includes("correct") || results.length >= snippetDurations.length;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  async function playSnippet() {
    if (finished || playing) {
      return;
    }

    const nextPreview = preview ?? (await fetchTrackPreview(track));
    setPreview(nextPreview);

    if (!nextPreview) {
      setMessage(norwegian ? "Fant ikke preview akkurat nå." : "Preview unavailable right now.");
      return;
    }

    const audio = new Audio(nextPreview.previewUrl);
    audioRef.current?.pause();
    audioRef.current = audio;
    setPlaying(true);
    audio.currentTime = 0;
    await audio.play();
    window.setTimeout(() => {
      audio.pause();
      setPlaying(false);
    }, snippetDurations[attempt] * 1000);
  }

  function submitGuess() {
    if (!guess.trim() || finished) {
      return;
    }

    const titleGuess = normalizeMusicAnswer(guess);
    const titleAnswer = normalizeMusicAnswer(track.title);
    const artistAnswer = normalizeMusicAnswer(track.artist);

    if (titleGuess === titleAnswer || titleGuess === normalizeMusicAnswer(`${track.title} ${track.artist}`)) {
      setResults([...results, "correct"]);
      setMessage(norwegian ? "Riktig." : "Correct.");
      return;
    }

    const result = titleGuess.includes(artistAnswer) || artistAnswer.includes(titleGuess) ? "artist" : "wrong";
    setResults([...results, result]);
    setGuess("");
    setMessage(
      result === "artist"
        ? norwegian
          ? "Riktig artist, feil låt."
          : "Right artist, wrong song."
        : norwegian
          ? "Ikke riktig."
          : "Not quite."
    );
  }

  function skip() {
    if (finished) {
      return;
    }

    setResults([...results, "skipped"]);
    setGuess("");
    setMessage(norwegian ? "Hoppet over." : "Skipped.");
  }

  return (
    <PageShell
      eyebrow={norwegian ? "Dagens låtklipp" : "Daily Song Snippet"}
      title={norwegian ? "Låtklipp" : "Snippet Guess"}
      intro={
        norwegian
          ? "Hør et kort klipp og gjett låten. Du kan spille samme klipp flere ganger."
          : "Hear a short clip and guess the song. You can replay the current clip."
      }
    >
      <div className="mx-auto max-w-3xl">
        <details className="brand-panel rounded-lg p-5">
          <summary className="cursor-pointer font-semibold">{norwegian ? "Slik spiller du" : "How it works"}</summary>
          <p className="brand-copy mt-3 leading-7">
            {norwegian
              ? "Trykk play for dagens klipp, velg eller skriv låttittel, og send inn. Feil svar låser opp lengre klipp. Grønn er riktig, gul er riktig artist, rød er feil."
              : "Press play for today's clip, choose or type the song title, and submit. Wrong answers unlock longer clips. Green is correct, yellow is right artist, red is wrong."}
          </p>
        </details>

        <div className="mt-8 grid gap-3">
          {snippetDurations.map((duration, index) => {
            const result = results[index];
            const color =
              result === "correct"
                ? "bg-brand-green"
                : result === "artist"
                  ? "bg-yellow-500 text-ink"
                  : result === "wrong"
                    ? "bg-red-600"
                    : result === "skipped"
                      ? "bg-slate-600"
                      : "brand-control";

            return (
              <div key={duration} className={`rounded border border-line px-4 py-3 text-center font-semibold ${color}`}>
                {result ? (result === "artist" ? "Artist" : result) : `${duration}s`}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={playSnippet}
            disabled={finished || playing}
            className="grid h-20 w-20 place-items-center rounded-full bg-brand-green text-white shadow-glow disabled:opacity-50"
          >
            <Play size={34} />
          </button>
          <p className="brand-copy text-sm">
            {playing
              ? norwegian
                ? "Spiller klipp."
                : "Playing clip."
              : `${snippetDurations[attempt]} seconds`}
          </p>
        </div>

        <div className="mt-8 flex gap-3">
          <input
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            disabled={finished}
            list="song-options"
            placeholder={norwegian ? "Skriv låttittel" : "Type song title"}
            className="brand-control min-w-0 flex-1 rounded border border-line px-4 py-3"
          />
          <datalist id="song-options">
            {musicTracks.map((trackOption) => (
              <option key={`${trackOption.artist}-${trackOption.title}`} value={`${trackOption.title} - ${trackOption.artist}`} />
            ))}
          </datalist>
          <button
            type="button"
            onClick={submitGuess}
            disabled={finished || !guess.trim()}
            className="rounded bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
          >
            {norwegian ? "Gjett" : "Guess"}
          </button>
          <button
            type="button"
            onClick={skip}
            disabled={finished}
            className="brand-control rounded border border-line px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {norwegian ? "Hopp over" : "Skip"}
          </button>
        </div>

        <p className="brand-copy mt-5 text-center text-sm">{message}</p>
        {finished ? (
          <p className="mt-4 text-center font-semibold">
            {track.title} - {track.artist}
          </p>
        ) : null}
      </div>
    </PageShell>
  );
}

export let backgroundMusic: HTMLAudioElement;
export let slide: HTMLAudioElement;
export let achievement: HTMLAudioElement;

export function preload() {
  backgroundMusic = new Audio(
    "https://cddataexchange.blob.core.windows.net/data-exchange/sokoban/Music.mp3"
  );
  slide = new Audio(
    "https://cddataexchange.blob.core.windows.net/data-exchange/sokoban/move.mp3"
  );
  achievement = new Audio(
    "https://cddataexchange.blob.core.windows.net/data-exchange/sokoban/achievement.mp3"
  );
}

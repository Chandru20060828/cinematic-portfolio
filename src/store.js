import { useSyncExternalStore } from 'react';

let state = {
  chapter: 0,
  cue: 0,
  focus: null, // { type: 'project', id }
  doc: null, // internship document id
  voice: false,
  voicePaused: false,
  replay: 0,
  subtitles: true,
  loaded: false,
  canvasReady: false,
  textMode: false,
};
const listeners = new Set();

export const store = {
  get: () => state,
  set(patch) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useStore(selector) {
  return useSyncExternalStore(store.subscribe, () => selector(state), () => selector(state));
}

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { LEVELS, POEMS, TEXTBOOK_VOCAB } from './data';
import type { AppState, DailyProgress, Profile } from './types';

export const PROFILE_KEY = 'learning-quest:v2:profile';
export const DAILY_KEY_PREFIX = 'learning-quest:v2:daily:';

export const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const getMonday = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day + (day === 0 ? -6 : 1));
  return formatDate(result);
};

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createDefaultDaily = (date = new Date()): DailyProgress => ({
  date: formatDate(date),
  math: { score: 0, total: 10, completed: false, mode: 'addsub' },
  think: { score: 0, total: 10, completed: false, mode: 'pattern' },
  chinese: { currentLesson: 0, vocabDone: {}, poemsDone: {}, customVocab: [], taskReview: false, taskPreview: false },
  english: { learnDone: false, gameDone: false, gameScore: 0, gameLevel: 1, todayWords: [], reading: false, book: '' },
  reading: { minutes: 0, bookId: null, pages: 0, done: false },
  exercise: [
    { id: createId(), name: '跳绳', done: false, minutes: 0 },
    { id: createId(), name: '跑步', done: false, minutes: 0 },
    { id: createId(), name: '仰卧起坐', done: false, minutes: 0 },
  ],
  health: { foot: { done: false, minutes: 0 }, massage: { done: false, minutes: 0 } },
});

export const createDefaultProfile = (date = new Date()): Profile => ({
  version: 2,
  coinBase: 10,
  doll: {
    level: 1,
    charm: 0,
    ownedItems: {},
    equipped: { hair: null, top: null, bottom: null, shoes: null, acc: null, makeup: null },
    cottage: {},
    garden: {},
  },
  rewards: { tv: 0, movie: 0, game: 0 },
  weekCheckins: {},
  weekStart: getMonday(date),
  lastActiveDate: null,
  wordGame: { unlocked: 1, done: [] },
  books: [],
});

const mergeDefaults = <T,>(defaults: T, value: unknown): T => {
  if (defaults === null) return (value === undefined ? defaults : value) as T;
  if (Array.isArray(defaults)) return (Array.isArray(value) ? value : defaults) as T;
  if (defaults && typeof defaults === 'object') {
    const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    return Object.fromEntries(
      Object.entries(defaults as Record<string, unknown>).map(([key, fallback]) => [key, mergeDefaults(fallback, source[key])]),
    ) as T;
  }
  return (typeof value === typeof defaults ? value : defaults) as T;
};

const safeRead = <T,>(storage: Storage, key: string, defaults: T): T => {
  try {
    const raw = storage.getItem(key);
    return raw ? mergeDefaults(defaults, JSON.parse(raw)) : defaults;
  } catch {
    return defaults;
  }
};

export const isAllDone = (daily: DailyProgress) => {
  const lesson = TEXTBOOK_VOCAB[daily.chinese.currentLesson];
  const vocabAll = Boolean(lesson?.words.every(([char]) => daily.chinese.vocabDone[char]));
  const poemAny = POEMS.some((poem) => daily.chinese.poemsDone[poem.title]);
  return daily.math.completed && daily.think.completed && vocabAll && poemAny && daily.english.gameDone
    && daily.english.reading && daily.reading.done && daily.exercise.length > 0
    && daily.exercise.every((item) => item.done) && daily.health.foot.done && daily.health.massage.done;
};

export const calculateDailyCoins = (daily: DailyProgress) => {
  let coins = 0;
  if (daily.math.completed) coins += daily.math.score >= 10 ? 8 : 5;
  if (daily.think.completed) coins += daily.think.score >= 10 ? 8 : 5;
  const lesson = TEXTBOOK_VOCAB[daily.chinese.currentLesson];
  if (lesson?.words.every(([char]) => daily.chinese.vocabDone[char])) coins += 3;
  if (daily.chinese.customVocab.length > 0 && daily.chinese.customVocab.every((item) => item.done)) coins += 1;
  const poemsDone = POEMS.filter((poem) => daily.chinese.poemsDone[poem.title]).length;
  coins += Math.min(poemsDone, 3);
  if (daily.chinese.taskReview) coins += 2;
  if (daily.chinese.taskPreview) coins += 2;
  if (daily.english.gameDone) coins += 2;
  if (daily.english.reading) coins += 2;
  if (daily.reading.done && daily.reading.minutes >= 20) coins += 3;
  coins += Math.min(daily.exercise.filter((item) => item.done).length, 3);
  if (daily.health.foot.done) coins += 2;
  if (daily.health.massage.done) coins += 2;
  if (isAllDone(daily)) coins += 10;
  return coins;
};

export const getBalance = ({ daily, profile }: AppState) => Math.max(0, profile.coinBase + calculateDailyCoins(daily));

export const getDollLevel = (charm: number) => {
  let level = 1;
  LEVELS.forEach((entry) => { if (charm >= entry.charm) level = entry.min; });
  return level;
};

export const initializeState = (now = new Date(), storage: Storage = window.localStorage): AppState => {
  const todayKey = formatDate(now);
  let profile = safeRead(storage, PROFILE_KEY, createDefaultProfile(now));

  if (profile.lastActiveDate && profile.lastActiveDate !== todayKey) {
    const previous = safeRead(storage, DAILY_KEY_PREFIX + profile.lastActiveDate, createDefaultDaily(new Date(`${profile.lastActiveDate}T12:00:00`)));
    const earned = calculateDailyCoins(previous);
    const charm = profile.doll.charm + Math.floor(earned / 2);
    profile = { ...profile, coinBase: Math.max(0, profile.coinBase + earned), doll: { ...profile.doll, charm, level: getDollLevel(charm) } };
  }

  const monday = getMonday(now);
  if (profile.weekStart !== monday) {
    const count = Object.values(profile.weekCheckins).filter(Boolean).length;
    const coinBase = count >= 5 ? profile.coinBase + 20 : Math.max(0, profile.coinBase - (5 - count) * 5);
    profile = { ...profile, coinBase, weekCheckins: {}, weekStart: monday };
  }

  profile = { ...profile, lastActiveDate: todayKey };
  const daily = safeRead(storage, DAILY_KEY_PREFIX + todayKey, createDefaultDaily(now));
  try { storage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* private browsing */ }
  return { daily, profile };
};

type Updater<T> = (value: T) => T;
type Action = { type: 'daily'; updater: Updater<DailyProgress> } | { type: 'profile'; updater: Updater<Profile> } | { type: 'reset'; date: Date };

export const appReducer = (state: AppState, action: Action): AppState => {
  if (action.type === 'daily') return { ...state, daily: action.updater(state.daily) };
  if (action.type === 'profile') return { ...state, profile: action.updater(state.profile) };
  return { ...state, daily: createDefaultDaily(action.date) };
};

interface StoreApi {
  state: AppState;
  updateDaily: (updater: Updater<DailyProgress>) => void;
  updateProfile: (updater: Updater<Profile>) => void;
  resetDaily: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => initializeState());

  useEffect(() => {
    try { localStorage.setItem(DAILY_KEY_PREFIX + state.daily.date, JSON.stringify(state.daily)); } catch { /* private browsing */ }
  }, [state.daily]);

  useEffect(() => {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile)); } catch { /* private browsing */ }
  }, [state.profile]);

  useEffect(() => {
    if (calculateDailyCoins(state.daily) === 0 || state.profile.weekCheckins[state.daily.date]) return;
    dispatch({ type: 'profile', updater: (profile) => ({ ...profile, weekCheckins: { ...profile.weekCheckins, [state.daily.date]: true } }) });
  }, [state.daily, state.profile.weekCheckins]);

  const value = useMemo<StoreApi>(() => ({
    state,
    updateDaily: (updater) => dispatch({ type: 'daily', updater }),
    updateProfile: (updater) => dispatch({ type: 'profile', updater }),
    resetDaily: () => dispatch({ type: 'reset', date: new Date() }),
  }), [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useAppStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useAppStore must be used inside AppStoreProvider');
  return context;
};

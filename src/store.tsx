import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { LEVELS } from './data';
import type { AppState, DailyProgress, GradeDailyProgress, GradeId, Profile, TermId } from './types';

export const PROFILE_KEY = 'learning-quest:v3:profile';
export const DAILY_KEY_PREFIX = 'learning-quest:v3:daily:';
const LEGACY_PROFILE_KEY = 'learning-quest:v2:profile';
const LEGACY_DAILY_KEY_PREFIX = 'learning-quest:v2:daily:';

export const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const getMonday = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day + (day === 0 ? -6 : 1));
  return formatDate(result);
};

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createDefaultGradeDaily = (): GradeDailyProgress => ({
  math: { score: 0, total: 10, completed: false, mode: 'addsub' },
  think: { score: 0, total: 10, completed: false, mode: 'pattern' },
  chinese: { currentLesson: 0, vocabDone: {}, poemsDone: {}, customVocab: [], taskReview: false, taskPreview: false },
  english: { learnDone: false, gameDone: false, gameScore: 0, gameLevel: 1, todayWords: [], reading: false, book: '' },
  challenge: { completed: false, score: 0, total: 6, bestCombo: 0 },
});

export const createDefaultDaily = (date = new Date(), grade: GradeId = 3): DailyProgress => {
  const gradeDaily = createDefaultGradeDaily();
  return {
  date: formatDate(date),
  gradeProgress: { [grade]: gradeDaily },
  math: gradeDaily.math,
  think: gradeDaily.think,
  chinese: gradeDaily.chinese,
  english: gradeDaily.english,
  reading: { minutes: 0, bookId: null, pages: 0, done: false },
  exercise: [
    { id: createId(), name: '跳绳', done: false, minutes: 0 },
    { id: createId(), name: '跑步', done: false, minutes: 0 },
    { id: createId(), name: '仰卧起坐', done: false, minutes: 0 },
  ],
  health: { foot: { done: false, minutes: 0 }, massage: { done: false, minutes: 0 } },
  };
};

export const createDefaultProfile = (date = new Date()): Profile => ({
  version: 2,
  selectedGrade: 3,
  selectedTerm: 'upper',
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
  wordGameByGrade: { 3: { unlocked: 1, done: [], readItems: [] } },
  wordGame: { unlocked: 1, done: [], readItems: [] },
  achievements: [],
  streak: { current: 0, best: 0, lastDate: null },
  books: [],
});

const mergeDefaults = <T,>(defaults: T, value: unknown): T => {
  if (defaults === null) return (value === undefined ? defaults : value) as T;
  if (Array.isArray(defaults)) return (Array.isArray(value) ? value : defaults) as T;
  if (defaults && typeof defaults === 'object') {
    const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    const fallback = defaults as Record<string, unknown>;
    const keys = new Set([...Object.keys(fallback), ...Object.keys(source)]);
    return Object.fromEntries([...keys].map((key) => [
      key,
      key in fallback ? mergeDefaults(fallback[key], source[key]) : source[key],
    ])) as T;
  }
  return (typeof value === typeof defaults ? value : defaults) as T;
};

const readJson = (storage: Storage, key: string): unknown => {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const migrateLegacyProfile = (legacy: unknown, date: Date): Profile => {
  const defaults = createDefaultProfile(date);
  if (!legacy || typeof legacy !== 'object') return defaults;
  const source = legacy as Record<string, unknown>;
  const oldWordGame = source.wordGame && typeof source.wordGame === 'object'
    ? mergeDefaults({ unlocked: 1, done: [] as number[], readItems: [] as string[] }, source.wordGame)
    : { unlocked: 1, done: [] as number[], readItems: [] as string[] };
  return mergeDefaults(defaults, {
    ...source,
    version: 2,
    selectedGrade: 3,
    selectedTerm: 'upper',
    wordGameByGrade: { 3: oldWordGame },
    wordGame: oldWordGame,
    achievements: [],
    streak: { current: 0, best: 0, lastDate: null },
  });
};

const migrateLegacyDaily = (legacy: unknown, date: Date): DailyProgress => {
  const defaults = createDefaultDaily(date, 3);
  if (!legacy || typeof legacy !== 'object') return defaults;
  const source = legacy as Record<string, unknown>;
  const gradeProgress = mergeDefaults(createDefaultGradeDaily(), source);
  return mergeDefaults(defaults, { ...source, date: formatDate(date), gradeProgress: { 3: gradeProgress } });
};

export const getGradeDaily = (state: AppState, grade = state.profile.selectedGrade): GradeDailyProgress =>
  state.daily.gradeProgress[grade] ?? createDefaultGradeDaily();

export const getWordGame = (state: AppState, grade = state.profile.selectedGrade) =>
  state.profile.wordGameByGrade[grade] ?? { unlocked: 1, done: [], readItems: [] };

const gradeStudyCoins = (progress: GradeDailyProgress) => {
  let coins = 0;
  if (progress.math.completed) coins += progress.math.score >= 10 ? 8 : 5;
  if (progress.think.completed) coins += progress.think.score >= 10 ? 8 : 5;
  if (Object.values(progress.chinese.vocabDone).filter(Boolean).length >= 2) coins += 3;
  if (progress.chinese.customVocab.length > 0 && progress.chinese.customVocab.every((item) => item.done)) coins += 1;
  coins += Math.min(Object.values(progress.chinese.poemsDone).filter(Boolean).length, 3);
  if (progress.chinese.taskReview) coins += 2;
  if (progress.chinese.taskPreview) coins += 2;
  if (progress.english.gameDone) coins += 2;
  if (progress.english.reading) coins += 2;
  if (progress.challenge.completed) coins += progress.challenge.score === progress.challenge.total ? 8 : 5;
  return coins;
};

const getProgressEntries = (daily: DailyProgress): GradeDailyProgress[] => {
  const entries = Object.values(daily.gradeProgress).filter(Boolean) as GradeDailyProgress[];
  const third = daily.gradeProgress[3];
  if (third && (daily.math !== third.math || daily.think !== third.think || daily.chinese !== third.chinese || daily.english !== third.english)) {
    return [{ ...third, math: daily.math, think: daily.think, chinese: daily.chinese, english: daily.english }, ...entries.filter((item) => item !== third)];
  }
  return entries;
};

const gradeAllDone = (progress: GradeDailyProgress) => progress.math.completed
  && progress.think.completed
  && Object.values(progress.chinese.vocabDone).filter(Boolean).length >= 2
  && Object.values(progress.chinese.poemsDone).some(Boolean)
  && progress.english.gameDone
  && progress.english.reading;

export const isAllDone = (daily: DailyProgress) => getProgressEntries(daily).some((progress) => gradeAllDone(progress))
  && daily.reading.done
  && daily.exercise.length > 0
  && daily.exercise.every((item) => item.done)
  && daily.health.foot.done
  && daily.health.massage.done;

export const calculateDailyCoins = (daily: DailyProgress) => {
  const studyCoins = Math.max(0, ...getProgressEntries(daily).map((progress) => gradeStudyCoins(progress)));
  let coins = studyCoins;
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
  const storedProfile = readJson(storage, PROFILE_KEY);
  let profile = storedProfile
    ? mergeDefaults(createDefaultProfile(now), storedProfile)
    : migrateLegacyProfile(readJson(storage, LEGACY_PROFILE_KEY), now);

  if (profile.lastActiveDate && profile.lastActiveDate !== todayKey) {
    const previousDate = new Date(`${profile.lastActiveDate}T12:00:00`);
    const previousRaw = readJson(storage, DAILY_KEY_PREFIX + profile.lastActiveDate);
    const previous = previousRaw
      ? mergeDefaults(createDefaultDaily(previousDate, profile.selectedGrade), previousRaw)
      : migrateLegacyDaily(readJson(storage, LEGACY_DAILY_KEY_PREFIX + profile.lastActiveDate), previousDate);
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

  profile = { ...profile, version: 2, lastActiveDate: todayKey };
  const storedDaily = readJson(storage, DAILY_KEY_PREFIX + todayKey);
  const daily = storedDaily
    ? mergeDefaults(createDefaultDaily(now, profile.selectedGrade), storedDaily)
    : migrateLegacyDaily(readJson(storage, LEGACY_DAILY_KEY_PREFIX + todayKey), now);
  try { storage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* private browsing */ }
  return { daily, profile };
};

type Updater<T> = (value: T) => T;
type Action = { type: 'daily'; updater: Updater<DailyProgress> } | { type: 'profile'; updater: Updater<Profile> } | { type: 'reset'; date: Date };

export const appReducer = (state: AppState, action: Action): AppState => {
  if (action.type === 'daily') return { ...state, daily: action.updater(state.daily) };
  if (action.type === 'profile') return { ...state, profile: action.updater(state.profile) };
  return { ...state, daily: createDefaultDaily(action.date, state.profile.selectedGrade) };
};

interface StoreApi {
  state: AppState;
  gradeDaily: GradeDailyProgress;
  wordGame: ReturnType<typeof getWordGame>;
  updateDaily: (updater: Updater<DailyProgress>) => void;
  updateGradeDaily: (updater: Updater<GradeDailyProgress>) => void;
  updateProfile: (updater: Updater<Profile>) => void;
  setSelectedGrade: (grade: GradeId) => void;
  setSelectedTerm: (term: TermId) => void;
  resetDaily: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

const previousDateKey = (dateKey: string) => {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() - 1);
  return formatDate(date);
};

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => initializeState());

  useEffect(() => {
    try { localStorage.setItem(DAILY_KEY_PREFIX + state.daily.date, JSON.stringify(state.daily)); } catch { /* private browsing */ }
  }, [state.daily]);

  useEffect(() => {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile)); } catch { /* private browsing */ }
  }, [state.profile]);

  useEffect(() => {
    if (calculateDailyCoins(state.daily) === 0) return;
    const today = state.daily.date;
    dispatch({ type: 'profile', updater: (profile) => {
      const alreadyChecked = Boolean(profile.weekCheckins[today]);
      const alreadyStreaked = profile.streak.lastDate === today;
      if (alreadyChecked && alreadyStreaked) return profile;
      const current = alreadyStreaked ? profile.streak.current : profile.streak.lastDate === previousDateKey(today) ? profile.streak.current + 1 : 1;
      return {
        ...profile,
        weekCheckins: alreadyChecked ? profile.weekCheckins : { ...profile.weekCheckins, [today]: true },
        streak: alreadyStreaked ? profile.streak : { current, best: Math.max(profile.streak.best, current), lastDate: today },
      };
    } });
  }, [state.daily]);

  useEffect(() => {
    const gradeEntries = Object.values(state.daily.gradeProgress).filter(Boolean) as GradeDailyProgress[];
    const earned = calculateDailyCoins(state.daily);
    const badges = [
      earned > 0 ? 'first-step' : '',
      gradeEntries.some((entry) => entry.challenge.bestCombo >= 3) ? 'combo-star' : '',
      gradeEntries.some((entry) => entry.math.score === 10 || entry.challenge.score === entry.challenge.total) ? 'perfect-quest' : '',
      state.daily.reading.minutes >= 20 ? 'book-lover' : '',
      Object.keys(state.daily.gradeProgress).length >= 3 ? 'grade-explorer' : '',
    ].filter(Boolean);
    if (badges.every((badge) => state.profile.achievements.includes(badge))) return;
    dispatch({ type: 'profile', updater: (profile) => ({ ...profile, achievements: [...new Set([...profile.achievements, ...badges])] }) });
  }, [state.daily, state.profile.achievements]);

  const gradeDaily = getGradeDaily(state);
  const wordGame = getWordGame(state);
  const value = useMemo<StoreApi>(() => ({
    state,
    gradeDaily,
    wordGame,
    updateDaily: (updater) => dispatch({ type: 'daily', updater }),
    updateGradeDaily: (updater) => dispatch({ type: 'daily', updater: (daily) => {
      const next = updater(getGradeDaily(state));
      return {
        ...daily,
        gradeProgress: { ...daily.gradeProgress, [state.profile.selectedGrade]: next },
        ...(state.profile.selectedGrade === 3 ? { math: next.math, think: next.think, chinese: next.chinese, english: next.english } : {}),
      };
    } }),
    updateProfile: (updater) => dispatch({ type: 'profile', updater }),
    setSelectedGrade: (grade) => dispatch({ type: 'profile', updater: (profile) => ({ ...profile, selectedGrade: grade }) }),
    setSelectedTerm: (term) => {
      dispatch({ type: 'profile', updater: (profile) => ({ ...profile, selectedTerm: term }) });
      dispatch({ type: 'daily', updater: (daily) => {
        const current = getGradeDaily(state);
        const next = { ...current, chinese: { ...current.chinese, currentLesson: 0 }, english: { ...current.english, gameLevel: 1, todayWords: [] } };
        return { ...daily, gradeProgress: { ...daily.gradeProgress, [state.profile.selectedGrade]: next }, ...(state.profile.selectedGrade === 3 ? { chinese: next.chinese, english: next.english } : {}) };
      } });
    },
    resetDaily: () => dispatch({ type: 'reset', date: new Date() }),
  }), [state, gradeDaily, wordGame]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useAppStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useAppStore must be used inside AppStoreProvider');
  return context;
};

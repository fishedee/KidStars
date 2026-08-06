import { beforeEach,describe,expect,it } from 'vitest';
import { appReducer,calculateDailyCoins,createDefaultDaily,createDefaultProfile,DAILY_KEY_PREFIX,formatDate,getBalance,initializeState,isAllDone,PROFILE_KEY } from './store';
import { POEMS,TEXTBOOK_VOCAB } from './data/chinese';

describe('learning progress store',() => {
  beforeEach(() => localStorage.clear());

  it('creates a fresh v2 state without reading legacy keys',() => {
    localStorage.setItem('girldaily_persist',JSON.stringify({coinBase:9999}));
    const now = new Date('2026-08-04T12:00:00');
    const state = initializeState(now,localStorage);
    expect(state.profile.version).toBe(2);
    expect(state.profile.coinBase).toBe(10);
    expect(state.daily.date).toBe('2026-08-04');
    expect(localStorage.getItem(PROFILE_KEY)).not.toBeNull();
  });

  it('adds course reading progress to profiles saved before the feature existed',() => {
    const now = new Date('2026-08-04T12:00:00');
    const profile = createDefaultProfile(now);
    const legacyProfile = { ...profile,wordGame:{ unlocked:profile.wordGame.unlocked,done:profile.wordGame.done } };
    localStorage.setItem(PROFILE_KEY,JSON.stringify(legacyProfile));
    const state = initializeState(now,localStorage);
    expect(state.profile.wordGame.readItems).toEqual([]);
    expect(state.profile.wordGame.unlocked).toBe(1);
  });

  it('migrates v2 learning progress into third grade without losing rewards',() => {
    const now = new Date('2026-08-04T12:00:00');
    const legacyProfile = { ...createDefaultProfile(now),version:2,coinBase:37,lastActiveDate:'2026-08-04',wordGame:{unlocked:2,done:[1],readItems:['l1-word-1']} };
    const legacyDaily = createDefaultDaily(now);
    legacyDaily.math = { ...legacyDaily.math,score:8,completed:true };
    localStorage.setItem('learning-quest:v2:profile',JSON.stringify(legacyProfile));
    localStorage.setItem('learning-quest:v2:daily:2026-08-04',JSON.stringify({ ...legacyDaily,gradeProgress:undefined }));
    const state = initializeState(now,localStorage);
    expect(state.profile.selectedGrade).toBe(3);
    expect(state.profile.coinBase).toBe(37);
    expect(state.daily.gradeProgress[3]?.math.score).toBe(8);
    expect(state.profile.wordGameByGrade[3]?.readItems).toContain('l1-word-1');
  });

  it('calculates quiz, study, reading and wellness rewards',() => {
    const daily = createDefaultDaily(new Date('2026-08-04T12:00:00'));
    daily.math = { ...daily.math,score:10,completed:true };
    daily.think = { ...daily.think,score:7,completed:true };
    daily.english.gameDone = true;
    daily.reading = { ...daily.reading,minutes:20,done:true };
    daily.health.foot.done = true;
    expect(calculateDailyCoins(daily)).toBe(8+5+2+3+2);
  });

  it('adds the all-done bonus only when every required task is complete',() => {
    const daily = createDefaultDaily(new Date('2026-08-04T12:00:00'));
    daily.math.completed = true; daily.think.completed = true;
    TEXTBOOK_VOCAB[0].words.forEach(([char]) => { daily.chinese.vocabDone[char] = true; });
    daily.chinese.poemsDone[POEMS[0].title] = true;
    daily.english.gameDone = true; daily.english.reading = true;
    daily.reading.done = true;
    daily.exercise.forEach((item) => { item.done = true; });
    daily.health.foot.done = true; daily.health.massage.done = true;
    expect(isAllDone(daily)).toBe(true);
    expect(calculateDailyCoins(daily)).toBeGreaterThanOrEqual(10);
  });

  it('keeps profile data when resetting the daily state',() => {
    const daily = createDefaultDaily(new Date('2026-08-04T12:00:00'));
    const profile = { ...createDefaultProfile(new Date('2026-08-04T12:00:00')),coinBase:42 };
    const result = appReducer({daily,profile},{type:'reset',date:new Date('2026-08-04T12:00:00')});
    expect(result.profile.coinBase).toBe(42);
    expect(result.daily.math.score).toBe(0);
  });

  it('settles previous-day coins when entering a new day',() => {
    const yesterday = new Date('2026-08-03T12:00:00');
    const previousDaily = createDefaultDaily(yesterday);
    previousDaily.math = { ...previousDaily.math,score:10,completed:true };
    const profile = { ...createDefaultProfile(yesterday),lastActiveDate:formatDate(yesterday),weekStart:'2026-08-03' };
    localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));
    localStorage.setItem(DAILY_KEY_PREFIX+formatDate(yesterday),JSON.stringify(previousDaily));
    const state = initializeState(new Date('2026-08-04T12:00:00'),localStorage);
    expect(state.profile.coinBase).toBe(18);
    expect(state.profile.doll.charm).toBe(4);
  });

  it('combines base coins and current-day earnings for the displayed balance',() => {
    const daily = createDefaultDaily();
    daily.math = { ...daily.math,score:6,completed:true };
    expect(getBalance({daily,profile:createDefaultProfile()})).toBe(15);
  });
});

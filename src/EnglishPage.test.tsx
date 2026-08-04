import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { ENGLISH_COURSES } from './data';
import { DAILY_KEY_PREFIX, PROFILE_KEY } from './store';

const speechSpeak = vi.fn();

class MockSpeechSynthesisUtterance {
  text: string;
  lang = '';
  rate = 1;

  constructor(text: string) {
    this.text = text;
  }
}

const openEnglishPage = async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(within(screen.getByRole('navigation', { name: '主导航' })).getByRole('button', { name: /英语大冒险/ }));
  return user;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('English course reader', () => {
  beforeEach(() => {
    localStorage.clear();
    speechSpeak.mockClear();
    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance);
    vi.stubGlobal('speechSynthesis', { cancel: vi.fn(), speak: speechSpeak });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('defines six complete 22-item courses with stable unique ids', () => {
    expect(ENGLISH_COURSES).toHaveLength(6);
    const ids = ENGLISH_COURSES.flatMap((course) => Object.values(course.items).flat().map((item) => item.id));
    ENGLISH_COURSES.forEach((course) => {
      expect(course.items.word).toHaveLength(12);
      expect(course.items.phrase).toHaveLength(4);
      expect(course.items.sentence).toHaveLength(4);
      expect(course.items.pattern).toHaveLength(2);
    });
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('reads at the selected speed, hides translations, and saves progress', async () => {
    const user = await openEnglishPage();
    const progress = screen.getByRole('progressbar', { name: '本集点读进度' });
    expect(progress).toHaveAttribute('aria-valuenow', '0');

    await user.click(screen.getByRole('button', { name: '慢速' }));
    await user.click(screen.getByRole('button', { name: /^点读 cat/ }));
    expect(speechSpeak).toHaveBeenCalledOnce();
    expect(speechSpeak.mock.calls[0][0]).toMatchObject({ text: 'cat', lang: 'en-US', rate: 0.55 });
    expect(progress).toHaveAttribute('aria-valuenow', '1');

    await user.click(screen.getByRole('button', { name: '隐藏中文' }));
    expect(screen.queryByText('猫')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^点读 cat，已点读$/ })).toBeInTheDocument();

    await waitFor(() => {
      const profile = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{}');
      expect(profile.wordGame.readItems).toContain('l1-word-1');
    });
  });

  it('shows the four content categories and keeps game entry available', async () => {
    const user = await openEnglishPage();
    expect(screen.getByRole('heading', { name: 'Animal Friends' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '单词' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: '词组' }));
    expect(screen.getByRole('button', { name: /^点读 a cute cat/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '去闯关' }));
    expect(screen.getByRole('button', { name: '开始闯关' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /换一批/ })).toBeInTheDocument();
  });

  it('marks today learning complete after all 22 course items are read', async () => {
    const user = await openEnglishPage();
    const course = ENGLISH_COURSES[0];
    for (const kind of ['word', 'phrase', 'sentence', 'pattern'] as const) {
      await user.click(screen.getByRole('tab', { name: kind === 'word' ? '单词' : kind === 'phrase' ? '词组' : kind === 'sentence' ? '句子' : '句型' }));
      for (const item of course.items[kind]) {
        await user.click(screen.getByRole('button', { name: new RegExp(`^点读 ${escapeRegExp(item.en)}`) }));
      }
    }
    expect(screen.getByRole('progressbar', { name: '本集点读进度' })).toHaveAttribute('aria-valuenow', '22');
    await waitFor(() => {
      const profile = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{}');
      const daily = JSON.parse(localStorage.getItem(DAILY_KEY_PREFIX + profile.lastActiveDate) ?? '{}');
      expect(daily.english.learnDone).toBe(true);
    });
  });
});

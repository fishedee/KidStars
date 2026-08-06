import { cleanup,render,screen,within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach,beforeEach,describe,expect,it } from 'vitest';
import App from './App';

describe('application shell',() => {
  beforeEach(() => localStorage.clear());
  afterEach(() => cleanup());

  it('navigates between the dashboard and learning pages',async () => {
    const user = userEvent.setup();
    render(<App/>);
    expect(screen.getByRole('heading',{name:/今日总览/})).toBeInTheDocument();
    await user.click(within(screen.getByRole('navigation',{name:'主导航'})).getByRole('button',{name:/数学大闯关/}));
    expect(screen.getByRole('heading',{name:/数学大闯关/})).toBeInTheDocument();
    expect(screen.getByRole('button',{name:/开始挑战/})).toBeInTheDocument();
  });

  it('switches the global grade and updates subject content',async () => {
    const user = userEvent.setup();
    render(<App/>);
    const selectors = screen.getAllByRole('combobox',{name:'选择年级'});
    await user.selectOptions(selectors[selectors.length - 1],'6');
    expect(screen.getByRole('heading',{name:/今日总览 · 六年级/})).toBeInTheDocument();
    await user.click(within(screen.getByRole('navigation',{name:'主导航'})).getByRole('button',{name:/数学大闯关/}));
    expect(screen.getByRole('heading',{name:/六年级数学大闯关/})).toBeInTheDocument();
    expect(screen.getByText('分数乘法')).toBeInTheDocument();
  });
});

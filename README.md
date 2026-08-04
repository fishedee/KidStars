# 我的世界任务站

基于 React 19、TypeScript 和 Rsbuild 的儿童学习任务应用。包含数学与思维闯关、语文生字和古诗、英语单词游戏、阅读计时、运动与健康打卡、公主装扮、房间花园装饰以及奖励兑换。

## 开发

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:3000`。

## 验证

```bash
npm test
npx tsc --noEmit
npm run build
```

## 数据

应用使用浏览器 `localStorage` 保存进度：

- `learning-quest:v2:daily:<YYYY-MM-DD>`：每日学习和健康任务
- `learning-quest:v2:profile`：星光币、书架、装扮、奖励与周打卡

旧版 `girldaily_*` 数据不会被读取或删除。

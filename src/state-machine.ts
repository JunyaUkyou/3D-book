import { createMachine } from "xstate";

// type OpeningEvent = { type: "toggle" };

export const openingMachine = createMachine({
  id: "opening",
  initial: "loading",
  context: {
    scrollTarget: 0,
  },
  states: {
    // 1. アセットや初期化の準備待機
    loading: {
      on: {
        READY: "playing",
      },
    },
    // 2. 自動スクロール・オープニング再生中
    playing: {
      entry: "disableUserScroll", // ユーザーのスクロール操作を無効化
      after: {
        5000: "userControl", // 3秒後に自動で通常操作モードへ
      },
    },
    // 3. 通常のスクロール操作可能状態
    userControl: {
      entry: "enableUserScroll", // スクロール無効化を解除
    },
  },
});

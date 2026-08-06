interface UpdatePageTurnParams {
  scrollOffset: number;
  totalPages: number;
  pageNumber: number;
}

interface UpdatePageTurnReturn {
  targetRotationY: number;
  targetPositionZ: number;
}

interface UpdatePageTurn {
  (params: UpdatePageTurnParams): UpdatePageTurnReturn;
}

export const updatePageTurn: UpdatePageTurn = ({
  scrollOffset,
  totalPages,
  pageNumber,
}) => {
  // 1ページあたりの幅
  const pageStep = 1 / totalPages;
  // 1ページごとのスタート位置
  const pageStart = pageNumber * pageStep;
  // ページ内の進んだ距離
  const pageOffset = scrollOffset - pageStart;

  // ページ内のスクロール移動進捗率(0~1)を取得
  // まだ自分のスクロールに入っていなければ0
  // 自分の領域をこえたら1
  const progress = Math.max(0, Math.min(1, pageOffset / pageStep));

  // 0度（右）から -180度（左）へ回転
  const targetRotationY = -progress * Math.PI;

  // // 重なり順と浮き上がり（アーチ効果）
  const isFlipped = progress > 0.5;
  const targetPositionZ = isFlipped
    ? 0.01 + pageNumber * 0.006
    : (totalPages - pageNumber) * 0.006;

  return {
    targetRotationY,
    targetPositionZ,
  };
};

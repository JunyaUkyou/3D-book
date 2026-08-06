import * as THREE from "three";

// 2D Canvasを使用して高精細なテクスチャを即時生成するヘルパー関数
// これにより RenderTexture / createReconciler 起因の環境エラーを完璧に回避します
export function createPageCanvasTexture({
  title,
  chapter = "",
  content = "",
  pageNumber,
  bgColor = "#fdfbf7",
  textColor = "#2d3748",
  borderColor = "#e2e8f0",
  isCover = false,
  coverSubtitle = "",
}: {
  title: string;
  chapter?: string;
  content?: string;
  pageNumber?: number | string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  isCover?: boolean;
  coverSubtitle?: string;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 736;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (isCover) {
    // 表紙装飾フレーム
    ctx.strokeStyle = "#d69e2e";
    ctx.lineWidth = 10;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    ctx.strokeStyle = "#ecc94b";
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);

    // 表紙タイトル
    ctx.fillStyle = "#ecc94b";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 220);

    // 表紙サブタイトル
    if (coverSubtitle) {
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "20px sans-serif";
      ctx.fillText(coverSubtitle, canvas.width / 2, 290);
    }

    // 案内
    ctx.fillStyle = "#a0aec0";
    ctx.font = "16px sans-serif";
    ctx.fillText(
      "SCROLL DOWN TO TURN PAGES",
      canvas.width / 2,
      canvas.height - 80,
    );
  } else {
    // 通常ページのフレーム
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // 章タイトル
    if (chapter) {
      ctx.fillStyle = "#718096";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(chapter.toUpperCase(), canvas.width / 2, 75);
    }

    // ページタイトル
    ctx.fillStyle = textColor;
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 135);

    // タイトル下の区切り線
    ctx.beginPath();
    ctx.moveTo(80, 160);
    ctx.lineTo(canvas.width - 80, 160);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 本文折り返し描画
    if (content) {
      ctx.fillStyle = textColor;
      ctx.font = "20px sans-serif";
      ctx.textAlign = "left";

      const maxWidth = 410;
      const startX = 50;
      let startY = 220;
      const lineHeight = 36;

      let line = "";
      for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const testLine = line + char;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, startX, startY);
          line = char;
          startY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, startX, startY);
    }

    // ページ番号
    if (pageNumber !== undefined) {
      ctx.fillStyle = "#a0aec0";
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`- ${pageNumber} -`, canvas.width / 2, canvas.height - 45);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

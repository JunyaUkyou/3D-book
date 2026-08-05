import { Page } from "./Page";
import { FrontCover } from "./FrontCover";

import { BookBase } from "./BookBase";

interface BookSceneProps {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const PAGES_DATA = [
  {
    chapter: "Chapter I",
    title: "はじまりの物語",
    content:
      "Web 3Dの世界へようこそ。Three.jsとReact Three Fiberを組み合わせることで、紙の本のような質感と没入感のある表現を実現できます。",
  },
  {
    chapter: "Chapter II",
    title: "インタラクティブ設計",
    content:
      "スクロール操作と3Dオブジェクトの回転角を連動させることで、ユーザーの直感的な操作に完璧に同期した表現が可能になります。",
  },
  {
    chapter: "Chapter III",
    title: "リアルな質感と陰影",
    content:
      "ライティングやシャドウ、テクスチャの質感を細かく調整することで、デジタルでありながら触れられそうなぬくもりを演出します。",
  },
  {
    chapter: "Chapter IV",
    title: "無限の可能性",
    content:
      "この技術を応用すれば、オンラインポートフォリオやデジタル図鑑、インタラクティブ絵本など、表現の可能性が大きく広がります。",
  },
];

export const Book: React.FC<BookSceneProps> = ({ isOpened, setIsOpened }) => {
  return (
    <group rotation={[Math.PI / 8, 0, 0]} position={[0, -0.2, 0]}>
      <BookBase />

      {PAGES_DATA.map((data, index) => (
        <Page
          key={index}
          number={index + 1}
          totalPages={PAGES_DATA.length + 1}
          chapter={data.chapter}
          title={data.title}
          content={data.content}
          isOpened={isOpened}
        />
      ))}

      <FrontCover
        isOpened={isOpened}
        onOpenComplete={() => setIsOpened(true)}
      />
    </group>
  );
};

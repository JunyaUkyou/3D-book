import { PAGE_CONFIG } from "../const/pageConfig";

interface Props {
  totalPages: number;
}

export const Spine = ({ totalPages }: Props) => {
  // 最初と最後のページ間の厚みを背表紙の奥行きとする
  const depth = (totalPages - 2) * PAGE_CONFIG.stackOffsetZ;

  // 最初と最後のページの間に配置する
  const firstPagePositionZ = totalPages * PAGE_CONFIG.stackOffsetZ;
  const lastPageNumber = totalPages - 1;
  const lastPagePositionZ =
    (totalPages - lastPageNumber) * PAGE_CONFIG.stackOffsetZ;
  const spinePositionZ = (firstPagePositionZ - lastPagePositionZ) / 2;

  return (
    <mesh position={[0, 0, spinePositionZ]}>
      <boxGeometry args={[0.039, 2.36, depth]} />

      <meshStandardMaterial color={"red"} />
    </mesh>
  );
};

export const BookBase = () => {
  return (
    <group position={[0, 0, -0.01]}>
      {/* 左裏表紙ベース */}
      <mesh position={[-0.82, 0, 0]} receiveShadow>
        <boxGeometry args={[1.64, 2.36, 0.02]} />
        <meshStandardMaterial color="#2d3748" roughness={0.4} />
      </mesh>
      {/* 右裏表紙ベース */}
      <mesh position={[0.82, 0, -0.01]} receiveShadow>
        <boxGeometry args={[1.64, 2.36, 0.02]} />
        <meshStandardMaterial color="#2d3748" roughness={0.4} />
      </mesh>
      {/* 背表紙 */}
      <mesh position={[0, 0, -0.005]}>
        <boxGeometry args={[0.08, 2.36, 0.03]} />
        <meshStandardMaterial color="#1a202c" roughness={0.3} />
      </mesh>
    </group>
  );
};

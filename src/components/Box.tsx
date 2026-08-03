import { type ReactNode } from "react";

type BoxProps = {
  position?: [x: number, y: number, z: number];
  rotation?: [x: number, y: number, z: number];
  scale?: [x: number, y: number, z: number];
  children?: ReactNode;
  color?: string;
};
export const Box = (props: BoxProps) => (
  <mesh castShadow receiveShadow {...props}>
    <boxGeometry />
    <meshStandardMaterial color="orange" />
  </mesh>
);

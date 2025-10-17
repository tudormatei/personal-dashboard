import type { FC } from "react";
import { SkeletonBox } from "./Skeleton.styled";

export type SkeletonProps = {
  width?: string;
  height?: string;
};

const Skeleton: FC<SkeletonProps> = ({ width, height }) => {
  return <SkeletonBox width={width} height={height} />;
};

export default Skeleton;

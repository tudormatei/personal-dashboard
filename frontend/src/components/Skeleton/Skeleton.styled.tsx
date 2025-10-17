// Skeleton.styled.ts
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { colors, radii } from "../../constants/styling";

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

type SkeletonBoxProps = {
  width?: string;
  height?: string;
  borderRadius?: string;
};

export const SkeletonBox = styled.div<SkeletonBoxProps>`
  position: relative;
  overflow: hidden;
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "20px"};
  border-radius: ${(props) => props.borderRadius || radii.md};
  background-color: ${colors.background};

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    animation: ${shimmer} 1.5s infinite;
  }
`;

declare module 'react-flip-page' {
  import { ReactNode, CSSProperties } from 'react';

  interface FlipPageProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    showSwipeHint?: boolean;
    uncutPages?: boolean;
    style?: CSSProperties;
    width?: number;
    height?: number;
    maxAngle?: number;
    animationDuration?: number;
    children?: ReactNode;
    onPageChange?: (page: number) => void;
    disableSwipe?: boolean;
  }

  const FlipPage: React.FC<FlipPageProps>;
  export default FlipPage;
} 
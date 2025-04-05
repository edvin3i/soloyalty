import 'react';

declare module 'next/link' {
  import { ReactNode } from 'react';
  interface LinkProps {
    children: ReactNode;
    href: string;
    className?: string;
  }
  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'lucide-react' {
  import { ReactNode } from 'react';
  interface IconProps {
    size?: number;
    className?: string;
  }
  export const Plus: React.FC<IconProps>;
  export const Heart: React.FC<IconProps>;
  export const Exchange: React.FC<IconProps>;
}

declare module 'sonner' {
  export function toast: {
    success: (message: React.ReactNode) => void;
    error: (message: React.ReactNode) => void;
  };
}

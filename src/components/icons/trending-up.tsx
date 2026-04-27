import type { SVGProps } from 'react';
import React from 'react'

interface TrendingUpProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

const TrendingUp: React.FC<TrendingUpProps> = ({className, ...props}: TrendingUpProps) => {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </svg>
    </div>
  )
}

export default TrendingUp;

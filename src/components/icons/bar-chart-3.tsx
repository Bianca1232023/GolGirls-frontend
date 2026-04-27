import type { SVGProps } from 'react';
import React from 'react'

interface BarChart3Props extends SVGProps<SVGSVGElement> {
    className?: string;
}

const BarChart3: React.FC<BarChart3Props> = ({className, ...props}: BarChart3Props) => {
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
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
    </div>
  )
}

export default BarChart3;

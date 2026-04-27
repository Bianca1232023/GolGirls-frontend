import type { SVGProps } from 'react';
import React from 'react'

interface ChevronLeftProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

const ChevronLeft: React.FC<ChevronLeftProps> = ({className, ...props}: ChevronLeftProps) => {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
    </div>
  )
}

export default ChevronLeft;

import type { SVGProps } from 'react';
import React from 'react'

interface PlusProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

const Plus: React.FC<PlusProps> = ({className, ...props}: PlusProps) => {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
    </div>
  )
}

export default Plus;

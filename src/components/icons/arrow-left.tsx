import type { SVGProps } from 'react';
import React from 'react'

interface ArrowLeftProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

const ArrowLeft: React.FC<ArrowLeftProps> = ({className, ...props}: ArrowLeftProps) => {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
    </div>
  )
}

export default ArrowLeft;

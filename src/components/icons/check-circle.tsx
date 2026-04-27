import type { SVGProps } from 'react';
import React from 'react'

interface CheckCircleProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

const CheckCircle: React.FC<CheckCircleProps> = ({className, ...props}: CheckCircleProps) => {
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
      <path d="M21.801 10A10 10 0 1 1 17 3.335" />
      <path d="m9 11 3 3L22 4" />
    </svg>
    </div>
  )
}

export default CheckCircle;

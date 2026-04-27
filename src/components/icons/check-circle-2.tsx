import type { SVGProps } from 'react';
import React from 'react'

interface CheckCircle2Props extends SVGProps<SVGSVGElement> {
    className?: string;
}

const CheckCircle2: React.FC<CheckCircle2Props> = ({className, ...props}: CheckCircle2Props) => {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
    </div>
  )
}

export default CheckCircle2;

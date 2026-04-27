import type { SVGProps } from 'react';
import React from 'react'

interface MoreVerticalProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

const MoreVertical: React.FC<MoreVerticalProps> = ({className, ...props}: MoreVerticalProps) => {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
    </div>
  )
}

export default MoreVertical;

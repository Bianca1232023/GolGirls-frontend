import type { SVGProps } from 'react';
import React from 'react'

interface BriefcaseProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

const Briefcase: React.FC<BriefcaseProps> = ({className, ...props}: BriefcaseProps) => {
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
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
    </div>
  )
}

export default Briefcase;

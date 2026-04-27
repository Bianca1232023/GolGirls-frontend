import type { SVGProps } from 'react';
import React from 'react'

interface MailProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

const Mail: React.FC<MailProps> = ({className, ...props}: MailProps) => {
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
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
    </div>
  )
}

export default Mail;

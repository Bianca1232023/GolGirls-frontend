import type { SVGProps } from 'react';
import React from 'react'

interface UserProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

const User: React.FC<UserProps> = ({className, ...props}: UserProps) => {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
    </div>
  )
}

export default User;

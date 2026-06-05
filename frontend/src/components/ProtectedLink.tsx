"use client";

import Link from 'next/link';
import { useAuth, SignInButton } from '@clerk/nextjs';
import React from 'react';

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ProtectedLink({ href, children, className }: ProtectedLinkProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // If the link is to the homepage, we don't need protection
  if (href === '/' || href === '/pricing') {
    return <Link href={href} className={className}>{children}</Link>;
  }

  if (isLoaded && !isSignedIn) {
    return (
      <SignInButton mode="modal">
        <div className={`${className} cursor-pointer`}>
          {children}
        </div>
      </SignInButton>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

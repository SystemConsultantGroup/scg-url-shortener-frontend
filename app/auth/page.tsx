'use client';

import { ReactLenis } from 'lenis/react';
import Link from "next/link";
import { GoogleLogo, GoogleLogoIcon } from "@phosphor-icons/react";
import MagneticButton from "@/app/components/ui/MagneticButton";

export default function AuthPage() {
  return (
    <ReactLenis root>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-soft-gray">
        {/* Abstract 3D Background (Simplified or repurposed) */}


        <div className="relative z-10 w-full max-w-md p-8">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-display font-medium leading-tight">
                    Welcome Back.
                </h1>
                <p className="mt-2 text-zinc-500">Sign in to continue.</p>
            </div>

            <div className="space-y-4">
                <MagneticButton
                    variant="primary"
                    className="w-full bg-white text-black shadow-lg hover:bg-zinc-50"
                    onClick={() => {
                        window.location.href = `${process.env.NEXT_PUBLIC_API_DOMAIN || 'https://shortener-qa.scg.skku.ac.kr'}/api/v1/auth/google`;
                    }}
                >
                    <span className="flex items-center gap-3">
                        <GoogleLogoIcon weight="bold" className="h-5 w-5" />
                        Continue with Google
                    </span>
                </MagneticButton>

            </div>
            
             <div className="mt-12 text-center">
                <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-foreground">
                    Back to Home
                </Link>
            </div>
        </div>
      </div>
    </ReactLenis>
  );
}

'use client';

import { ErrorCard } from "@/app/components-form-and-navbar/error-card";

interface RegisterErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function RegisterError({ error, reset }: RegisterErrorProps) {
    
    return (
            <main className="flex min-h-screen flex-col items-center p-24">
                <hr />
                <ErrorCard errorMessage={error.message} reset={reset} />
            </main>
    );

    
}
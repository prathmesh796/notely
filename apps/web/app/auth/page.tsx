'use client'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { signUp } from '../actions/signUp'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { ThemeToggle } from '../../components/theme-toggle'

const Auth = () => {
    const router = useRouter();
    const [authType, setAuthType] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            if (authType === "login") {
                const res = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                }); 
                if (res?.ok) {
                    router.push("/dashboard");
                } else {
                    setError("Invalid email or password");
                }
            } else {
                const res = await signUp(email, password);
                if (res?.success) {
                    router.push("/dashboard");
                } else {
                    setError("Failed to sign up");
                }
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground">
        {/* Abstract background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size:[24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        
        <header className="p-8 absolute top-0 left-0 w-full z-10 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 w-max">
                <div className="size-5 bg-primary rounded-sm" />
                <span className="text-lg font-bold tracking-tight">NotesApp</span>
            </Link>
            <ThemeToggle />
        </header>

        <main className="flex-1 flex items-center justify-center p-4 z-10">
            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-8 space-y-6 backdrop-blur-xl bg-card/80">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {authType === "login" ? "Welcome back" : "Create an account"}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {authType === "login" 
                            ? "Enter your credentials to access your workspace" 
                            : "Enter your email below to create your account"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                            Email
                        </label>
                        <Input 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="m@example.com" 
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                            Password
                        </label>
                        <Input 
                            id="password" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm font-medium text-destructive">{error}</p>
                    )}

                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading 
                            ? "Please wait..." 
                            : (authType === "login" ? "Sign In" : "Sign Up")}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="text-center text-sm">
                    {authType === "login" ? (
                        <span className="text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <button onClick={() => setAuthType("signup")} className="font-medium text-primary hover:underline" type="button">
                                Sign up
                            </button>
                        </span>
                    ) : (
                        <span className="text-muted-foreground">
                            Already have an account?{" "}
                            <button onClick={() => setAuthType("login")} className="font-medium text-primary hover:underline" type="button">
                                Sign in
                            </button>
                        </span>
                    )}
                </div>
            </div>
        </main>
    </div>
  )
}

export default Auth

"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { buttonVariants } from '@repo/ui/components/button';
import { ThemeToggle } from "../components/theme-toggle";

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 mx-auto items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-primary rounded-sm" />
            <span className="text-xl font-bold tracking-tight">NotesApp</span>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth" className={buttonVariants({ variant: "ghost" })}>
              Log in
            </Link>
            <Link href="/auth" className={buttonVariants({ variant: "default" })}>
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size:24px_24px"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        
        <div className="container px-4 mx-auto md:px-6 relative z-10 flex flex-col items-center text-center space-y-8 py-24 md:py-32">
          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted/80">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Version 1.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl">
            Capture your thoughts with <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-muted-foreground">clarity.</span>
          </h1>
          
          <p className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            The minimalist, distraction-free workspace designed for deep thinking. 
            Organize your notes in a pure, monochrome environment.
          </p>
          
          <div className="flex gap-4">
            <Link href="/auth" className={buttonVariants({ size: "lg", className: "gap-2" })}>
              Start writing <ArrowRightIcon className="size-4" />
            </Link>
            <Link href="https://github.com/prathmesh796/notes-app" target="_blank" className={buttonVariants({ variant: "outline", size: "lg" })}>
              View source
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0 bg-background border-border/40">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row mx-auto px-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Prathmesh. The source code is available on GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
}

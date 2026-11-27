import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="fixed top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Renovate</CardTitle>
          <CardDescription>Projet Next.js + shadcn/ui</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Modifiez <code className="font-mono">src/app/page.tsx</code> pour commencer.
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button asChild>
            <Link href="/dashboard">Commencer</Link>
          </Button>
          <Button variant="outline">En savoir plus</Button>
        </CardFooter>
      </Card>
    </main>
  );
}

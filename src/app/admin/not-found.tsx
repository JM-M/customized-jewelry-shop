import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-xl font-semibold">Admin Access Required</h2>
        <p className="text-muted-foreground">
          You don't have permission to access this admin area.
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}

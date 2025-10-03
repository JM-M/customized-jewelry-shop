import { HistoryIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const HistoryButton = () => {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/orders">
        <HistoryIcon strokeWidth={1.2} />
      </Link>
    </Button>
  );
};

import type { ReactNode } from "react";
import { PageTransition } from "@/app/components/effects/PageTransition";

export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

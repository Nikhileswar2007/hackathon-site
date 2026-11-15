"use client";

import dynamic from "next/dynamic";

const PerfPanel = dynamic(() =>
  import("./PerfPanel").then((mod) => mod.PerfPanel),
  { ssr: false },
);

export function PerfPanelLoader() {
  return <PerfPanel />;
}

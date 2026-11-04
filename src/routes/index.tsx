import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LichApp } from "@/components/lich-app";
import { useLichStore } from "@/lib/notes";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let live = true;
    const done = () => {
      if (live) setOn(true);
    };
    try {
      void Promise.resolve(useLichStore.persist.rehydrate()).then(done, done);
    } catch {
      done();
    }
    return () => {
      live = false;
    };
  }, []);
  if (!on) {
    return (
      <main className="sky-bg flex h-dvh items-center justify-center">
        <p className="text-2xl font-extrabold text-ink">Lịch Âm Việt</p>
      </main>
    );
  }
  return <LichApp />;
}

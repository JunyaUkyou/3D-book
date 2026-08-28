import { useEffect } from "react";
import { Experience } from "./Experience";
import { Header } from "./components/Header";
import { useMachine } from "@xstate/react";
import { openingMachine } from "./state-machine";

function InitTrigger({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    // 最初の1フレーム目がレンダリングされる準備ができた
    onReady();
  }, [onReady]);

  return null;
}

export default function App() {
  const [state, send] = useMachine(openingMachine);
  console.log({ state });

  return (
    <div className="w-screen h-screen bg-slate-950 font-sans text-white overflow-hidden select-none relative">
      <Header />
      <InitTrigger onReady={() => send({ type: "READY" })} />
      <Experience />
    </div>
  );
}

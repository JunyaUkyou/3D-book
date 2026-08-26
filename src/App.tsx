import { Experience } from "./Experience";
import { Header } from "./components/Header";

export default function App() {
  return (
    <div className="w-screen h-screen bg-slate-950 font-sans text-white overflow-hidden select-none relative">
      <Header />
      <Experience />
    </div>
  );
}

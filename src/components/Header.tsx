export const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center pointer-events-none">
      <div>
        <h1 className="text-xl font-bold tracking-wider text-amber-200">
          3D BOOK EXPERIENCE
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          React Three Fiber + Scroll-driven Flip Animation
        </p>
      </div>
    </header>
  );
};

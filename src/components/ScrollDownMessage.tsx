export const ScrollDownMessage = () => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
      <div className="px-4 py-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-full text-xs text-slate-300 shadow-xl">
        <span>↓ スクロールしてページをめくってください</span>
      </div>
    </div>
  );
};

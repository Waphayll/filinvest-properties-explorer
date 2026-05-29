import React from 'react';

const EasterEggLoading = () => {
  return (
    <div className="fixed inset-0 bg-[#0a1220] z-[9999] flex flex-col items-center justify-center text-center p-6">
      <div className="space-y-6 max-w-md">
        <div className="text-blue-400 uppercase tracking-[0.45em] text-[10px] font-bold font-sans animate-pulse">
          Interactive Properties Explorer
        </div>
        
        <h1 className="text-3xl font-display font-medium text-white leading-tight">
          This was made by <span className="font-bold text-blue-400 block mt-1 tracking-wider">Waphayll</span>
        </h1>
        
        <div className="h-[2px] w-28 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
        
        <div className="flex flex-col items-center gap-3">
          {/* Spinner */}
          <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-[10px] tracking-widest uppercase animate-pulse">
            Redirecting to Portfolio...
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EasterEggLoading);

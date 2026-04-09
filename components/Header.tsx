"use client";

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0066CC] text-sm font-bold text-white">
            R
          </div>
          <div>
            <h1 className="text-base font-semibold text-white leading-tight">
              RFMS API Assistant
            </h1>
            <p className="text-[11px] text-white/40">by Cyncly</p>
          </div>
        </div>
      </div>
    </header>
  );
}

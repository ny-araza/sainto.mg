"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav className="w-full max-w-[1600px] mx-auto flex items-center justify-between px-6 py-3 mb-3.5">
      <span className="text-[1.05rem] font-bold tracking-tight text-[--text]">
        Xero
      </span>

      {/* Desktop nav */}
      <ul className="hidden md:flex gap-8 list-none m-0 p-0">
        {["Method", "Pricing", "Docs"].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="text-[--text-muted] text-[0.85rem] hover:text-[--text] transition-colors"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop actions */}
      <div className="hidden md:flex gap-2.5 items-center">
        <button className="rounded-full px-4 py-1.5 text-[0.82rem] font-medium bg-white/[0.06] text-[--text] hover:bg-white/[0.12] transition-all cursor-pointer">
          Log in
        </button>
        <button className="rounded-full px-4 py-1.5 text-[0.82rem] font-semibold bg-white text-[#0a0a0f] border-0 hover:opacity-90 transition-all cursor-pointer">
          Sign up
        </button>
      </div>

      {/* Hamburger */}
      <button
        className="md:hidden relative z-[1001] w-6 h-3.5 bg-transparent border-0 cursor-pointer p-0 flex flex-col justify-between"
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`block w-6 h-0.5 bg-white rounded-sm transition-transform duration-300 origin-center ${open ? "translate-y-[7px] rotate-45" : ""}`}
        />
        <span
          className={`block w-6 h-0.5 bg-white rounded-sm transition-transform duration-300 origin-center ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
        />
      </button>

      {/* Mobile overlay */}
      <div
        className={`xero-mobile-overlay md:hidden fixed top-0 h-screen w-full bg-[--bg] flex flex-col px-7 pt-24 gap-0 z-[1000] ${open ? "open" : ""}`}
      >
        <ul className="list-none p-0 m-0 flex flex-col gap-0 mb-7 w-full">
          {["Method", "Pricing", "Docs"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="block py-3 text-[1.4rem] text-[--text]"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 w-full">
          <button className="w-full py-3 px-4 text-[0.95rem] font-medium rounded-full bg-white/[0.06] text-[--text] cursor-pointer">
            Log in
          </button>
          <button className="w-full py-3 px-4 text-[0.95rem] font-semibold rounded-full bg-white text-[#0a0a0f] cursor-pointer">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`rounded-xl border overflow-hidden transition-colors duration-200 ${
              isOpen
                ? 'border-emerald-500/30 bg-white/[0.04]'
                : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 cursor-pointer"
            >
              <span className="font-medium text-white text-sm md:text-base leading-snug">
                {item.q}
              </span>
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  isOpen
                    ? 'bg-emerald-500 border-emerald-500 rotate-45'
                    : 'border-white/20 text-zinc-400'
                }`}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isOpen ? 'white' : 'currentColor'}
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <p className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

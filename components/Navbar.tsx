'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '#features', label: 'Funciones' },
    { href: '#testimonials', label: 'Clientes' },
    { href: '#pricing', label: 'Precios' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-zinc-950/85 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-white tracking-tight">
          Vendly<span className="text-emerald-400">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-400">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white transition-colors duration-150">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Ingresar
          </Link>
          <Link
            href="/onboarding"
            className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Empezar gratis
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          open ? 'max-h-72 border-t border-white/[0.06]' : 'max-h-0'
        }`}
      >
        <nav className="bg-zinc-950/95 backdrop-blur-md px-5 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/[0.04] transition-colors text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
          <div className="border-t border-white/[0.06] mt-2 pt-2">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="block text-zinc-500 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/[0.04] transition-colors text-sm"
            >
              Ingresar a mi cuenta
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FaqAccordion } from "@/components/FaqAccordion";
import { CinematicHero } from "@/components/ui/cinematic-hero";

/* ─── Data ─────────────────────────────────────────────────────── */

const stats = [
  { value: "+500", label: "negocios activos" },
  { value: "24/7", label: "sin interrupciones" },
  { value: "< 2s", label: "tiempo de respuesta" },
  { value: "70%", label: "menos carga operativa" },
];

const integrations = [
  { label: "WhatsApp Business API" },
  { label: "Instagram Messaging" },
  { label: "Meta Cloud API" },
  { label: "Claude AI" },
  { label: "API Oficial Meta" },
];

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Respuesta instantánea",
    desc: "Tu agente IA responde en menos de 2 segundos, en cualquier horario. Nunca más un cliente sin respuesta.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V12h-4V9.5A4 4 0 018 6a4 4 0 014-4z" />
        <path d="M8 12H6a2 2 0 00-2 2v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2h-2" />
        <path d="M10 18v4M14 18v4" />
      </svg>
    ),
    title: "Aprende de tu negocio",
    desc: "Entrenás al agente con tu catálogo, FAQs y procesos. Respuestas precisas, con el tono de tu marca.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18M18 9l-5 5-3-3-5 5" />
      </svg>
    ),
    title: "Pipeline integrado",
    desc: "Cada conversación puede ser un deal. Seguí el estado de cada oportunidad desde un solo dashboard.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14" />
        <path d="M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
      </svg>
    ),
    title: "Escala a humano",
    desc: "La IA detecta cuándo un cliente necesita atención real y transfiere la conversación al instante.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
    title: "Campañas de WhatsApp",
    desc: "Envíos masivos con templates oficiales de Meta. Seguí aperturas y respuestas en tiempo real.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: "Conexión en minutos",
    desc: "Embedded Signup de Meta: conectás WhatsApp e Instagram en un solo clic, sin código.",
  },
];

const steps = [
  {
    n: "01",
    title: "Conectá tus canales",
    desc: "Un clic conecta WhatsApp Business e Instagram con la API oficial de Meta.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Entrenás al agente",
    desc: "Subís tu catálogo, preguntas frecuentes y contexto del negocio. El agente aprende en minutos.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Vendé en automático",
    desc: "El agente atiende, clasifica y convierte. Vos revisás el dashboard cuando querés.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Carla Méndez",
    business: "Boutique Claro, Bogotá",
    avatar: "CM",
    color: "bg-emerald-500",
    quote:
      "Antes perdía ventas por no responder a tiempo. Ahora el agente maneja 200+ consultas por semana y yo me enfoco en hacer crecer el negocio.",
  },
  {
    name: "Diego Ríos",
    business: "Consultoría RRHH, Buenos Aires",
    avatar: "DR",
    color: "bg-blue-500",
    quote:
      "Configuré el agente en 20 minutos. La primera semana ya tenía 18 leads calificados sin intervención. El ROI fue inmediato.",
  },
  {
    name: "Sofía Paredes",
    business: "Ecommerce cosméticos, Lima",
    avatar: "SP",
    color: "bg-violet-500",
    quote:
      "El pipeline integrado cambió todo. Puedo ver en qué etapa está cada cliente desde el dashboard, sin revisar WhatsApp manualmente.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "29",
    desc: "Para negocios que empiezan",
    features: ["300 conversaciones/mes", "1 canal (WA o IG)", "Agente IA personalizado", "Soporte por email"],
    cta: "Empezar gratis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "79",
    desc: "El más elegido por negocios en crecimiento",
    features: ["1.500 conversaciones/mes", "3 canales (WA + IG + más)", "Campañas de WhatsApp", "Pipeline de ventas", "Soporte prioritario"],
    cta: "Empezar con Pro",
    highlight: true,
  },
  {
    name: "Scale",
    price: "199",
    desc: "Para equipos y alto volumen",
    features: ["Conversaciones ilimitadas", "Todos los canales", "Campañas avanzadas + analytics", "API access", "Onboarding dedicado"],
    cta: "Hablar con ventas",
    highlight: false,
  },
];

const faqs = [
  {
    q: "¿Necesito saber programar?",
    a: "No. La configuración completa se hace desde el dashboard, sin código. La conexión con Meta es con un par de clics mediante Embedded Signup.",
  },
  {
    q: "¿Cómo aprende el agente sobre mi negocio?",
    a: "Subís tu catálogo de productos, preguntas frecuentes y cualquier información relevante. El agente usa esa base de conocimiento para responder con precisión usando RAG.",
  },
  {
    q: "¿Qué pasa si el cliente necesita atención humana?",
    a: "El agente detecta casos complejos y transfiere la conversación a tu equipo con todo el historial visible en el inbox unificado.",
  },
  {
    q: "¿Es la API oficial de WhatsApp?",
    a: "Sí. Usamos la Meta Cloud API oficial. Tu número queda vinculado formalmente, sin riesgo de bloqueos.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí, sin penalidades ni letra chica. Cancelás desde tu cuenta y no se renueva el siguiente ciclo.",
  },
];

/* ─── Chat Mock ─────────────────────────────────────────────────── */

function ChatMock() {
  return (
    <div className="relative">
      {/* Floating metric badges */}
      <div className="absolute -top-4 -right-6 bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 shadow-xl z-10 hidden sm:block">
        <p className="text-emerald-400 text-xs font-bold">+47% conversión</p>
        <p className="text-zinc-500 text-[10px]">vs. atención manual</p>
      </div>
      <div className="absolute -bottom-4 -left-6 bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 shadow-xl z-10 hidden sm:block">
        <p className="text-white text-xs font-bold">1.2s respuesta</p>
        <p className="text-zinc-500 text-[10px]">tiempo promedio</p>
      </div>

      <div className="w-full max-w-xs mx-auto bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/5">
        {/* Header */}
        <div className="bg-[#1a6b45] px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center text-sm font-bold text-emerald-900 shrink-0">
            V
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">Vendly IA</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse-slow" />
              <p className="text-emerald-200 text-[11px]">en línea ahora</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-3 min-h-52 bg-zinc-900">
          <div className="flex justify-start">
            <div className="bg-zinc-700/80 text-zinc-100 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-sm max-w-48 leading-relaxed">
              Hola! Quisiera saber el precio del plan Pro anual 😊
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-[#1a6b45] text-white text-xs px-3.5 py-2.5 rounded-2xl rounded-tr-sm max-w-52 leading-relaxed">
              ¡Hola! El Pro anual queda en $790/año — ahorrás $158. ¿Te lo activo ahora con 14 días gratis?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-zinc-700/80 text-zinc-100 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-sm max-w-40 leading-relaxed">
              Dale, lo quiero!
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-[#1a6b45] text-white text-xs px-3.5 py-2.5 rounded-2xl rounded-tr-sm max-w-52 leading-relaxed">
              Perfecto! Te mando el link de pago ahora mismo 🚀
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="px-3 pb-3 bg-zinc-900">
          <div className="bg-zinc-800 rounded-full px-4 py-2.5 flex items-center gap-2">
            <span className="text-zinc-500 text-xs flex-1">Escribí un mensaje...</span>
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      <Navbar />

      <CinematicHero />


      {/* ── Integrations strip ── */}
      <div className="border-y border-white/[0.05] bg-white/[0.015] py-5 px-5 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-zinc-600 text-xs font-medium uppercase tracking-widest mb-5">
            Funciona con las plataformas que ya usás
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {integrations.map((i) => (
              <span
                key={i.label}
                className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] text-zinc-400 text-xs font-medium px-4 py-2 rounded-full"
              >
                {i.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="py-12 px-5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.06]">
          {stats.map((s) => (
            <div key={s.label} className="text-center py-8 px-4 bg-zinc-950">
              <p className="text-4xl font-bold text-white mb-1.5 tracking-tight">{s.value}</p>
              <p className="text-zinc-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-4">Funciones</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Todo lo que necesitás para vender más
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Un agente entrenado en tu negocio, conectado a los canales donde ya están tus clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 premium-glass"
              >
                <div className="icon-ring text-emerald-400 mb-5">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2 text-[15px]">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-5 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-4">Proceso</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Listo en 3 pasos</h2>
            <p className="text-zinc-400 text-lg">Sin desarrolladores. Sin integraciones complicadas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />

            {steps.map((s) => (
              <div key={s.n} className="text-center relative">
                <div className="w-20 h-20 bg-zinc-900 border border-emerald-500/25 rounded-2xl flex flex-col items-center justify-center mx-auto mb-5 relative z-10 gap-1.5">
                  <span className="text-emerald-400">{s.icon}</span>
                  <span className="text-[10px] font-bold text-emerald-500/60 tracking-widest">{s.n}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-4">Clientes</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Negocios que ya venden en automático
            </h2>
            <p className="text-zinc-400 text-lg">Resultados reales de clientes reales.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="premium-glass p-6 flex flex-col gap-4"
              >
                <div className="stars text-sm">★★★★★</div>
                <p className="text-zinc-300 text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-none mb-1">{t.name}</p>
                    <p className="text-zinc-500 text-xs">{t.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-5 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-4">Precios</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple y transparente</h2>
            <p className="text-zinc-400 text-lg">14 días gratis en cualquier plan. Sin tarjeta de crédito.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 flex flex-col relative premium-glass ${
                  plan.highlight
                    ? "ring-1 ring-emerald-400/50 shadow-2xl shadow-emerald-500/25"
                    : "text-zinc-100"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-emerald-600 text-[11px] font-bold px-3.5 py-1 rounded-full tracking-wide">
                    MAS POPULAR
                  </div>
                )}

                <div className="mb-7">
                  <p className={`text-xs font-medium mb-2 ${plan.highlight ? "text-emerald-100" : "text-zinc-500"}`}>
                    {plan.desc}
                  </p>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={`text-xs ${plan.highlight ? "text-emerald-100" : "text-zinc-500"}`}>USD</span>
                    <span className="text-5xl font-bold tracking-tight">${plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? "text-emerald-100" : "text-zinc-500"}`}>/mes</span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? "text-emerald-50" : "text-zinc-300"}`}>
                      <svg
                        className={`mt-0.5 shrink-0 ${plan.highlight ? "text-white" : "text-emerald-400"}`}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/onboarding"
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? "btn-glow"
                      : "btn-secondary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-zinc-500 text-sm mt-10">
            ¿Necesitás un plan personalizado?{" "}
            <a href="mailto:hola@vendly.app" className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2">
              Hablemos
            </a>
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Preguntas frecuentes</h2>
            <p className="text-zinc-400 text-lg">Todo lo que necesitás saber antes de empezar.</p>
          </div>

          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-5 bg-white/[0.015] border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-emerald-500/[0.04] rounded-3xl blur-3xl pointer-events-none" />
          <div className="relative border border-emerald-500/15 bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-3xl p-12 md:p-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-slow" />
              Tu agente IA te espera
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Empezá hoy, vendé desde mañana
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
              14 días gratis, sin tarjeta de crédito. Setup en menos de 10 minutos.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-10 py-4 text-base btn-glow"
            >
              Crear mi cuenta gratis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> Sin tarjeta
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> Setup en 10 minutos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> Cancela cuando quieras
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-12 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div>
              <span className="font-bold text-white text-lg tracking-tight">
                Vendly<span className="text-emerald-400">.</span>
              </span>
              <p className="mt-2 text-zinc-500 text-sm max-w-xs">
                Agente IA para WhatsApp e Instagram. Automatizá tus ventas, atendé 24/7.
              </p>
            </div>
            <div className="flex flex-wrap gap-12 text-sm">
              <div className="flex flex-col gap-3">
                <p className="text-zinc-400 font-medium text-xs uppercase tracking-widest">Producto</p>
                <a href="#features" className="text-zinc-500 hover:text-white transition-colors">Funciones</a>
                <a href="#pricing" className="text-zinc-500 hover:text-white transition-colors">Precios</a>
                <a href="#faq" className="text-zinc-500 hover:text-white transition-colors">FAQ</a>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-zinc-400 font-medium text-xs uppercase tracking-widest">Empresa</p>
                <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">Privacidad</Link>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors">Términos</a>
                <a href="mailto:hola@vendly.app" className="text-zinc-500 hover:text-white transition-colors">Contacto</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-600">
            <p>© 2026 Vendly. Todos los derechos reservados.</p>
            <p>Powered by Claude AI · Meta Cloud API oficial</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

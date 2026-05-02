"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonials';

// Generamos 24 testimonios únicos, sin repetir, para lograr aleatoriedad real y variedad visual.
const testimonialsCol1 = [
  { name: "Carla Méndez", username: "@carlam", body: "Vendly ha automatizado nuestras consultas al 100%. Las reservas subieron y mi equipo tiene menos estrés.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", country: "🇨🇴 Colombia" },
  { name: "Diego Ríos", username: "@diegor", body: "¡Increíble la rapidez de la IA! Nuestros clientes reciben información precisa sobre sus envíos en segundos.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop", country: "🇦🇷 Argentina" },
  { name: "Sofía Paredes", username: "@sofiap", body: "El soporte de ventas se transformó. Las campañas de WhatsApp son el mejor canal de marketing que tenemos.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", country: "🇵🇪 Perú" },
  { name: "Mateo Rossi", username: "@mateorossi", body: "Lo configuramos sin ser programadores. En 10 minutos ya teníamos la IA vendiendo los productos de temporada.", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop", country: "🇮🇹 Italy" },
  { name: "Ava Green", username: "@avagreen", body: "Un retorno de inversión brutal. Lo que pagamos al mes se recupera con las primeras dos ventas automatizadas.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", country: "🇦🇺 Australia" },
  { name: "Lucas Stone", username: "@lucas", body: "Antes se nos escapaban leads de Instagram en la madrugada. Ahora la tienda nunca cierra.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", country: "🇪🇸 Spain" },
];

const testimonialsCol2 = [
  { name: "Ana Martínez", username: "@anamart", body: "El tono del agente es súper natural. Los clientes a veces creen que están hablando directamente conmigo.", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop", country: "🇲🇽 México" },
  { name: "Julian Fox", username: "@jfox", body: "Centralizar Instagram y WhatsApp en una misma plataforma nos simplificó la logística diaria.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", country: "🇺🇸 USA" },
  { name: "Elena Rojas", username: "@elenar", body: "Las métricas del dashboard son súper claras. Sé exactamente cuántas consultas terminaron en ventas hoy.", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", country: "🇨🇱 Chile" },
  { name: "Carlos Silva", username: "@carlosilva", body: "Escalar de 50 a 500 chats por día fue transparente. La IA maneja los picos de tráfico perfectamente.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop", country: "🇧🇷 Brasil" },
  { name: "Emma Lee", username: "@emmalee", body: "La derivación a humanos funciona excelente. La IA detecta quejas y me notifica al instante.", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop", country: "🇨🇦 Canadá" },
  { name: "Daniel O.", username: "@danielo", body: "Ahorramos la contratación de dos agentes nocturnos. Vendly es nuestro empleado del mes, literal.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop", country: "🇺🇾 Uruguay" },
];

const testimonialsCol3 = [
  { name: "Mariana L.", username: "@maril", body: "Subí mi catálogo en PDF y la IA ya sabía todos los precios y talles. Increíble cómo aprende sola.", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop", country: "🇪🇨 Ecuador" },
  { name: "Hugo P.", username: "@hugo_p", body: "Conectamos todo en un clic. Nunca imaginé que tener mi propio bot con IA fuera tan fácil.", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop", country: "🇵🇾 Paraguay" },
  { name: "Valeria G.", username: "@valg", body: "Teníamos miedo de perder la calidez humana, pero configuramos el tono 'amigable' y a la gente le encanta.", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop", country: "🇩🇴 Rep. Dom." },
  { name: "Andrés M.", username: "@andresm", body: "Usamos las respuestas para agendar citas médicas. El asistente toma turnos por nosotros y reduce las faltas.", img: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=150&h=150&fit=crop", country: "🇨🇷 Costa Rica" },
  { name: "Julia N.", username: "@julian", body: "Hicimos un blast por WhatsApp por Black Friday. La IA atajó el 90% de las consultas y vendimos récord.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", country: "🇵🇦 Panamá" },
  { name: "Leo T.", username: "@leot", body: "Llevo 2 años usando bots, pero los basados en IA de Vendly son otro nivel. Ya no hay flujos que se traban.", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop", country: "🇬🇹 Guatemala" },
];

const testimonialsCol4 = [
  { name: "Laura S.", username: "@lauras", body: "Excelente soporte, el panel de conocimiento de RAG te permite ajustar hasta el mínimo detalle del local.", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", country: "🇸🇻 El Salvador" },
  { name: "Martín C.", username: "@martinc", body: "El inbox centralizado es todo lo que necesitaba. Veo todo lo que la IA gestiona y solo entro cuando es necesario.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop", country: "🇭🇳 Honduras" },
  { name: "Camila V.", username: "@camilav", body: "El onboarding fue súper guiado. Enseguida vinculamos el Meta App y empezamos a despachar dudas.", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop", country: "🇳🇮 Nicaragua" },
  { name: "Tomás R.", username: "@tomasr", body: "Ya no pierdo tiempo copiando CBU ni links de pago. La IA los da solo cuando hay intención real de compra.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", country: "🇧🇴 Bolivia" },
  { name: "Lucía M.", username: "@luciam", body: "Aumentamos un 40% el ticket promedio, porque la IA sugiere accesorios automáticamente en cada compra.", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop", country: "🇵🇷 Puerto Rico" },
  { name: "Pedro A.", username: "@pedroa", body: "El agente sabe más de nuestros vinos que algunos empleados nuevos. Extrae todo del PDF que le cargamos.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop", country: "🇨🇺 Cuba" },
];

function TestimonialCard({ img, name, username, body, country }: any) {
  return (
    <Card className="w-72 shrink-0 premium-glass border border-white/5 bg-zinc-900/40 [backface-visibility:hidden]">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-1 ring-emerald-500/20">
            <AvatarImage src={img} alt={username} loading="eager" fetchPriority="high" />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              {name} <span className="text-[10px] text-zinc-500">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-emerald-400">{username}</p>
          </div>
        </div>
        <blockquote className="mt-4 text-[13px] text-zinc-300 leading-relaxed">&ldquo;{body}&rdquo;</blockquote>
      </CardContent>
    </Card>
  );
}

export function TestimonialsDemo() {
  return (
    <div className="relative flex h-[700px] w-full items-center justify-center overflow-hidden [perspective:1000px]">
      {/* Background glow para darle profundidad a la sección */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
      
      <div
        className="flex flex-row items-center gap-4 md:gap-6 [transform-style:preserve-3d]"
        style={{
          width: "120vw", /* Expandimos un poco más del 100% para evitar bordes cortados con la rotación */
          transform: 'translateX(-5vw) translateY(20px) translateZ(-50px) rotateX(15deg) rotateY(-10deg) rotateZ(8deg)',
        }}
      >
        {/* Columna 1 (Hacia abajo) */}
        <Marquee vertical repeat={3} style={{ "--duration": "45s" } as React.CSSProperties} className="will-change-transform">
          {testimonialsCol1.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>

        {/* Columna 2 (Hacia arriba) */}
        <Marquee vertical reverse repeat={3} style={{ "--duration": "55s" } as React.CSSProperties} className="will-change-transform">
          {testimonialsCol2.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>

        {/* Columna 3 (Hacia abajo) */}
        <Marquee vertical repeat={3} style={{ "--duration": "50s" } as React.CSSProperties} className="will-change-transform">
          {testimonialsCol3.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>

        {/* Columna 4 (Hacia arriba) */}
        <Marquee vertical reverse repeat={3} style={{ "--duration": "48s" } as React.CSSProperties} className="will-change-transform">
          {testimonialsCol4.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        
        {/* Columna 5 (Hacia abajo - Para llenar el espacio expandido) */}
        <Marquee vertical repeat={3} className="hidden md:flex will-change-transform" style={{ "--duration": "52s" } as React.CSSProperties}>
          {[...testimonialsCol1].reverse().map((review) => (
            <TestimonialCard key={review.username + '5'} {...review} />
          ))}
        </Marquee>
      </div>

      {/* Gradient overlays: Transiciones suaves hacia el fondo principal */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-[#030305] via-[#030305]/90 to-transparent"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#030305] to-transparent hidden md:block"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#030305] to-transparent hidden md:block"></div>
    </div>
  );
}

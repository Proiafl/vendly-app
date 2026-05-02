import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-32 pb-24 px-6">
        <div className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Política de Privacidad
          </h1>
          <p className="text-zinc-500 text-sm">Última actualización: 30 de abril de 2026</p>
        </div>

        <div className="space-y-10 text-zinc-400 leading-relaxed">
          <section className="premium-glass p-8 border-white/[0.05]">
            <h2 className="text-xl font-semibold text-white mb-4">1. Información que Recopilamos</h2>
            <p className="mb-4">
              En Vendly, recopilamos información necesaria para proporcionar y mejorar nuestro servicio de agentes de IA para WhatsApp e Instagram. Esto incluye:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Información de contacto (nombre, correo electrónico, número de teléfono).</li>
              <li>Datos de las plataformas de Meta (WhatsApp Business API e Instagram Messaging) necesarios para la integración.</li>
              <li>Historial de conversaciones procesadas por el agente de IA para fines de mejora del servicio y entrenamiento (RAG).</li>
              <li>Información de pago procesada de forma segura a través de proveedores externos (Stripe).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Uso de la Información</h2>
            <p className="mb-4">Utilizamos la información recopilada para:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Configurar y gestionar su cuenta y el agente de IA personalizado.</li>
              <li>Procesar y responder mensajes automáticos en sus canales de Meta conectados.</li>
              <li>Analizar métricas de rendimiento y comportamiento del agente.</li>
              <li>Enviar comunicaciones importantes relacionadas con el servicio y actualizaciones de seguridad.</li>
            </ul>
          </section>

          <section className="premium-glass p-8 border-white/[0.05]">
            <h2 className="text-xl font-semibold text-white mb-4">3. Integraciones de Terceros (Meta y AI)</h2>
            <p className="mb-4">
              Nuestra solución utiliza la API oficial de Meta Cloud. Al conectar sus cuentas, usted acepta que ciertos datos sean procesados por Meta de acuerdo con sus propias políticas de privacidad.
            </p>
            <p>
              Asimismo, procesamos el contenido de los mensajes utilizando modelos de lenguaje avanzado (como Claude de Anthropic) para generar respuestas precisas. Estos datos se manejan de forma segura y no se utilizan para el entrenamiento general de modelos públicos de terceros sin su consentimiento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la alteración. Sus credenciales de API y tokens de acceso se almacenan de forma encriptada en nuestra infraestructura de base de datos protegida por Supabase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Sus Derechos</h2>
            <p>
              Usted tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento. Puede gestionar gran parte de esta información directamente desde su Dashboard o contactándonos en <a href="mailto:privacy@vendly.app" className="text-emerald-400 hover:underline">privacy@vendly.app</a>.
            </p>
          </section>

          <section className="pt-10 border-t border-white/[0.05]">
            <p className="text-sm">
              Al utilizar Vendly, usted acepta los términos descritos en esta Política de Privacidad. Nos reservamos el derecho de actualizar esta política periódicamente para reflejar cambios en nuestras prácticas o requisitos legales.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-12 px-5 text-center text-zinc-600 text-xs">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Inicio</Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Términos</Link>
          <a href="mailto:hola@vendly.app" className="hover:text-zinc-400 transition-colors">Contacto</a>
        </div>
        <p>© 2026 Vendly. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

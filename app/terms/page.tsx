import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function TermsPage() {
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
            Términos de Servicio
          </h1>
          <p className="text-zinc-500 text-sm">Última actualización: 2 de mayo de 2026</p>
        </div>

        <div className="space-y-10 text-zinc-400 leading-relaxed">
          <section className="premium-glass p-8 border-white/[0.05]">
            <h2 className="text-xl font-semibold text-white mb-4">1. Acuerdo de Uso</h2>
            <p>
              Al acceder o utilizar Vendly (https://vendly.app), usted declara que tiene la autoridad total para obligarse a sí mismo o a la entidad legal que representa. El uso continuado del sitio constituye la lectura y aceptación de estos términos, así como de nuestra Política de Privacidad. Nos reservamos el derecho de denegar el acceso a cualquier persona por cualquier motivo legal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Registro y Seguridad</h2>
            <p className="mb-4">
              Para utilizar nuestros servicios, es posible que deba registrarse en el sitio. Usted se compromete a:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Proporcionar información veraz, exacta y completa.</li>
              <li>Mantener la confidencialidad de su contraseña y cuenta.</li>
              <li>Ser responsable de todas las actividades que ocurran bajo su cuenta.</li>
              <li>Notificarnos inmediatamente cualquier uso no autorizado de su cuenta.</li>
            </ul>
          </section>

          <section className="premium-glass p-8 border-white/[0.05]">
            <h2 className="text-xl font-semibold text-white mb-4">3. Propiedad Intelectual</h2>
            <p>
              A menos que se indique lo contrario, el Sitio es nuestra propiedad exclusiva. Todo el código fuente, bases de datos, funcionalidad, software, diseños del sitio web, audio, video, texto y gráficos en el Sitio (colectivamente, el "Contenido") y las marcas comerciales están protegidos por leyes de derechos de autor y propiedad intelectual. No se permite la copia o reproducción total o parcial sin nuestro consentimiento expreso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Descargo de Responsabilidad</h2>
            <p>
              El sitio se proporciona "tal cual" y "según disponibilidad". Usted acepta que el uso de nuestros servicios es bajo su propio riesgo. Vendly no garantiza que los resultados obtenidos del uso del servicio sean precisos o confiables en todo momento, dada la naturaleza cambiante de los modelos de IA y las APIs de terceros (como Meta).
            </p>
          </section>

          <section className="premium-glass p-8 border-white/[0.05]">
            <h2 className="text-xl font-semibold text-white mb-4">5. Limitación de Responsabilidad</h2>
            <p>
              En ningún caso Vendly, sus directores o empleados serán responsables ante usted por daños directos, indirectos, incidentales o consecuentes que resulten de cualquier error o inexactitud en el contenido, o de la interrupción del servicio fuera de nuestro control razonable (como caídas de servicios de Meta o infraestructura de red).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Integraciones de Terceros</h2>
            <p>
              Nuestra plataforma interactúa con servicios de terceros, incluyendo pero no limitado a Meta (WhatsApp, Instagram) y modelos de lenguaje avanzado. Usted reconoce que el uso de estas herramientas está sujeto también a los términos y condiciones de dichos proveedores.
            </p>
          </section>

          <section className="pt-10 border-t border-white/[0.05]">
            <p className="text-sm">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los usuarios tienen el deber de revisarlos periódicamente para mantenerse informados. El uso continuo tras cualquier cambio implica la aceptación de los nuevos términos.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-12 px-5 text-center text-zinc-600 text-xs">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Inicio</Link>
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacidad</Link>
          <a href="mailto:hola@vendly.app" className="hover:text-zinc-400 transition-colors">Contacto</a>
        </div>
        <p>© 2026 Vendly. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

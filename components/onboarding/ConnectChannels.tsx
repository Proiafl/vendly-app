"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { callFunction } from "@/lib/functions";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface ConnectChannelsProps {
  tenantId: string;
  onComplete?: (result: { whatsapp: number; instagram: number }) => void;
}

export default function ConnectChannels({ tenantId, onComplete }: ConnectChannelsProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "connecting" | "success" | "error">("idle");
  const [result, setResult] = useState<{ whatsapp: number; instagram: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.FB) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_META_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v20.0",
      });
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleConnect = () => {
    setLoading(true);
    setStatus("connecting");
    setError(null);

    window.FB.login(
      async (response: any) => {
        if (response.authResponse?.code) {
          try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await callFunction("meta-callback", {
              method: "POST",
              body: { code: response.authResponse.code, tenantId },
              token,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error ?? "Error desconocido");

            setResult(data);
            setStatus("success");
            onComplete?.(data);
          } catch (err: any) {
            setError(err.message);
            setStatus("error");
          }
        } else {
          setError("Conexion cancelada o denegada");
          setStatus("error");
        }
        setLoading(false);
      },
      {
        config_id: process.env.NEXT_PUBLIC_META_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "",
          sessionInfoVersion: "2",
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Conecta tus canales</h2>
        <p className="mt-2 text-gray-500 text-sm">
          Conecta WhatsApp e Instagram con un solo clic para que el agente IA empiece a responder.
        </p>
      </div>

      {status === "idle" || status === "connecting" ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-3 px-6 rounded-2xl transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <MetaIcon />
          )}
          {loading ? "Conectando..." : "Conectar con Meta"}
        </button>
      ) : null}

      {status === "success" && result && (
        <div className="w-full bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-green-700 font-medium">Conexion exitosa</p>
          <p className="text-green-600 text-sm mt-1">
            {result.whatsapp} numero(s) de WhatsApp · {result.instagram} cuenta(s) de Instagram
          </p>
        </div>
      )}

      {status === "error" && error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-red-700 font-medium">Error al conectar</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => { setStatus("idle"); setError(null); }}
            className="mt-3 text-sm text-red-600 underline"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Tus datos se almacenan de forma segura. Puedes desconectar en cualquier momento desde la configuracion.
      </p>
    </div>
  );
}

function MetaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

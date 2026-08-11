"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas o error al iniciar sesión.");
      setCargando(false);
    } else {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-[#2c1d11] flex flex-col items-center justify-center p-4">
      <div className="bg-[#8B5A2B] p-8 rounded-2xl shadow-2xl border-4 border-[#5c3a1b] w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#f2efe9] font-serif text-center mb-6">
          Acceso Administrador
        </h1>

        {error && (
          <div className="bg-red-800 text-white p-3 rounded-lg text-sm text-center mb-4 font-serif">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-[#f2efe9] text-sm font-serif mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#f2efe9] text-[#2b2927] border border-[#5c3a1b] focus:outline-none focus:ring-2 focus:ring-[#2b2927]"
            />
          </div>

          <div>
            <label className="block text-[#f2efe9] text-sm font-serif mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#f2efe9] text-[#2b2927] border border-[#5c3a1b] focus:outline-none focus:ring-2 focus:ring-[#2b2927]"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="mt-4 bg-[#f2efe9] hover:bg-white text-[#2b2927] font-serif font-bold py-2.5 px-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {cargando ? "Iniciando sesión..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Nota from "@/components/Nota";
import ModalLectura from "@/components/ModalLectura";
import CrearNotaModal from "@/components/CrearNotaModal";

// Cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modoEliminar, setModoEliminar] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [listaDeNotas, setListaDeNotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState(null);

  // 1. Verificar si hay un administrador logueado
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Cargar notas DESDE SUPABASE (Servidor en la nube)
  const cargarNotas = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from("notas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al cargar notas de Supabase:", error.message);
    } else if (data) {
      // Mapeamos los nombres de columnas de la BD al formato del componente
      const notasFormateadas = data.map((n) => ({
        id: n.id,
        titulo: n.titulo,
        extracto: n.extracto,
        contenido: n.contenido,
        imagenUrl: n.imagen_url,
        fecha: n.fecha,
      }));
      setListaDeNotas(notasFormateadas);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarNotas();
  }, []);

  // 3. Guardar nota EN SUPABASE
  const agregarNota = async (nuevaNota) => {
    const { data, error } = await supabase
      .from("notas")
      .insert([
        {
          titulo: nuevaNota.titulo,
          extracto: nuevaNota.extracto,
          contenido: nuevaNota.contenido,
          imagen_url: nuevaNota.imagenUrl,
          fecha: nuevaNota.fecha,
        },
      ])
      .select();

    if (error) {
      alert("Error al guardar en Supabase: " + error.message);
    } else if (data && data.length > 0) {
      const notaGuardada = {
        id: data[0].id,
        titulo: data[0].titulo,
        extracto: data[0].extracto,
        contenido: data[0].contenido,
        imagenUrl: data[0].imagen_url,
        fecha: data[0].fecha,
      };
      setListaDeNotas((prev) => [notaGuardada, ...prev]);
    }
  };

  // 4. Eliminar nota EN SUPABASE
  const eliminarNota = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta nota?");
    if (!confirmacion) return;

    const { error } = await supabase.from("notas").delete().eq("id", id);

    if (error) {
      alert("Error al eliminar nota de Supabase: " + error.message);
    } else {
      setListaDeNotas((prev) => prev.filter((nota) => nota.id !== id));
    }
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-[#2c1d11] flex items-center justify-center text-[#f2efe9] font-serif">
        Cargando escritos...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#2c1d11] p-8 flex flex-col items-center relative pb-24">
      {/* Botón de Login/Logout discreto */}
      <div className="absolute top-4 right-4 z-10">
        {usuario ? (
          <button
            onClick={handleCerrarSesion}
            className="text-xs text-[#a89f91] hover:text-[#f2efe9] underline font-serif transition-all"
          >
            Cerrar Sesión (Admin)
          </button>
        ) : (
          <Link
            href="/login"
            className="text-xs text-[#a89f91]/50 hover:text-[#a89f91] underline font-serif transition-all"
          >
            Admin
          </Link>
        )}
      </div>

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#f2efe9] font-serif">
          Escritos
        </h1>
        <p className="text-[#a89f91] italic mt-2">
          Solo una persona mas queriendo hacer sentido de la vida
        </p>
      </header>

      {/* Tablero estilo corcho */}
      <section className="w-full max-w-5xl min-h-[600px] bg-[#8B5A2B] rounded-2xl p-8 shadow-2xl border-8 border-[#5c3a1b] flex flex-wrap gap-6 items-start">
        {listaDeNotas.length === 0 ? (
          <div className="w-full text-center text-[#f2efe9]/70 py-20 italic">
            El tablero está vacío.
          </div>
        ) : (
          listaDeNotas.map((nota) => (
            <Nota
              key={nota.id}
              titulo={nota.titulo}
              extracto={nota.extracto}
              imagenUrl={nota.imagenUrl}
              modoEliminar={usuario && modoEliminar}
              alHacerClic={() => setNotaSeleccionada(nota)}
              alEliminar={() => eliminarNota(nota.id)}
            />
          ))
        )}
      </section>

      {/* Menú Flotante Agrupado: SOLO VISIBLE SI ESTÁS LOGUEADO */}
      {usuario && (
        <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-40">
          {menuAbierto && (
            <div className="flex flex-col gap-2 items-end mb-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <button
                onClick={() => {
                  setModalCrearAbierto(true);
                  setMenuAbierto(false);
                }}
                className="bg-[#f2efe9] hover:bg-white text-[#2b2927] px-4 py-2 rounded-full shadow-lg border border-[#2b2927] font-serif font-bold text-sm flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>✍️ Nueva Nota</span>
              </button>

              <button
                onClick={() => {
                  setModoEliminar(!modoEliminar);
                  setMenuAbierto(false);
                }}
                className={`px-4 py-2 rounded-full shadow-lg border font-serif font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 ${
                  modoEliminar
                    ? "bg-red-600 text-white border-red-800"
                    : "bg-[#f2efe9] hover:bg-white text-[#2b2927] border-[#2b2927]"
                }`}
              >
                <span>{modoEliminar ? "🔴 Ocultar Canecas" : "⚙️ Modo Eliminar"}</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className={`font-serif font-bold text-2xl w-14 h-14 rounded-full shadow-2xl border-2 border-[#2b2927] flex items-center justify-center transition-all ${
              menuAbierto
                ? "bg-red-700 text-white rotate-45"
                : "bg-[#f2efe9] text-[#2b2927] hover:bg-white hover:scale-105 active:scale-95"
            }`}
            title="Menú de opciones"
          >
            +
          </button>
        </div>
      )}

      {/* Modales */}
      <ModalLectura
        nota={notaSeleccionada}
        alCerrar={() => setNotaSeleccionada(null)}
      />

      <CrearNotaModal
        estaAbierto={modalCrearAbierto}
        alCerrar={() => setModalCrearAbierto(false)}
        alGuardar={agregarNota}
      />
    </main>
  );
}
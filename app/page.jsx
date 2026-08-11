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
  const [cargado, setCargado] = useState(false);
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

  // Cargar notas desde localStorage
  useEffect(() => {
    const notasGuardadas = localStorage.getItem("tablero_pensamientos");
    if (notasGuardadas) {
      try {
        setListaDeNotas(JSON.parse(notasGuardadas));
      } catch (e) {
        setListaDeNotas([]);
      }
    } else {
      setListaDeNotas([]);
    }
    setCargado(true);
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (cargado) {
      localStorage.setItem("tablero_pensamientos", JSON.stringify(listaDeNotas));
    }
  }, [listaDeNotas, cargado]);

  const agregarNota = (nuevaNota) => {
    setListaDeNotas((prevNotas) => [nuevaNota, ...prevNotas]);
  };

  const eliminarNota = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta nota?");
    if (confirmacion) {
      setListaDeNotas((prevNotas) => prevNotas.filter((nota) => nota.id !== id));
    }
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  if (!cargado) return null;

  return (
    <main className="min-h-screen bg-[#2c1d11] p-8 flex flex-col items-center relative pb-24">
      {/* Botón de Login/Logout discreto en la esquina superior */}
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
              modoEliminar={usuario && modoEliminar} // Solo permite eliminar si es usuario autenticado
              alHacerClic={() => setNotaSeleccionada(nota)}
              alEliminar={() => eliminarNota(nota.id)}
            />
          ))
        )}
      </section>

      {/* Menú Flotante Agrupado: SOLO VISIBLE SI HAY USUARIO AUTENTICADO */}
      {usuario && (
        <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-40">
          {/* Opciones desplegadas */}
          {menuAbierto && (
            <div className="flex flex-col gap-2 items-end mb-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
              {/* Opción 1: Crear Nota */}
              <button
                onClick={() => {
                  setModalCrearAbierto(true);
                  setMenuAbierto(false);
                }}
                className="bg-[#f2efe9] hover:bg-white text-[#2b2927] px-4 py-2 rounded-full shadow-lg border border-[#2b2927] font-serif font-bold text-sm flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>✍️ Nueva Nota</span>
              </button>

              {/* Opción 2: Toggle Eliminar */}
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

          {/* Botón Principal (Toggle del menú) */}
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
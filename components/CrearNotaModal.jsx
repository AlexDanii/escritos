"use client";

import React, { useState } from "react";

function CrearNotaModal({ estaAbierto, alCerrar, alGuardar }) {
  const [titulo, setTitulo] = useState("");
  const [extracto, setExtracto] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");

  if (!estaAbierto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo || !contenido) return;

    const nuevaNota = {
      id: Date.now().toString(),
      titulo,
      extracto: extracto || contenido.slice(0, 60) + "...",
      contenido,
      fecha: new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      imagenUrl: imagenUrl.trim() || null,
    };

    alGuardar(nuevaNota);
    setTitulo("");
    setExtracto("");
    setContenido("");
    setImagenUrl("");
    alCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-lg bg-[#f2efe9] text-[#2b2927] p-6 md:p-8 rounded-sm shadow-2xl border border-[#d6cfc2] font-serif">
        <button
          onClick={alCerrar}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-sans font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold border-b-2 border-[#2b2927] pb-2 mb-6 text-center uppercase tracking-wide">
          Nuevo Pensamiento
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
          <div>
            <label className="block font-serif font-bold text-gray-800 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Idea para mi proyecto..."
              className="w-full p-2 bg-[#fdfbf7] border border-gray-400 rounded focus:outline-none focus:border-black font-serif text-base"
            />
          </div>

          <div>
            <label className="block font-serif font-bold text-gray-800 mb-1">
              Resumen corto (para la tarjeta)
            </label>
            <input
              type="text"
              value={extracto}
              onChange={(e) => setExtracto(e.target.value)}
              placeholder="Una breve frase..."
              className="w-full p-2 bg-[#fdfbf7] border border-gray-400 rounded focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block font-serif font-bold text-gray-800 mb-1">
              Contenido completo *
            </label>
            <textarea
              required
              rows={4}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe aquí tu pensamiento en detalle..."
              className="w-full p-2 bg-[#fdfbf7] border border-gray-400 rounded focus:outline-none focus:border-black font-serif text-base leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-serif font-bold text-gray-800 mb-1">
              URL de Imagen (Opcional)
            </label>
            <input
              type="url"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://ejemplo.com/foto.jpg"
              className="w-full p-2 bg-[#fdfbf7] border border-gray-400 rounded focus:outline-none focus:border-black text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-300">
            <button
              type="button"
              onClick={alCerrar}
              className="px-4 py-2 text-gray-600 hover:text-black font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#2b2927] text-[#f2efe9] hover:bg-black font-serif font-bold rounded shadow transition-colors"
            >
              Fijar al Tablero
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearNotaModal;
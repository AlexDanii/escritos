"use client";

import React from "react";

function ModalLectura({ nota, alCerrar }) {
  if (!nota) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-3xl bg-[#f2efe9] text-[#2b2927] p-8 md:p-12 rounded-sm shadow-2xl border border-[#d6cfc2] font-serif max-h-[90vh] overflow-y-auto">
        <button
          onClick={alCerrar}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-sans font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
        >
          ✕
        </button>

        <div className="border-b-2 border-[#2b2927] pb-4 mb-6 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
            {nota.fecha || "Pensamiento Guardado"}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {nota.titulo}
          </h2>
        </div>

        <div className={`grid grid-cols-1 ${nota.imagenUrl ? "md:grid-cols-2" : ""} gap-6 items-start`}>
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-justify first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:font-serif">
              {nota.contenido}
            </p>
          </div>

          {nota.imagenUrl && (
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white border border-gray-300 shadow-md transform rotate-1">
                <img
  src={nota.imagenUrl}
  alt={nota.titulo}
  className="w-full h-auto max-h-80 object-cover" // 👈 Removidos 'grayscale' y 'contrast-125'
/>
                <p className="text-xs text-center text-gray-500 mt-2 italic font-sans">
                  Imagen adjunta a la entrada
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-400 text-right text-xs italic text-gray-600 font-sans">
          Escrito por Dan
        </div>
      </div>
    </div>
  );
}

export default ModalLectura;
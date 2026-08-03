"use client";

import React from "react";

export default function Nota({
  titulo,
  extracto,
  imagenUrl,
  modoEliminar,
  alHacerClic,
  alEliminar,
}) {
  return (
    <div
      onClick={alHacerClic}
      className="w-64 p-4 bg-[#fef08a] text-gray-800 rounded-sm shadow-md cursor-pointer hover:scale-105 hover:shadow-xl transition-all transform -rotate-1 relative font-sans border-t-8 border-[#facc15]"
    >
      {/* Pin rojo */}
      <div className="w-4 h-4 bg-red-600 rounded-full absolute -top-3 left-1/2 -translate-x-1/2 shadow-md border border-red-800 pointer-events-none"></div>

      {/* La caneca SOLAMENTE se renderiza si modoEliminar es true */}
      {modoEliminar && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (alEliminar) alEliminar();
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            zIndex: 50,
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
          title="Eliminar nota"
        >
          🗑
        </button>
      )}

      {/* Título */}
      <h3 className={`font-bold text-lg mb-2 font-serif border-b border-yellow-300 pb-1 leading-tight ${modoEliminar ? "pr-8" : ""}`}>
        {titulo}
      </h3>

      {/* Foto */}
      {imagenUrl && (
        <div className="w-full h-32 rounded mb-2 overflow-hidden border border-yellow-400 bg-gray-200 pointer-events-none">
          <img
            src={imagenUrl}
            alt={titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Extracto */}
      <p className="text-sm text-gray-700 line-clamp-3 italic pointer-events-none">
        "{extracto}"
      </p>

      <div className="mt-3 text-right">
        <span className="text-xs text-yellow-800 font-semibold hover:underline">
          Leer más →
        </span>
      </div>
    </div>
  );
}
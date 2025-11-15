
'use client'

export function SimpleVoiceTest() {
  console.log('🟢 SimpleVoiceTest renderizado')
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#F5F0E8] via-white to-[#FAF7F2]">
      {/* Área de scroll */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-[#8B7355] mb-4">Test del Chat de Voz</h2>
        <p className="text-[#8B7355]">Si puedes ver los botones de abajo, el layout funciona correctamente.</p>
      </div>
      
      {/* CONTROLES FIJOS */}
      <div className="flex-shrink-0 border-t-2 border-[#E8DCC8] bg-white/95 backdrop-blur-sm p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-5">
            <button className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-white text-xl shadow-2xl">
              🎤
            </button>
            <button className="w-16 h-16 rounded-full border-3 border-[#E8DCC8] bg-white text-xl shadow-xl">
              🔊
            </button>
          </div>
          <p className="text-sm text-green-700 bg-green-50 rounded-lg py-2 px-4">
            ✅ Los controles están visibles - el layout funciona
          </p>
        </div>
      </div>
    </div>
  )
}

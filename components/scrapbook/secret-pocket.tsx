
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, Sparkles, Save, Key, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface SecretPocketProps {
  pageId: string
  initialNotes?: string
  onSave: (notes: string) => Promise<void>
}

export default function SecretPocket({ pageId, initialNotes = '', onSave }: SecretPocketProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLocked, setIsLocked] = useState(true)
  const [notes, setNotes] = useState(initialNotes)
  const [isSaving, setIsSaving] = useState(false)
  
  // Estados para la contraseña
  const [hasPassword, setHasPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showSetPasswordDialog, setShowSetPasswordDialog] = useState(false)
  const [inputPassword, setInputPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Cargar la contraseña guardada al iniciar
  useEffect(() => {
    const savedPassword = localStorage.getItem(`secret-pocket-password-${pageId}`)
    if (savedPassword) {
      setPassword(savedPassword)
      setHasPassword(true)
    }
  }, [pageId])

  const handleTogglePocket = () => {
    if (!isOpen) {
      // Intentar abrir
      if (hasPassword && !isAuthenticated) {
        setShowPasswordDialog(true)
      } else {
        setIsOpen(true)
        setIsLocked(false)
      }
    } else {
      // Cerrar
      setIsOpen(false)
      setIsLocked(true)
      setIsAuthenticated(false)
    }
  }

  const handlePasswordSubmit = () => {
    if (inputPassword === password) {
      setIsAuthenticated(true)
      setIsOpen(true)
      setIsLocked(false)
      setShowPasswordDialog(false)
      setInputPassword('')
      toast.success('¡Acceso concedido! ✨')
    } else {
      toast.error('Contraseña incorrecta 🔒')
      setInputPassword('')
    }
  }

  const handleSetPassword = () => {
    if (newPassword.length < 4) {
      toast.error('La contraseña debe tener al menos 4 caracteres')
      return
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    localStorage.setItem(`secret-pocket-password-${pageId}`, newPassword)
    setPassword(newPassword)
    setHasPassword(true)
    setShowSetPasswordDialog(false)
    setNewPassword('')
    setConfirmPassword('')
    toast.success('¡Contraseña establecida! 🔐')
  }

  const handleRemovePassword = () => {
    localStorage.removeItem(`secret-pocket-password-${pageId}`)
    setPassword('')
    setHasPassword(false)
    toast.success('Contraseña eliminada')
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(notes)
      toast.success('Notas guardadas en tu bolsillo secreto ✨')
    } catch (error) {
      toast.error('Error al guardar notas')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative perspective-1000"
        style={{ perspective: '1000px' }}
      >
        {/* Bolsillo de cuero realista */}
        <div className="relative">
          {/* Solapa del bolsillo */}
          <motion.div
            className="relative cursor-pointer"
            onClick={handleTogglePocket}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'top center'
            }}
            animate={{
              rotateX: isOpen ? -120 : 0,
              z: isOpen ? 20 : 0
            }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ scale: isOpen ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Textura de cuero - Solapa */}
            <div
              className="relative rounded-t-lg overflow-hidden shadow-lg"
              style={{
                background: `
                  linear-gradient(135deg, 
                    #8B5A3C 0%, 
                    #6B4423 20%,
                    #8B5A3C 40%,
                    #5D3A1A 60%,
                    #8B5A3C 80%,
                    #6B4423 100%
                  )
                `,
                boxShadow: `
                  0 2px 8px rgba(0,0,0,0.3),
                  inset 0 1px 0 rgba(255,255,255,0.1),
                  inset 0 -1px 0 rgba(0,0,0,0.2)
                `
              }}
            >
              {/* Textura de cuero */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    radial-gradient(ellipse at 20% 30%, rgba(0,0,0,0.1) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.1) 0%, transparent 50%),
                    radial-gradient(ellipse at 40% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)
                  `,
                  filter: 'blur(1px)'
                }}
              />

              {/* Costuras decorativas */}
              <div className="absolute top-1 left-2 right-2">
                <div 
                  className="h-px"
                  style={{
                    background: 'repeating-linear-gradient(90deg, #5D3A1A 0px, #5D3A1A 3px, transparent 3px, transparent 8px)'
                  }}
                />
              </div>

              {/* Contenido de la solapa */}
              <div className="px-4 py-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Cerradura metálica */}
                    <div 
                      className="relative"
                      style={{
                        width: '24px',
                        height: '24px',
                        background: 'linear-gradient(135deg, #B8956A 0%, #8B7355 50%, #6B5A45 100%)',
                        borderRadius: '50%',
                        boxShadow: `
                          inset 0 2px 4px rgba(255,255,255,0.3),
                          inset 0 -2px 4px rgba(0,0,0,0.3),
                          0 2px 4px rgba(0,0,0,0.3)
                        `
                      }}
                    >
                      {hasPassword && isLocked ? (
                        <Lock className="h-3.5 w-3.5 text-amber-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5 text-amber-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-serif font-bold text-amber-100 leading-none tracking-wide" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        Bolsillo Secreto
                      </p>
                      <p className="text-[10px] text-amber-200/80 leading-none mt-1" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.3)' }}>
                        {isOpen ? '↑ Cerrar' : hasPassword ? '↓ Desbloquear' : '↓ Abrir'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isOpen && notes && (
                      <motion.span 
                        className="text-[10px] text-amber-200 font-semibold px-2 py-0.5 rounded-full bg-amber-900/30"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        💫 Contenido
                      </motion.span>
                    )}
                    {hasPassword && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
                      >
                        🔐
                      </motion.div>
                    )}
                    <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Borde inferior con relieve */}
              <div 
                className="h-1"
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)'
                }}
              />
            </div>
          </motion.div>

          {/* Cuerpo del bolsillo (base) */}
          <div
            className="relative rounded-b-lg overflow-hidden"
            style={{
              background: `
                linear-gradient(180deg, 
                  #6B4423 0%, 
                  #8B5A3C 20%,
                  #6B4423 50%,
                  #5D3A1A 100%
                )
              `,
              boxShadow: `
                0 4px 12px rgba(0,0,0,0.4),
                inset 0 2px 4px rgba(0,0,0,0.3)
              `,
              minHeight: isOpen ? '0' : '8px'
            }}
          >
            {/* Costuras laterales */}
            <div className="absolute left-2 top-0 bottom-0 w-px opacity-30">
              <div 
                className="h-full"
                style={{
                  background: 'repeating-linear-gradient(0deg, #5D3A1A 0px, #5D3A1A 3px, transparent 3px, transparent 8px)'
                }}
              />
            </div>
            <div className="absolute right-2 top-0 bottom-0 w-px opacity-30">
              <div 
                className="h-full"
                style={{
                  background: 'repeating-linear-gradient(0deg, #5D3A1A 0px, #5D3A1A 3px, transparent 3px, transparent 8px)'
                }}
              />
            </div>
          </div>

          {/* Contenido interior del bolsillo */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, scaleY: 0 }}
                animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
                exit={{ opacity: 0, height: 0, scaleY: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ transformOrigin: 'top center' }}
                className="overflow-hidden"
              >
                <div 
                  className="p-4 rounded-b-lg"
                  style={{
                    background: `
                      linear-gradient(180deg,
                        #FFF8E7 0%,
                        #FFEFD5 50%,
                        #FFE4B5 100%
                      )
                    `,
                    boxShadow: `
                      inset 0 4px 8px rgba(139,90,60,0.2),
                      inset 0 -2px 4px rgba(0,0,0,0.05)
                    `
                  }}
                >
                  {/* Papel antiguo para escribir */}
                  <div className="relative">
                    {/* Textura de papel */}
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none rounded"
                      style={{
                        backgroundImage: `
                          repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            rgba(139,90,60,0.05) 2px,
                            rgba(139,90,60,0.05) 3px
                          )
                        `
                      }}
                    />
                    
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Escribe tus secretos más profundos aquí... 🔐"
                      className="min-h-[120px] bg-white/50 border-2 border-amber-300/50 text-sm font-serif text-amber-900 placeholder:text-amber-500/60 rounded shadow-inner"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(139,90,60,0.1) 29px, rgba(139,90,60,0.1) 30px)'
                      }}
                    />
                  </div>

                  {/* Controles en la parte inferior */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-300/30">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-amber-700 italic flex items-center gap-1">
                        🔒 Privado
                      </span>
                      
                      <Button
                        onClick={() => setShowSetPasswordDialog(true)}
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[10px] px-2 bg-amber-100/50 hover:bg-amber-200/50"
                      >
                        <Key className="h-3 w-3 mr-1" />
                        {hasPassword ? 'Cambiar Clave' : 'Proteger'}
                      </Button>
                      
                      {hasPassword && (
                        <Button
                          onClick={handleRemovePassword}
                          size="sm"
                          variant="ghost"
                          className="h-7 text-[10px] px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Quitar 🔓
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      size="sm"
                      className="h-8 text-xs font-semibold px-4 shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #B8956A 0%, #8B7355 100%)',
                        color: '#FFF8E7'
                      }}
                    >
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      {isSaving ? 'Guardando...' : 'Guardar Secreto'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Diálogo para ingresar contraseña */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-amber-50 to-rose-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-900">
              <Lock className="h-5 w-5" />
              Bolsillo Protegido
            </DialogTitle>
            <DialogDescription>
              Ingresa tu contraseña para acceder a tus notas secretas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Contraseña"
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              className="bg-white/70 border-amber-200"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowPasswordDialog(false)
                  setInputPassword('')
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Unlock className="h-4 w-4 mr-2" />
                Desbloquear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para establecer/cambiar contraseña */}
      <Dialog open={showSetPasswordDialog} onOpenChange={setShowSetPasswordDialog}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-amber-50 to-rose-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-900">
              <Key className="h-5 w-5" />
              {hasPassword ? 'Cambiar Contraseña' : 'Proteger Bolsillo'}
            </DialogTitle>
            <DialogDescription>
              {hasPassword 
                ? 'Establece una nueva contraseña para tu bolsillo secreto'
                : 'Crea una contraseña para proteger tus notas más privadas'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-xs text-amber-700 mb-1 block">
                Nueva contraseña (mínimo 4 caracteres)
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••"
                className="bg-white/70 border-amber-200"
              />
            </div>
            <div>
              <label className="text-xs text-amber-700 mb-1 block">
                Confirmar contraseña
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••"
                onKeyPress={(e) => e.key === 'Enter' && handleSetPassword()}
                className="bg-white/70 border-amber-200"
              />
            </div>
            <div className="bg-amber-100/50 border border-amber-200 rounded p-2">
              <p className="text-[10px] text-amber-800 italic">
                💡 Tip: Usa una contraseña que recuerdes fácilmente. Se guarda localmente en tu navegador.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowSetPasswordDialog(false)
                  setNewPassword('')
                  setConfirmPassword('')
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSetPassword}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Establecer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

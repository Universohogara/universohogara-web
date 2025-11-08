
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Ejercicios interactivos guiados
const EXERCISES = [
  {
    id: 'breathing',
    title: 'Respiración 4-7-8',
    category: 'ansiedad',
    duration: 5,
    icon: '🧘‍♀️',
    description: 'Técnica de respiración profunda para calmar la ansiedad',
    steps: [
      {
        step: 1,
        instruction: 'Siéntate cómodamente con la espalda recta',
        duration: 10
      },
      {
        step: 2,
        instruction: 'Inhala profundamente por la nariz contando hasta 4',
        duration: 4,
        action: 'inhale'
      },
      {
        step: 3,
        instruction: 'Mantén el aire contando hasta 7',
        duration: 7,
        action: 'hold'
      },
      {
        step: 4,
        instruction: 'Exhala completamente por la boca contando hasta 8',
        duration: 8,
        action: 'exhale'
      },
      {
        step: 5,
        instruction: 'Repite este ciclo 4 veces más',
        duration: 60,
        action: 'repeat'
      }
    ],
    benefits: [
      'Reduce la ansiedad inmediatamente',
      'Calma el sistema nervioso',
      'Mejora la concentración',
      'Ayuda a conciliar el sueño'
    ]
  },
  {
    id: 'grounding',
    title: 'Técnica 5-4-3-2-1',
    category: 'ansiedad',
    duration: 7,
    icon: '🌍',
    description: 'Ejercicio de conexión con el presente para crisis de ansiedad',
    steps: [
      {
        step: 1,
        instruction: 'Nombra 5 cosas que puedes VER a tu alrededor',
        duration: 60,
        action: 'observe'
      },
      {
        step: 2,
        instruction: 'Nombra 4 cosas que puedes TOCAR',
        duration: 45,
        action: 'touch'
      },
      {
        step: 3,
        instruction: 'Nombra 3 cosas que puedes ESCUCHAR',
        duration: 45,
        action: 'listen'
      },
      {
        step: 4,
        instruction: 'Nombra 2 cosas que puedes OLER',
        duration: 30,
        action: 'smell'
      },
      {
        step: 5,
        instruction: 'Nombra 1 cosa que puedes SABOREAR',
        duration: 30,
        action: 'taste'
      }
    ],
    benefits: [
      'Ancla al momento presente',
      'Interrumpe espirales de ansiedad',
      'Activa los sentidos',
      'Reduce pensamientos intrusivos'
    ]
  },
  {
    id: 'gratitude',
    title: 'Tres gracias del día',
    category: 'tristeza',
    duration: 5,
    icon: '✨',
    description: 'Ejercicio rápido de gratitud para mejorar el ánimo',
    steps: [
      {
        step: 1,
        instruction: 'Piensa en algo que te haya hecho sonreír hoy (por pequeño que sea)',
        duration: 60
      },
      {
        step: 2,
        instruction: 'Recuerda algo que tu cuerpo hizo bien hoy',
        duration: 60
      },
      {
        step: 3,
        instruction: 'Identifica algo que tienes en tu vida que valoras',
        duration: 60
      },
      {
        step: 4,
        instruction: 'Si quieres, escribe estas tres cosas en tu diario',
        duration: 30
      }
    ],
    benefits: [
      'Cambia el enfoque mental',
      'Aumenta emociones positivas',
      'Mejora la perspectiva',
      'Fortalece la resiliencia'
    ]
  },
  {
    id: 'body-scan',
    title: 'Escaneo corporal',
    category: 'estrés',
    duration: 8,
    icon: '🧘',
    description: 'Relajación progresiva para liberar tensión física',
    steps: [
      {
        step: 1,
        instruction: 'Acuéstate o siéntate cómodamente. Cierra los ojos.',
        duration: 15
      },
      {
        step: 2,
        instruction: 'Lleva tu atención a los pies. Nota cualquier tensión.',
        duration: 30
      },
      {
        step: 3,
        instruction: 'Sube lentamente: piernas, caderas, abdomen, espalda.',
        duration: 90
      },
      {
        step: 4,
        instruction: 'Continúa: pecho, hombros, brazos, cuello, rostro.',
        duration: 90
      },
      {
        step: 5,
        instruction: 'Respira profundo 3 veces y abre los ojos lentamente.',
        duration: 30
      }
    ],
    benefits: [
      'Libera tensión muscular',
      'Mejora la conciencia corporal',
      'Reduce el estrés',
      'Promueve la relajación profunda'
    ]
  },
  {
    id: 'letter',
    title: 'Carta a tu yo del futuro',
    category: 'esperanza',
    duration: 10,
    icon: '✉️',
    description: 'Ejercicio de escritura terapéutica para conectar con la esperanza',
    steps: [
      {
        step: 1,
        instruction: 'Toma papel y lápiz (o abre tu diario digital)',
        duration: 15
      },
      {
        step: 2,
        instruction: 'Escribe: "Querida yo del futuro..."',
        duration: 10
      },
      {
        step: 3,
        instruction: 'Cuéntale cómo te sientes HOY y qué esperas para ella',
        duration: 300
      },
      {
        step: 4,
        instruction: 'Termina con un mensaje de ánimo para tu yo futura',
        duration: 120
      }
    ],
    benefits: [
      'Conecta con la esperanza',
      'Clarifica deseos y valores',
      'Valida emociones actuales',
      'Crea perspectiva temporal'
    ]
  },
  {
    id: 'self-compassion',
    title: 'Autocompasión guiada',
    category: 'autocuidado',
    duration: 6,
    icon: '💖',
    description: 'Práctica de amabilidad hacia ti misma',
    steps: [
      {
        step: 1,
        instruction: 'Pon una mano sobre tu corazón',
        duration: 10
      },
      {
        step: 2,
        instruction: 'Repite en voz alta o mentalmente: "Esto es difícil"',
        duration: 20
      },
      {
        step: 3,
        instruction: 'Ahora di: "El sufrimiento es parte de ser humana"',
        duration: 20
      },
      {
        step: 4,
        instruction: 'Finalmente: "Puedo ser amable conmigo misma"',
        duration: 20
      },
      {
        step: 5,
        instruction: 'Respira profundo sintiendo el calor de tu mano',
        duration: 45
      }
    ],
    benefits: [
      'Reduce la autocrítica',
      'Aumenta la autoaceptación',
      'Regula emociones difíciles',
      'Fortalece la resiliencia'
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const exerciseId = searchParams.get('id')

    // Si se solicita un ejercicio específico
    if (exerciseId) {
      const exercise = EXERCISES.find(ex => ex.id === exerciseId)
      if (!exercise) {
        return NextResponse.json(
          { error: 'Ejercicio no encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json({ exercise })
    }

    // Si se filtra por categoría
    if (category) {
      const filtered = EXERCISES.filter(ex => ex.category === category)
      return NextResponse.json({ exercises: filtered })
    }

    // Retornar todos los ejercicios
    return NextResponse.json({ exercises: EXERCISES })

  } catch (error) {
    console.error('Error al obtener ejercicios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

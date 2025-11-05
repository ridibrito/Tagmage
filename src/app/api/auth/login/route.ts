// Esta rota não é mais necessária - o login agora é feito diretamente no cliente
// Mantida apenas para compatibilidade
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'Use o formulário de login na página' },
    { status: 400 }
  )
}


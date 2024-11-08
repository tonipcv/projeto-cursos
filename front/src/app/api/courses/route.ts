import { NextResponse } from 'next/server';

const API_URL = 'https://cursos-api-cursos.dpbdp1.easypanel.host';

export const runtime = 'edge';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/courses`);
    const courses = await response.json();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cursos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const course = await response.json();
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    return NextResponse.json(
      { error: 'Erro ao criar curso' },
      { status: 500 }
    );
  }
} 
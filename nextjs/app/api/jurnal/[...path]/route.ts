import { NextRequest, NextResponse } from 'next/server';
import { proxyToJurnal } from '@/lib/jurnal';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const searchParams = request.nextUrl.search;
  const apiPath = `/public/jurnal/api/v1/${params.path.join('/')}${searchParams}`;

  try {
    const upstream = await proxyToJurnal('GET', apiPath);
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const searchParams = request.nextUrl.search;
  const apiPath = `/public/jurnal/api/v1/${params.path.join('/')}${searchParams}`;

  try {
    const body = await request.json().catch(() => null);
    const upstream = await proxyToJurnal('POST', apiPath, body);
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const searchParams = request.nextUrl.search;
  const apiPath = `/public/jurnal/api/v1/${params.path.join('/')}${searchParams}`;

  try {
    const body = await request.json().catch(() => null);
    const upstream = await proxyToJurnal('PUT', apiPath, body);
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const searchParams = request.nextUrl.search;
  const apiPath = `/public/jurnal/api/v1/${params.path.join('/')}${searchParams}`;

  try {
    const upstream = await proxyToJurnal('DELETE', apiPath);
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

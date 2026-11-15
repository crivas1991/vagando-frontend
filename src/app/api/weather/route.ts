import { NextResponse, type NextRequest } from 'next/server';

import { weatherQuerySchema, type WeatherResponse } from '@/features/weather';
import { getWeather } from '@/features/weather/server';
import { handleRouteError } from '@/shared/lib/api-response';
import { AppError } from '@/shared/lib/errors';

/**
 * GET /api/weather?lat=13.69&lon=-89.19
 * Clima actual y pronóstico de 7 días. Latitud entre -90 y 90, longitud entre -180 y 180.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = weatherQuerySchema.safeParse({
      lat: searchParams.get('lat') ?? undefined,
      lon: searchParams.get('lon') ?? undefined,
    });

    if (!query.success) {
      throw new AppError(
        query.error.issues[0]?.message ?? 'Parámetros de ubicación inválidos.',
        'BAD_REQUEST',
        400,
        query.error.issues,
      );
    }

    const weather = await getWeather(query.data.lat, query.data.lon);
    return NextResponse.json<WeatherResponse>({ weather });
  } catch (error) {
    return handleRouteError(error);
  }
}

import { NextResponse, type NextRequest } from 'next/server';

import { OUT_OF_REGION_MESSAGE, isInCentralAmerica } from '@/features/countries';
import { weatherQuerySchema, type WeatherResponse } from '@/features/weather';
import { getWeather } from '@/features/weather/server';
import { handleRouteError } from '@/shared/lib/api-response';
import { AppError } from '@/shared/lib/errors';

/**
 * Solo coordenadas dentro de los 7 países de Centroamérica (revisión del Paso 11, severidad alta):
 * la ruta no debe servir como proxy de Open-Meteo para cualquier parte del mundo.
 */
const centralAmericaWeatherQuerySchema = weatherQuerySchema.refine(({ lat, lon }) => isInCentralAmerica(lat, lon), {
  message: OUT_OF_REGION_MESSAGE,
});

/**
 * GET /api/weather?lat=13.69&lon=-89.19
 * Clima actual y pronóstico de 7 días para un punto de Centroamérica.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = centralAmericaWeatherQuerySchema.safeParse({
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

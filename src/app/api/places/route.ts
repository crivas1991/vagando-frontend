import { NextResponse, type NextRequest } from 'next/server';

import { placesQuerySchema, type PlacesResponse } from '@/features/places';
import { getPlacesNear } from '@/features/places/server';
import { handleRouteError } from '@/shared/lib/api-response';
import { AppError } from '@/shared/lib/errors';

/**
 * GET /api/places?lat=13.69&lon=-89.19&kind=sights
 * Lugares turísticos cercanos. `kind`: sights | museums | nature | beaches | food (por defecto, sights).
 * La key de Geoapify se usa solo en el servidor; nunca viaja al navegador.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = placesQuerySchema.safeParse({
      lat: searchParams.get('lat') ?? undefined,
      lon: searchParams.get('lon') ?? undefined,
      kind: searchParams.get('kind') ?? undefined,
    });

    if (!query.success) {
      throw new AppError(
        query.error.issues[0]?.message ?? 'Parámetros de búsqueda de lugares inválidos.',
        'BAD_REQUEST',
        400,
        query.error.issues,
      );
    }

    const { lat, lon, kind } = query.data;
    const places = await getPlacesNear(lat, lon, kind);
    return NextResponse.json<PlacesResponse>({ kind, places });
  } catch (error) {
    return handleRouteError(error);
  }
}

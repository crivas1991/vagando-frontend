import { NextResponse, type NextRequest } from 'next/server';

import { countriesQuerySchema, type CountriesResponse } from '@/features/countries';
import { searchCountries } from '@/features/countries/server';
import { handleRouteError } from '@/shared/lib/api-response';
import { AppError } from '@/shared/lib/errors';

/**
 * GET /api/countries?q=texto
 * Lista los países de Centroamérica, filtrados opcionalmente por nombre, capital o código.
 * Capa delgada (AGENTS.md 1.3): valida la entrada, delega al service y responde.
 */
export async function GET(request: NextRequest) {
  try {
    const query = countriesQuerySchema.safeParse({
      q: request.nextUrl.searchParams.get('q') ?? undefined,
    });

    if (!query.success) {
      throw new AppError(
        query.error.issues[0]?.message ?? 'Parámetros de búsqueda inválidos.',
        'BAD_REQUEST',
        400,
        query.error.issues,
      );
    }

    const countries = await searchCountries(query.data.q);
    return NextResponse.json<CountriesResponse>({ countries });
  } catch (error) {
    return handleRouteError(error);
  }
}

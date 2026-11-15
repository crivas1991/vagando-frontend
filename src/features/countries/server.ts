// API pública del feature countries solo para servidor (services). Ver AGENTS.md 1.5
import 'server-only';

export { getCentralAmericaCountries, getCountryByCode, searchCountries } from './services/countries.service';

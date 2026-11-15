/**
 * Une clases de CSS condicionales ignorando valores falsy.
 * Ejemplo: cn('p-4', isActive && 'bg-primary', className)
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

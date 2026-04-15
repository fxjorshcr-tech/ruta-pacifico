export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function routeSlug(origen: string, destino: string): string {
  return `${toSlug(origen)}-to-${toSlug(destino)}`;
}

export function isAirportOrigin(origen: string): boolean {
  const o = origen.toUpperCase();
  return o.includes("LIR") || o.includes("SJO") || o.includes("AIRPORT");
}

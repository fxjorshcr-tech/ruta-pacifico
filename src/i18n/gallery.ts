import { defineCopy } from "@/lib/i18n";

/** Captions and controls of the Guanacaste photo gallery on the home page. */
export const GALLERY = defineCopy({
  en: {
    /** Same order as the image list in GuanacasteGallery.tsx. */
    alts: [
      "White sand beach in Guanacaste",
      "Playa Tamarindo sunset",
      "Llanos de Cortés waterfall",
      "Guanacaste Annexation Day celebration",
    ],
    previous: "Previous image",
    next: "Next image",
    goTo: (n: number) => `Go to image ${n}`,
  },
  es: {
    alts: [
      "Playa de arena blanca en Guanacaste",
      "Atardecer en Playa Tamarindo",
      "Catarata Llanos de Cortés",
      "Celebración del Día de la Anexión de Guanacaste",
    ],
    previous: "Imagen anterior",
    next: "Imagen siguiente",
    goTo: (n: number) => `Ir a la imagen ${n}`,
  },
});

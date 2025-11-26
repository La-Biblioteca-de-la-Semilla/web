import sfg1 from '@/assets/sfg/sfg-1.svg'
import sfg2 from '@/assets/sfg/sfg-2.svg'
import sfg4 from '@/assets/sfg/sfg-4.svg'
import sfg5 from '@/assets/sfg/sfg-5.svg'
import sfg9 from '@/assets/sfg/sfg-9.svg'
import sfg16 from '@/assets/sfg/sfg-16.svg'

export type Seed = {
  id: string
  name: string
  species: string
  image: string
  owner: string
  description: string
  sow: number[]
  sentOn: string
  tags: string[]
  family: BotanicalFamily | null
  sfgOriginal: SquareFootType | null
  sfgMultisow: SquareFootType | null
  sfgClump: SquareFootType | null
  germinationMin: number | null
  germinationMax: number | null
}

export type BotanicalFamily =
  | 'ALLIACEAE'
  | 'AMARANTHACEAE'
  | 'APIACEAE'
  | 'ASTERACEAE'
  | 'ASTILBEACEAE'
  | 'BASELLACEAE'
  | 'BORAGINACEAE'
  | 'BRASSICACEAE'
  | 'CACTACEAE'
  | 'CARYOPHYLLACEAE'
  | 'CUCURBITACEAE'
  | 'ERICACEAE'
  | 'EUPHORBIACEAE'
  | 'FABACEAE'
  | 'LAMIACEAE'
  | 'LILIACEAE'
  | 'MALVACEAE'
  | 'MYRTACEAE'
  | 'PAPAVERACEAE'
  | 'PASSIFLORACEAE'
  | 'POACEAE'
  | 'RANUNCULACEAE'
  | 'ROSACEAE'
  | 'RUTACEAE'
  | 'SCROPHULARIACEAE'
  | 'SOLANACEAE'
  | 'VERBENACEAE'
  | 'ZINGIBERACEAE';


export type BotanicalFamilyInfo = {
  text: string;
  examples: string[];
};

export const BOTANICAL_FAMILIES: Record<BotanicalFamily, BotanicalFamilyInfo> = {
  ALLIACEAE: { text: 'Aliáceas', examples: ['Ajo', 'Cebolla', 'Chalote'] },
  AMARANTHACEAE: { text: 'Amarantáceas', examples: ['Espinaca', 'Acelga', 'Remolacha'] },
  APIACEAE: { text: 'Apiáceas', examples: ['Zanahoria', 'Perejil', 'Hinojo'] },
  ASTERACEAE: { text: 'Asteráceas', examples: ['Lechuga', 'Girasol', 'Diente de león'] },
  ASTILBEACEAE: { text: 'Astilbeáceas', examples: ['Ornamentales'] },
  BASELLACEAE: { text: 'Baseáceas', examples: ['Trepadoras semisuculentas'] },
  BORAGINACEAE: { text: 'Boragináceas', examples: ['Borraja', 'Consuelda'] },
  BRASSICACEAE: { text: 'Brasicáceas', examples: ['Col', 'Brócoli', 'Rábano'] },
  CACTACEAE: { text: 'Cactáceas', examples: ['Cactus', 'Pitaya'] },
  CARYOPHYLLACEAE: { text: 'Cariofiláceas', examples: ['Clavel', 'Cerraja'] },
  CUCURBITACEAE: { text: 'Cucurbitáceas', examples: ['Calabaza', 'Pepino', 'Melón'] },
  ERICACEAE: { text: 'Ericáceas', examples: ['Arándano', 'Rododendro'] },
  EUPHORBIACEAE: { text: 'Euforbiáceas', examples: ['Ricino', 'Poinsettia'] },
  FABACEAE: { text: 'Leguminosas', examples: ['Frijol', 'Lenteja', 'Alfalfa'] },
  LAMIACEAE: { text: 'Lamiáceas', examples: ['Albahaca', 'Menta', 'Romero'] },
  LILIACEAE: { text: 'Liliáceas', examples: ['Cebolla', 'Ajo', 'Puerro'] },
  MALVACEAE: { text: 'Malváceas', examples: ['Okra', 'Hibisco', 'Malva'] },
  MYRTACEAE: { text: 'Mirtáceas', examples: ['Eucalipto', 'Guayabo', 'Mirtos'] },
  PAPAVERACEAE: { text: 'Papaveráceas', examples: ['Opio', 'Amapola'] },
  PASSIFLORACEAE: { text: 'Pasifloráceas', examples: ['Maracuyá', 'Pasiflora'] },
  POACEAE: { text: 'Poáceas', examples: ['Maíz', 'Trigo', 'Avena'] },
  RANUNCULACEAE: { text: 'Ranunculáceas', examples: ['Clemátide', 'Botón de oro'] },
  ROSACEAE: { text: 'Rosáceas', examples: ['Fresa', 'Frambuesa', 'Zarzamora'] },
  RUTACEAE: { text: 'Rutáceas', examples: ['Limón', 'Naranja', 'Toronja'] },
  SCROPHULARIACEAE: { text: 'Escrofulariáceas', examples: ['Digital', 'Verbascos'] },
  SOLANACEAE: { text: 'Solanáceas', examples: ['Tomate', 'Papa', 'Berenjena'] },
  VERBENACEAE: { text: 'Verbenáceas', examples: ['Verbena', 'Lantana'] },
  ZINGIBERACEAE: { text: 'Zingiberáceas', examples: ['Jengibre', 'Cúrcuma'] }
}


export type SquareFootType = 1 | 2 | 4 | 5 | 9 | 16

export const SQUARE_FOOT_IMAGE: Record<SquareFootType, string> = {
  1: sfg1,
  2: sfg2,
  4: sfg4,
  5: sfg5,
  9: sfg9,
  16: sfg16
}
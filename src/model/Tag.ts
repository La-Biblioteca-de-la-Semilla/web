import monoicaUrl from "@/assets/seed-card/icons/monoica.svg";
import dioicaUrl from "@/assets/seed-card/icons/dioica.svg";
import hermafroditaUrl from "@/assets/seed-card/icons/hermafrodita.svg";
import exogamaUrl from "@/assets/seed-card/icons/exogama.svg";
import endogamaUrl from "@/assets/seed-card/icons/endogama.svg";
import autoincompatibleURL from "@/assets/seed-card/icons/autoincompatible.svg";

export type Tag = {
    id: string
    text: string
    image: string
    description: string
}

export function toTags(strArr: string[]):Tag[]  {
    const result:Tag[] = []
    strArr.forEach(value => {
        const tag = TAGS.find((t) => t.id === value)
        if (tag) result.push(tag)
    })
    return result
}

export const TAGS = [
    {
        id: "MONOICA",
        text: 'Monóica',
        image: monoicaUrl,
        description: 'En un mismo pie de planta hay flores masculinas y femeninas',
        group: "REPRODUCTION"
    },
    {
        id: "DIOICA",
        text: 'Dióica',
        image: dioicaUrl,
        description: 'En un mismo pie de planta sólo existe un tipo de flor, o masculinas o femeninas',
        group: "REPRODUCTION"
    },
    {
        id: "HERMAFRODITA",
        text: 'Hermafrodita',
        image: hermafroditaUrl,
        description: 'Planta en la que concurren los dos sexos en la misma flor',
        group: "REPRODUCTION"
    },
    {
        id: "EXOGAMA",
        text: 'Exógama',
        image: exogamaUrl,
        description: 'El polen ha de venir de otra flor diferente de la que tiene el óvulo a fecundar',
        group: "POLLINATION"
    },
    {
        id: "ENDOGAMA",
        text: 'Endógama',
        image: endogamaUrl,
        description: 'El polen y el óvulo pertenecen a la misma flor',
        group: "POLLINATION"
    },
    {
        id: "AUTOINCOMPATIBLE",
        text: 'Autoincompatible',
        image: autoincompatibleURL,
        description: 'Incapacidad de una planta para producir semillas por autopolinización',
        group: "OTHER"
    }
]

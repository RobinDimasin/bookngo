import { TEXT_CONFIG } from "./TextConfig";

export class Config {
    static get(key: string): string | number {
        const keys = key.split(".");

        keys.reverse();

        if (keys.length == 0) {
            return key;
        }

        const k = keys.pop();

        if (k === undefined || !(k in TEXT_CONFIG)) {
            return key;
        }

        // @ts-ignore
        let value = TEXT_CONFIG[k];

        while (keys.length > 0) {
            const k = keys.pop();

            // @ts-ignore
            if (k !== undefined && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        if (typeof value === "string" || typeof value === "number") {
            return value;
        } else {
            return key;
        }
    }
}

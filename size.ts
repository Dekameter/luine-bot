import _ from "lodash";

class Unit {
    constructor(public name: string, public plural: string, public value: number,
                public abbrevs: string[] = []) {

    }

    equals(unit_text: string) {
        return this.name === unit_text || this.plural === unit_text ||
            this.abbrevs.find(abbrev => abbrev === unit_text);
    }
}

const IMPERIAL_LENGTH_UNITS: Unit[] = [
    new Unit("thou", "thous", 2.54e-5, ["th"]),
    new Unit("inch", "inches", 2.54e-2, ["in", "\""]),
    new Unit("foot", "feet", 3.048e-1, ["ft", "\'"]),
    new Unit("yard", "yards", 9.144e-1, ["yd"]),
    new Unit("mile", "miles", 1.609344e3, ["mi"]),
];

const SI_LENGTH_UNITS: Unit[] = [
    new Unit("attometer", "attometers", 1e-18,["am"]),
    new Unit("femtometer", "femtometers", 1e-15,["fm"]),
    new Unit("picometer", "picometers", 1e-12, ["pm"]),
    new Unit("nanometer", "nanometers", 1e-9, ["nm"]),
    new Unit("micrometer", "micrometers", 1e-6,  ["µm"]),
    new Unit("millimeter", "millimeters", 1e-3,["mm"]),
    new Unit("decimeter", "decimeters", 1e-1, ["dm"]),
    new Unit("meter", "meters", 1e0, ["m"]),
    new Unit("dekameter", "dekameters", 1e1, ["dam"]),
    new Unit("kilometer", "kilometers", 1e3, ["km"]),
];

const LENGTH_UNITS: Unit[] = _.sortBy([ ...IMPERIAL_LENGTH_UNITS, ...SI_LENGTH_UNITS ],
        unit => unit.value);

export class Length {
    // Value in terms of meters
    public value: number;

    constructor(value_unit_pairs: [number, Unit][]) {
        this.value = _.sumBy(value_unit_pairs, pair => {
            if(!Number.isFinite(pair[0])) {
                throw Error("Error: Size must be a finite number.");
            }

            return pair[0] * pair[1].value;
        });
    }

    // format(isImp: boolean, isSI: boolean) {
    //     if(isImp) {
    //         if(isSI) {
    //             return
    //         }
    //     }
    // }
}

export function parseSizes(size_text: string) {
    if(!size_text) {
        return null;
    }

    console.log(size_text);
    // Define the regex by finding boundaries between alphabetic or ' or ", and digits.
    // Adapted from: http://www.rexegg.com/regex-boundaries.html#double-negative-delimiter
    const unit_spacing_regex = /(?:(?<=^|\d)(?=[a-zA-Z'"])|(?<=[a-zA-Z'"])(?=\d))/g;
    size_text = size_text.replace(unit_spacing_regex, " ");
    console.log(size_text);
    let tokens = size_text.split(/ +/);
    if(tokens.length % 2 === 1) {
        throw Error("Odd number of tokens.");
    }

    let unit_pairs: [number, Unit][] = _.chunk(tokens, 2)
        .map(pair => {
            let unit_text = pair[1].trim().replace(/\.$/, "").toLowerCase();
            let unit = LENGTH_UNITS.find(unit => unit.equals(unit_text));
            if(!unit) {
                throw Error(`No valid unit found for '${unit_text}'`);
            }

            return [Number(pair[0]), unit];
        });

    let size = new Length(unit_pairs);

    return size.value;
}

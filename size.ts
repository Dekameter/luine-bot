import * as _ from "lodash";

export class SizeUnit {
    constructor(private value: number, private unit: number) {

    }
}

export function parseSizes(size_text: string) {
    if(!size_text) {
        return null;
    }

    let tokens = size_text.split(/ +/);
    console.log(tokens);
    if(tokens.length % 2 === 1) {
        throw Error("Odd number of tokens.");
    }

    let unit_pairs = _.chunk(tokens, 2);

    console.log(unit_pairs);
}

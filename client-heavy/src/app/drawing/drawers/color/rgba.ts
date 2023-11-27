const NULL_COLOR_COMPONENT = '00';
const OPACITY_MAXIMUM = 1;
const HEXADECIMAL_CONVERSION = 16;

export class Rgba {
    constructor(
        red: string = NULL_COLOR_COMPONENT,
        green: string = NULL_COLOR_COMPONENT,
        blue: string = NULL_COLOR_COMPONENT,
        opacity: number = OPACITY_MAXIMUM,
    ) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = opacity;
        this.updateLength();
    }
    r: string;
    g: string;
    b: string;
    a: number;

    static fromHex(hexColor: string): Rgba {
        const rgba = new Rgba();
        rgba.setFromHex(hexColor);
        return rgba;
    }

    static fromHexAndOpacity(hexColor: string, opacity: number): Rgba {
        const rgba = new Rgba();
        rgba.setFromHexAndOpacity(hexColor, opacity);
        return rgba;
    }

    updateLength(): void {
        if (this.r.length === 1) {
            this.r = '0' + this.r;
        }
        if (this.g.length === 1) {
            this.g = '0' + this.g;
        }
        if (this.b.length === 1) {
            this.b = '0' + this.b;
        }
    }

    rgbToHex(): string {
        return '#' + this.r + this.g + this.b;
    }

    setFromHex(hexColor: string): void {
        this.r = hexColor[1] + hexColor[2];
        this.g = hexColor[3] + hexColor[4];
        this.b = hexColor[5] + hexColor[6];
        this.a = OPACITY_MAXIMUM;
    }

    setFromHexAndOpacity(hexColor: string, opacity: number): void {
        const hexColorArray = hexColor.split('');
        this.r = hexColorArray[1] + hexColorArray[2];
        this.g = hexColorArray[3] + hexColorArray[4];
        this.b = hexColorArray[5] + hexColorArray[6];
        this.a = opacity;
    }

    setFromDecimal(red: number, green: number, blue: number, opacity: number): void {
        this.r = red.toString(HEXADECIMAL_CONVERSION);
        this.g = green.toString(HEXADECIMAL_CONVERSION);
        this.b = blue.toString(HEXADECIMAL_CONVERSION);
        this.a = opacity;
        this.updateLength();
    }

    getStyle(): string {
        return (
            'rgba(' +
            parseInt(this.r, HEXADECIMAL_CONVERSION) +
            ',' +
            parseInt(this.g, HEXADECIMAL_CONVERSION) +
            ',' +
            parseInt(this.b, HEXADECIMAL_CONVERSION) +
            ',' +
            this.a +
            ')'
        );
    }

    equalsTo(value: Rgba): boolean {
        return this.r === value.r && this.g === value.g && this.b === value.b && this.a === value.a;
    }

    copy(rgba: Rgba, keepOpacity: boolean): void {
        rgba.updateLength();
        this.r = rgba.r;
        this.g = rgba.g;
        this.b = rgba.b;
        keepOpacity ? (this.a = rgba.a) : (this.a = OPACITY_MAXIMUM);
    }
}

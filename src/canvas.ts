import {
    BRAILLE_PATTERNS,
    BRAILLE_EMPTY
} from './braille';

export class Canvas {
    private width: number;
    private height: number;
    private grid: boolean[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        // Initialize the grid with false values
        this.grid = Array(height * 4).fill(0).map(() => Array(width * 2).fill(false));
    }

    public set(x: number, y: number): void {
        if (x >= 0 && x < this.width * 2 && y >= 0 && y < this.height * 4) {
            this.grid[y][x] = true;
        }
    }

    public toString(): string {
        let result = '';
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                let charCode = BRAILLE_EMPTY;

                if (this.grid[r * 4 + 0][c * 2 + 0]) charCode |= BRAILLE_PATTERNS[0]; // dot 1
                if (this.grid[r * 4 + 1][c * 2 + 0]) charCode |= BRAILLE_PATTERNS[1]; // dot 2
                if (this.grid[r * 4 + 2][c * 2 + 0]) charCode |= BRAILLE_PATTERNS[2]; // dot 3
                if (this.grid[r * 4 + 0][c * 2 + 1]) charCode |= BRAILLE_PATTERNS[3]; // dot 4
                if (this.grid[r * 4 + 1][c * 2 + 1]) charCode |= BRAILLE_PATTERNS[4]; // dot 5
                if (this.grid[r * 4 + 2][c * 2 + 1]) charCode |= BRAILLE_PATTERNS[5]; // dot 6
                if (this.grid[r * 4 + 3][c * 2 + 0]) charCode |= BRAILLE_PATTERNS[6]; // dot 7
                if (this.grid[r * 4 + 3][c * 2 + 1]) charCode |= BRAILLE_PATTERNS[7]; // dot 8

                result += String.fromCharCode(charCode);
            }
            result += '\n';
        }
        return result;
    }
}

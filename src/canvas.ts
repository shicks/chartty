import {
    BRAILLE_PATTERNS,
    BRAILLE_EMPTY
} from './braille';

const BRAILLE_CHAR_MAP: { [key: string]: number } = {
    '0': 0x281a, // ⠚
    '1': 0x2801, // ⠁
    '2': 0x2803, // ⠃
    '3': 0x2809, // ⠉
    '4': 0x2819, // ⠙
    '5': 0x2811, // ⠑
    '6': 0x280b, // ⠋
    '7': 0x281b, // ⠛
    '8': 0x2813, // ⠓
    '9': 0x280a, // ⠊
    '.': 0x2828, // ⠨
    '-': 0x2824, // ⠤ (hyphen)
    ' ': 0x2800, // Empty braille character for space
};

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

    public drawCanvas(otherCanvas: Canvas, offsetX: number, offsetY: number): void {
        for (let r = 0; r < otherCanvas.height * 4; r++) {
            for (let c = 0; c < otherCanvas.width * 2; c++) {
                if (otherCanvas.grid[r][c]) {
                    this.set(c + offsetX, r + offsetY);
                }
            }
        }
    }

    public writeText(text: string, x: number, y: number): void {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const brailleCode = BRAILLE_CHAR_MAP[char] || BRAILLE_EMPTY; // Default to empty if not found

            // Iterate through braille patterns to set dots
            for (let dot = 0; dot < BRAILLE_PATTERNS.length; dot++) {
                if ((brailleCode & BRAILLE_PATTERNS[dot]) !== 0) {
                    // Calculate the x and y position of the dot within the braille cell
                    let dotX = 0;
                    let dotY = 0;

                    if (dot === 0) { dotX = 0; dotY = 0; } // dot 1
                    else if (dot === 1) { dotX = 0; dotY = 1; } // dot 2
                    else if (dot === 2) { dotX = 0; dotY = 2; } // dot 3
                    else if (dot === 3) { dotX = 1; dotY = 0; } // dot 4
                    else if (dot === 4) { dotX = 1; dotY = 1; } // dot 5
                    else if (dot === 5) { dotX = 1; dotY = 2; } // dot 6
                    else if (dot === 6) { dotX = 0; dotY = 3; } // dot 7
                    else if (dot === 7) { dotX = 1; dotY = 3; } // dot 8

                    this.set(x * 2 + i * 2 + dotX, y * 4 + dotY);
                }
            }
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

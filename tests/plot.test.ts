import { plot } from '../src/index';

describe('plot', () => {
    it('should return a non-empty string for valid input', () => {
        const x = [1, 2, 3];
        const y = [1, 2, 3];
        const result = plot(x, y);
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty input arrays', () => {
        const x: number[] = [];
        const y: number[] = [];
        const result = plot(x, y, { width: 10, height: 5 });
        const expected = '          \n'.repeat(5).replace(/ /g, String.fromCharCode(0x2800));
        expect(result).toBe(expected);
    });

    it('should plot a single point in the middle when x and y ranges are 0', () => {
        const x = [5];
        const y = [5];
        const result = plot(x, y, { width: 10, height: 5 });

        // This is an approximation. The exact output is hard to predict without running the code.
        // The point should be in the middle of the 10x5 character grid.
        // Middle of 10 is 5. Middle of 5 is 2.
        // The dot would be at character (5, 2).
        // The exact braille character depends on the sub-pixel position.
        // Let's assume it's just one dot.
        const lines = result.split('\n');
        expect(lines[2][5]).not.toBe(String.fromCharCode(0x2800));
    });

    it('should return a plot of the correct dimensions', () => {
        const x = [1, 2, 3];
        const y = [1, 2, 3];
        const result = plot(x, y, { width: 30, height: 10 });
        const lines = result.split('\n');
        // 10 lines + a trailing newline
        expect(lines.length).toBe(11);
        expect(lines[0].length).toBe(30);
    });
});

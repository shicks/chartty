import { Canvas } from './canvas';

interface Options {
    xmin?: number;
    xmax?: number;
    ymin?: number;
    ymax?: number;
    width?: number;
    height?: number;
    xaxis?: boolean;
    yaxis?: boolean;
    origin?: boolean;
    border?: boolean;
    xlabels?: number;
    ylabels?: number;
    title?: string;
    xname?: string;
    yname?: string
}

export function plot(
    x: number[],
    y: number[],
    options: Options = {},
): string {
    const {
        width = 80,
        height = 24,
        xmin = Math.min(...x),
        xmax = Math.max(...x),
        ymin = Math.min(...y),
        ymax = Math.max(...y),
        xlabels = 0,
        ylabels = 0,
    } = options;

    const y_label_width = ylabels > 0 ? 8 : 0; // Assuming max 8 characters for y-labels (e.g., -99.99)
    const x_label_height = xlabels > 0 ? 1 : 0; // Assuming 1 line for x-labels

    const plot_width = width - y_label_width;
    const plot_height = height - x_label_height;

    const canvas = new Canvas(plot_width, plot_height);

    // Helper function to get a "nice" number for axis divisions
    function _getNiceNum(range: number, round: boolean): number {
        const exponent = Math.floor(Math.log10(range));
        const fraction = range / Math.pow(10, exponent);
        let niceFraction: number;

        if (round) {
            if (fraction < 1.5) niceFraction = 1;
            else if (fraction < 3) niceFraction = 2;
            else if (fraction < 7) niceFraction = 5;
            else niceFraction = 10;
        } else {
            if (fraction < 1) niceFraction = 1;
            else if (fraction < 2) niceFraction = 2;
            else if (fraction < 5) niceFraction = 5;
            else niceFraction = 10;
        }

        return niceFraction * Math.pow(10, exponent);
    }

    // Helper function to generate tick values
    function _getTicks(min: number, max: number, numTicks: number): number[] {
        const range = max - min;
        const niceRange = _getNiceNum(range, false);
        const tickSpacing = _getNiceNum(niceRange / (numTicks - 1), true);
        const lowerBound = Math.floor(min / tickSpacing) * tickSpacing;
        const upperBound = Math.ceil(max / tickSpacing) * tickSpacing;

        const ticks: number[] = [];
        for (let i = lowerBound; i <= upperBound; i += tickSpacing) {
            ticks.push(i);
        }
        return ticks;
    }

    const x_range = xmax - xmin;
    const y_range = ymax - ymin;

    const canvas_width_dots = plot_width * 2; // Use plot_width here
    const canvas_height_dots = plot_height * 4; // Use plot_height here

    for (let i = 0; i < x.length; i++) {
        const px = x[i];
        const py = y[i];

        if (px < xmin || px > xmax || py < ymin || py > ymax) {
            continue;
        }

        const canvas_x = x_range === 0
            ? Math.floor(canvas_width_dots / 2)
            : Math.floor(((px - xmin) / x_range) * (canvas_width_dots - 1));

        const canvas_y = y_range === 0
            ? Math.floor(canvas_height_dots / 2)
            : (canvas_height_dots - 1) - Math.floor(((py - ymin) / y_range) * (canvas_height_dots - 1));

        canvas.set(canvas_x, canvas_y);
    }

    const plot_string = canvas.toString();
    const plot_lines = plot_string.split('\n');

    // Create a 2D character grid for the entire output
    const output_grid: string[][] = Array(height).fill(0).map(() => Array(width).fill(' '));

    // Copy plot lines to the output grid with offsets
    for (let r = 0; r < plot_lines.length; r++) {
        for (let c = 0; c < plot_lines[r].length; c++) {
            output_grid[r + x_label_height][c + y_label_width] = plot_lines[r][c];
        }
    }

    // Draw y-labels
    if (ylabels > 0) {
        const yTicks = _getTicks(ymin, ymax, ylabels);
        yTicks.forEach(tick => {
            const label = tick.toFixed(2); // Truncate to 2 decimal places
            // Calculate the y-position (line number) for the label
            const canvas_y = y_range === 0
                ? Math.floor(plot_height / 2)
                : (plot_height - 1) - Math.floor(((tick - ymin) / y_range) * (plot_height - 1));
            const line_num = canvas_y + x_label_height;

            // Insert label into the output grid
            for (let i = 0; i < label.length; i++) {
                if (line_num >= 0 && line_num < height && i < y_label_width) {
                    output_grid[line_num][i] = label[i];
                }
            }
        });
    }

    // Draw x-labels
    if (xlabels > 0) {
        const xTicks = _getTicks(xmin, xmax, xlabels);
        xTicks.forEach(tick => {
            const label = tick.toFixed(2); // Truncate to 2 decimal places
            // Calculate the x-position (column number) for the label
            const canvas_x = x_range === 0
                ? Math.floor(plot_width / 2)
                : Math.floor(((tick - xmin) / x_range) * (plot_width - 1));
            const col_num = canvas_x + y_label_width;

            // Insert label into the output grid
            for (let i = 0; i < label.length; i++) {
                if (col_num + i >= 0 && col_num + i < width && height - 1 >= 0 && height - 1 < height) {
                    output_grid[height - 1][col_num + i] = label[i];
                }
            }
        });
    }

    // Join the output grid back into a string
    return output_grid.map(row => row.join('')).join('\n');
}

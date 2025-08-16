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
        border = false,
    } = options;

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

    const yTicks = ylabels > 0 ? _getTicks(ymin, ymax, ylabels) : [];
    const xTicks = xlabels > 0 ? _getTicks(xmin, xmax, xlabels) : [];

    const max_x_label_length = xlabels > 0 ? Math.max(...xTicks.map(tick => tick.toFixed(2).length)) : 0;

    const border_width = border ? 2 : 0;
    const border_height = border ? 2 : 0;

    const y_label_width = ylabels > 0 ? Math.max(...yTicks.map(tick => tick.toFixed(2).length)) + 1 : 0; // +1 for the tick mark
    const x_label_height = xlabels > 0 ? 2 : 0; // Assuming 2 lines for x-labels (1 for label, 1 for spacing)

    const required_plot_width = width - y_label_width - border_width;
    const required_plot_height = height - x_label_height - border_height;

    const min_width_for_x_labels = y_label_width + border_width + max_x_label_length;
    const actual_width = Math.max(width, min_width_for_x_labels);

    const plot_width = actual_width - y_label_width - border_width;
    const plot_height = height - x_label_height - border_height;

    const canvas = new Canvas(plot_width, plot_height);

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
    const output_grid: string[][] = [];
    for (let r = 0; r < height; r++) {
        const row: string[] = [];
        for (let c = 0; c < width; c++) {
            row.push(' ');
        }
        output_grid.push(row);
    }

    // Copy plot lines to the output grid with offsets
    for (let r = 0; r < plot_lines.length; r++) {
        for (let c = 0; c < plot_lines[r].length; c++) {
            output_grid[r + x_label_height + (border ? 1 : 0)][c + y_label_width + (border ? 1 : 0)] = plot_lines[r][c];
        }
    }

    // Draw border
    if (border) {
        const plot_start_x = y_label_width + 1;
        const plot_start_y = x_label_height;
        const plot_end_x = y_label_width + plot_width + 1;
        const plot_end_y = x_label_height + plot_height + 1;

        // Corners
        output_grid[plot_start_y][plot_start_x - 1] = '┌';
        output_grid[plot_start_y][plot_end_x] = '┐';
        output_grid[plot_end_y][plot_start_x - 1] = '└';
        output_grid[plot_end_y][plot_end_x] = '┘';

        // Horizontal lines
        for (let i = plot_start_x; i < plot_end_x; i++) {
            output_grid[plot_start_y][i] = '─';
            output_grid[plot_end_y][i] = '─';
        }

        // Vertical lines
        for (let i = plot_start_y + 1; i < plot_end_y; i++) {
            output_grid[i][plot_start_x - 1] = '│';
            output_grid[i][plot_end_x] = '│';
        }
    }

    // Draw y-labels
    if (ylabels > 0) {
        yTicks.forEach(tick => {
            const label = tick.toFixed(2); // Truncate to 2 decimal places
            const plot_area_offset_y = x_label_height + (border ? 1 : 0);
            const line_num_unclamped = plot_area_offset_y + (1 - ((tick - ymin) / y_range)) * (plot_height - 1);
            const line_num = Math.floor(Math.max(0, Math.min(height - 1, line_num_unclamped)));

            // Insert label into the output grid
            const start_col = y_label_width - label.length;
            for (let i = 0; i < label.length; i++) {
                if (line_num >= 0 && line_num < height && start_col + i >= 0 && start_col + i < y_label_width) {
                    output_grid[line_num][start_col + i] = label[i];
                }
            }

            // Draw y-axis tick on border
            if (border) {
                output_grid[line_num][y_label_width] = '┤'; // Right-facing tick on left border
            }
        });
    }

    // Draw x-labels
    if (xlabels > 0) {
        xTicks.forEach(tick => {
            const label = tick.toFixed(2); // Truncate to 2 decimal places
            // Calculate the x-position (column number) for the label
            const canvas_x = x_range === 0
                ? Math.floor(plot_width / 2)
                : Math.floor(((tick - xmin) / x_range) * (plot_width - 1));
            const col_num = Math.floor(canvas_x + y_label_width + (border ? 1 : 0) - (label.length / 2));

            // Insert label into the output grid
            for (let i = 0; i < label.length; i++) {
                if (col_num + i >= 0 && col_num + i < width && height - 1 >= 0 && height - 1 < height) {
                    output_grid[height - 1][col_num + i] = label[i];
                }
            }

            // Draw x-axis tick on border
            if (border) {
                output_grid[height - 1 - (border ? 1 : 0)][Math.floor(canvas_x + y_label_width + (border ? 1 : 0))] = '┬'; // Upward-facing tick on bottom border
            }
        });
    }

    // Join the output grid back into a string
    return output_grid.map(row => row.join('')).join('\n');
}

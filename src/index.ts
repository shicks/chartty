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

    const y_label_width = ylabels > 0 ? 5 : 0; // Assuming 5 characters for y-labels
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

    const canvas_width_dots = width * 2;
    const canvas_height_dots = height * 4;

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

    const full_canvas = new Canvas(width, height);

    full_canvas.drawCanvas(canvas, y_label_width * 2, x_label_height * 4);

    // Draw x-labels
    if (xlabels > 0) {
        const xTicks = _getTicks(xmin, xmax, xlabels);
        xTicks.forEach(tick => {
            const canvas_x = x_range === 0
                ? Math.floor(plot_width / 2)
                : Math.floor(((tick - xmin) / x_range) * (plot_width - 1));
            const label = tick.toFixed(2); // Truncate to 2 decimal places for now
            full_canvas.writeText(label, canvas_x + y_label_width, height - 1); // Position at bottom
        });
    }

    // Draw y-labels
    if (ylabels > 0) {
        const yTicks = _getTicks(ymin, ymax, ylabels);
        yTicks.forEach(tick => {
            const canvas_y = y_range === 0
                ? Math.floor(plot_height / 2)
                : (plot_height - 1) - Math.floor(((tick - ymin) / y_range) * (plot_height - 1));
            const label = tick.toFixed(2); // Truncate to 2 decimal places for now
            full_canvas.writeText(label, 0, canvas_y + x_label_height); // Position at left
        });
    }

    return full_canvas.toString();
}

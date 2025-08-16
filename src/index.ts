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
    xlabels?: boolean;
    ylabels?: boolean;
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
    } = options;

    const canvas = new Canvas(width, height);

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
            : Math.floor(((py - ymin) / y_range) * (canvas_height_dots - 1));

        canvas.set(canvas_x, canvas_y);
    }

    return canvas.toString();
}

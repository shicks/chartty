# js-plotille

Pure JS library for making scatter plots in the terminal with braille dots 

## API

```
function plot(
    x: number[],
    y: number[],
    options?: Options,
): string;

interface Options {
    // minimum x value on plot
    xmin?: number;
    // maximum x value on plot
    xmax?: number;
    // minimum y value on plot
    ymin?: number;
    // maximum y value on plot
    ymax?: number;
    // width of plot in terminal characters [80]
    width?: number;
    // height of plot in terminal characters [24]
    height?: number;
    // whether to draw the x-axis as a line of hyphens [false]
    xaxis?: boolean;
    // whether to draw the y-axis as a line of bars [false]
    yaxis?: boolean; 
    // whether to draw the origin as a '+' [false]
    origin?: boolean; 
    // whether to draw a rectangle around the entire plot [false]
    border?: boolean;
    // whether to label the x axis with tick values
    xlabels?: boolean;
    // whether to label the y axis with tick values 
    ylabels?: boolean; 
    // plot title centered on top line
    title?: string; 
    // name for x axis, printed on bottom of chart
    xname?: string;
    // name for y axis, printed vertically on left edge
    yname?: string
}
```

Vertical text is added as appropriate for x-tick labels or y-axis name by stacking characters on top of each other. Labels will all cut into the width/height dimensions of the chart, so it is recommended to use larger than the default if including labels. 

Actually drawing the axes has the significant drawback that it will be impossible to draw dots on the same character as the axis lines. 

The actual scatter plot is done with Braille characters, so that each character in the string can plot up to 8 different points, in a 4 (high) by 2 (wide) grid. If multiple points fall onto the same dot, it is still only drawn once - there is no way to represent more than one point in a single dot.

## Technology

We implement with Typescript. 
Different logical complemonents are broken out into their own files for good code organization.

## Implementation steps

1. **Project Setup**: Initialize a `package.json`, install `typescript`, and configure `tsconfig.json`.
2. **Core `plot` function**: Create the main `plot` function signature in `src/index.ts`.
3. **Canvas Creation**: In `src/canvas.ts`, create a `Canvas` class that represents the grid of characters for the plot. It will be initialized with a given `width` and `height`.
4. **Braille Mapping**: In `src/braille.ts`, implement the logic to convert a 2x4 grid of booleans (representing dots) into a single Braille character. This will involve a mapping from the dot pattern to the corresponding Unicode character.
5. **Coordinate Scaling**: Implement the logic to scale the input `x` and `y` data points to fit within the dimensions of the canvas. This will handle `xmin`, `xmax`, `ymin`, and `ymax` options.
6. **Drawing Points**: In the `Canvas` class, create a method to set a specific dot (pixel) at a given (x, y) coordinate. This will involve updating the state of the character at that position in the grid.
7. **Rendering the Plot**: In the `Canvas` class, create a `toString()` or `render()` method that iterates through the character grid and uses the Braille mapping to generate the final string representation of the plot.
8. **Axes and Labels (Optional Features)**:
    - Implement drawing for axes (`xaxis`, `yaxis`, `origin`).
    - Implement drawing for the border.
    - Implement logic for generating and placing labels (`xlabels`, `ylabels`).
    - Implement the `title`, `xname`, and `yname`.
9. **Testing**:
    - Write unit tests for the Braille mapping to ensure correct character conversion.
    - Write tests for the coordinate scaling logic.
    - Write integration tests for the `plot` function to verify the output for a simple scatter plot.
10. **Proof of Concept**: Create a `test.ts` file that imports the `plot` function, provides it with sample data, and prints the resulting plot to the console to demonstrate a working proof-of-concept.
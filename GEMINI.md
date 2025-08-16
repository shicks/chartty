## Updated Requirements and Alignment Difficulties

**Updated Requirements:**

*   `xlabels` and `ylabels` are now numeric options, specifying the number of labels desired (default zero).
*   `xlabels` are rendered as normal (horizontal) text.
*   A border can be drawn around the plot using standard box-drawing characters (`border: boolean`).
*   Tick marks are integrated into the border using outset lines (e.g., `┬` for x-axis, `┤` for y-axis).
*   The main plot area shrinks to accommodate labels and the border.
*   Labels truncate decimal places in a reasonable way (`toFixed(2)`).
*   Labels are placed at integer multiples of a "nice round delta" for divisions.

**Alignment Difficulties and Learnings:**

The primary challenge has been accurately mapping data coordinates to character grid positions, especially when dealing with:

1.  **Mixed Coordinate Systems:** The `Canvas` operates on a braille dot grid (2x4 dots per character), while the `output_grid` for labels and borders operates on a standard character grid (1x1 character per cell). This required careful conversion and offsetting.
2.  **Dynamic Sizing:** The `y_label_width` and `x_label_height` (and consequently `plot_width` and `plot_height`) are dynamic based on label content and the presence of a border. This necessitated recalculating dimensions and offsets at various stages.
3.  **Out-of-Bounds Access:** The most persistent issue was `TypeError: Cannot set properties of undefined` due to `line_num` or `col_num` going out of bounds of the `output_grid`. This was caused by:
    *   **`_getTicks` generating values outside `ymin`/`ymax`:** While desirable for "nice" ticks, these values, when mapped to `output_grid` coordinates, could result in `line_num`s outside the `output_grid`'s `height`.
    *   **Floating-point `line_num`:** Array indices must be integers. Initial calculations sometimes resulted in floating-point `line_num`s, leading to `undefined` access.
    *   **Incorrect offset calculations:** Miscalculations in `plot_area_offset_y` or `plot_area_offset_x` led to labels being placed outside the `output_grid`.
    *   **Insufficient `width`/`height`:** The initial `width` and `height` provided by the user might not be large enough to accommodate all labels and the border, leading to labels being cut off or causing out-of-bounds access. This was addressed by dynamically calculating `actual_width` and ensuring sufficient space.
4.  **Label Alignment:** Centering x-labels and right-aligning y-labels required precise calculation of `start_col` and `col_num` based on label length and the overall grid structure.
5.  **Tick Mark Alignment:** Integrating tick marks into the border and aligning them with the labels required careful placement relative to the label area and the border lines.

The solution involved:
*   **Clamping `line_num`:** Using `Math.max(0, Math.min(height - 1, line_num_unclamped))` to ensure `line_num` always stays within valid bounds.
*   **Dynamic `y_label_width` and `actual_width`:** Calculating these dynamically based on actual label content and ensuring sufficient space.
*   **Precise offset calculations:** Carefully calculating `plot_area_offset_y`, `plot_start_x`, etc., to ensure correct placement of plot, labels, and border.

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
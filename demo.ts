import { plot } from './src';

function generateRandomData(count: number) {
    const x: number[] = [];
    const y: number[] = [];

    for (let i = 0; i < count; i++) {
        const xVal = Math.random() * 100; // Random number between 0 and 100
        x.push(xVal);
        y.push(xVal + (Math.random() * 10 - 5)); // xVal plus a random shift between -5 and 5
    }
    return { x, y };
}

const { x, y } = generateRandomData(1000);

const plotOutput = plot(x, y, {
    width: 100,
    height: 30,
    xlabels: 5,
    ylabels: 5,
    // Add other options as needed for demonstration
});

console.log(plotOutput);

import { plot } from './index';

const x = [];
const y = [];
for (let i = 0; i < 100; i++) {
    x.push(Math.random() * 10);
    y.push(Math.random() * 10);
}

const plotStr = plot(x, y, {width: 40, height: 15});
console.log(plotStr);

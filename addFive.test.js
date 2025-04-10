const  { default: TestRunner } = require("jest-runner");
const addFive = require('./addFive');

test ("returns the number plus 5", () => {
    expect(addFive(1)).toBe(6);
    expect(addFive(10)).toBe(15);
    expect(addFive(-5)).toBe(0);
    expect(addFive(0)).toBe(5);
    expect(addFive(100)).toBe(105);
    expect(addFive(-100)).toBe(-95);
});
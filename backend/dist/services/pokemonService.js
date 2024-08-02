"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFibonacciSequence = exports.isPrime = void 0;
const isPrime = (num) => {
    if (num <= 1)
        return false;
    for (let i = 2; i < num; i++) {
        if (num % i === 0)
            return false;
    }
    return true;
};
exports.isPrime = isPrime;
const getFibonacciSequence = (n) => {
    if (n <= 1)
        return n;
    return (0, exports.getFibonacciSequence)(n - 1) + (0, exports.getFibonacciSequence)(n - 2);
};
exports.getFibonacciSequence = getFibonacciSequence;

export const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

export const getFibonacciSequence = (n: number): number => {
    if (n <= 1) return n;
    return getFibonacciSequence(n - 1) + getFibonacciSequence(n - 2);
};

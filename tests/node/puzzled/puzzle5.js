/*
 *  From "Puzzled Programmers", p. 32:
 *
 *      Can you write a program that finds a four-digit number that is the sum of the fourth powers of its digits?
 *      In C or Pascal, your program should execute in less than 1 second; in BASIC, it should take about 35 seconds.
 *
 *  As one of the fictitious programmers in the book says:
 *
 *      "That's not hard. Just generate all the four-digit numbers, take the fourth power of each digit, add them up,
 *      and see if that's the same as the four-digit number."
 *
 *  But as another notes:
 *
 *      "Well, yes, that would work, but it's not very efficient and would make a rather slow program."
 *
 *  Obvious performance considerations include:
 *
 *      1) There are only 10 possible powers-of-four we're dealing with, so it would be best to calculate all ten
 *      ahead of time, rather than calculating each one thousands of times in a brute-force approach.
 *
 *      2) We might only want to sum unique combinations of those powers, since it's a waste of time doing it for, say,
 *      "1123", "1231", and any other combination of two 1s, one 2, and one 3.  However, since every combination of
 *      digits does have a unique value, and since we want to display all values meeting the criteria, there might not
 *      be a useful optimization along these lines.
 *
 *  One wrinkle is the digit 0: we'll assume that by "four-digit number", the puzzle didn't really mean to include
 *  numbers with leading zeros, like "0007" and "0099", so we'll start with 1000.
 *
 *  The solutions in "Puzzled Programmers" are very much hard-coded around the 4-digit nature of the puzzle, because
 *  they all rely on four nested loops (one loop per decimal place).  They also perform a small optimization that
 *  is really only noticeable when using BASIC: calculate a powers-of-four sum for every tenth number, and then for the
 *  next ten numbers, they need only do one more addition for the final digit (ie, in the ones place).  I added the
 *  same optimization below, but without the necessity of a hard-coded number of loops, allowing the "power" variable
 *  to be changed in order to investigate whether any 5-digit numbers, 6-digit numbers, etc, have similar properties.
 */

"use strict";

let p = new Array(10), power = 4, digits = power;
let start = Math.pow(10, digits-1), end = Math.pow(10, digits);

/**
 * sumPowers(n)
 *
 * @param {number} n
 * @returns {number}
 */
function sumPowers(n) {
    let total = 0;
    while (n) {
        total += p[n % 10];
        n = (n / 10)|0;
    }
    return total;
}

function run() {
    for (let d = 0; d < 10; d++) {
        p[d] = Math.pow(d, power);
    }
    let n = start;
    while (true) {
        let sum = sumPowers(n);
        for (let d = 0; d <= 9; d++) {
            if (sum + p[d] == n + d) console.log(n + d);
        }
        n += 10;
        if (n >= end) break;
    }
}

run();

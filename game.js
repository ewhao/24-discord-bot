import { Parser } from 'expr-eval';

// Return set that has valid solutions
export function getValidSet() {
    let set = [];
    let solutions = [];
    while (solutions.length == 0) {
        set = createSet();
        solutions = solveSet(set);
        if (solutions.length != 0) {
            return set;
        }
    }
    return null;
}

// Return set of four random numbers 1-13
function createSet() {
    let a = Math.ceil(Math.random() * 13);
    let b = Math.ceil(Math.random() * 13);
    let c = Math.ceil(Math.random() * 13);
    let d = Math.ceil(Math.random() * 13);
    return [a, b, c, d];
}

// Return array of up to 6 possible solutions to given set nums
export function solveSet(set) {
    let ops = ['+', '-', '*', '/'];

    function evalExpression(expr) {
        try {
            return Math.abs(eval(expr) - 24) < 1e-6;
        } catch (e) {
            return false;
        }
    }

    function generateExpressions(set) {
        let results = [];
        function permute(arr, chosen = []) {
            if (arr.length === 0) {
                results.push([...chosen]);
            } else {
                for (let i = 0; i < arr.length; i++) {
                    let temp = arr[i];
                    let remaining = arr.slice(0, i).concat(arr.slice(i + 1));
                    permute(remaining, chosen.concat(temp));
                }
            }
        }
        permute(set);
        return results;
    }

    function getSolutions(set) {
        let perms = generateExpressions(set);
        let solutions = new Set();
        for (let perm of perms) {
            for (let op1 of ops) {
                for (let op2 of ops) {
                    for (let op3 of ops) {
                        let expressions = [
                            `(${perm[0]}${op1}${perm[1]})${op2}(${perm[2]}${op3}${perm[3]})`,
                            `(${perm[0]}${op1}(${perm[1]}${op2}(${perm[2]}${op3}${perm[3]})))`,
                            `((${perm[0]}${op1}${perm[1]})${op2}${perm[2]})${op3}${perm[3]}`,
                            `${perm[0]}${op1}((${perm[1]}${op2}${perm[2]})${op3}${perm[3]})`,
                            `${perm[0]}${op1}(${perm[1]}${op2}(${perm[2]}${op3}${perm[3]}))`,
                            `(${perm[0]}${op1}${perm[1]})${op2}${perm[2]}${op3}${perm[3]}`
                        ];
                        for (let expr of expressions) {
                            if (evalExpression(expr)) {
                                solutions.add(expr);
                                if (solutions.size >= 6) break;
                            }
                        }
                        if (solutions.size >= 6) break;
                    }
                    if (solutions.size >= 6) break;
                }
                if (solutions.size >= 6) break;
            }
            if (solutions.size >= 6) break;
        }
        return solutions.size > 0 ? Array.from(solutions) : [];
    }

    let solutions = getSolutions(set);
    return solutions;
}

// Enum of possible results
export const Results = {
    CORRECT: 0,
    INCORRECT: 1,
    INVALID: 2,
    ERROR: 3
};

// Return one of Results after checking given answer for given set
export function checkAnswer(answer, set) {

    answer = answer.replaceAll('\`', '');
    console.log(`answer: ${answer}`);

    // check input format
    if (answer.match(/[^0-9\+\-\*\/\(\)]/g)) {  // answer contains non-numbers or non +-*/ operators
        return (Results.INVALID);
    }

    let nums = answer.match(/\d+/g);            // answer does not contain each number of set once
    if (nums.sort().join(",") != set.sort().join(",")) {
        return (Results.INVALID);
    }

    try {
        if (Parser.evaluate(answer) == 24) {
            return (Results.CORRECT);
        }
        return (Results.INCORRECT);
    } catch (error) {
        return (Results.ERROR);
    }
}
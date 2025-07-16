const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play24')
        .setDescription('Starts game of 24.'),
    async execute(interaction) {
        await interaction.reply(getValidSet().toString().replaceAll(',', ' '));
    },
};

// Return set that has valid solutions
function getValidSet() {
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

function createSet() {
    let a = Math.ceil(Math.random() * 13);
    let b = Math.ceil(Math.random() * 13);
    let c = Math.ceil(Math.random() * 13);
    let d = Math.ceil(Math.random() * 13);
    return [a, b, c, d];
}

function solveSet(nums) {
    let ops = ['+', '-', '*', '/'];

    function evalExpression(expr) {
        try {
            return Math.abs(eval(expr) - 24) < 1e-6;
        } catch (e) {
            return false;
        }
    }

    function generateExpressions(nums) {
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
        permute(nums);
        return results;
    }

    function getSolutions(nums) {
        let perms = generateExpressions(nums);
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

    let solutions = getSolutions(nums);
    return solutions;
}
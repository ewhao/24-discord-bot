class game {
    constructor(player) {
        this.player = player;
    }

    startGame() {
        console.log("Starting game");
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.playRound(rl);
    }

    playRound(rl) {
        this.getValidSet();
        // console.log(this.currentSet);

        rl.question(`${this.currentSet}\n`, (input) => {
            if (input == "q") {
                console.log("Thanks for playing!");
                rl.close();
            } else if (input == "s") {
                console.log(this.currentSolutions);
                this.playRound(rl);
            } else {
                console.log(this.checkAnswer(input));
                this.playRound(rl);
            }
        });
    }

    // Getters and setters
    getCurrentSet() {
        return this.currentSet;
    }
    setCurrentSet(currentSet) {
        this.currentSet = currentSet;
    }

    getCurrentSolutions() {
        return this.currentSolutions;
    }
    setCurrentSolutions(currentSolutions) {
        this.currentSolutions = currentSolutions;
    }

    // Return set that has valid solutions
    getValidSet() {
        let set = [];
        let solutions = [];
        while (solutions.length == 0) {
            set = this.createSet();
            solutions = this.solveSet(set);
            if (solutions.length != 0) {
                this.setCurrentSet(set);
                this.setCurrentSolutions(solutions);
            }
        }
    }

    // Return set of four random integers 1-13
    createSet() {
        let a = Math.ceil(Math.random() * 13);
        let b = Math.ceil(Math.random() * 13);
        let c = Math.ceil(Math.random() * 13);
        let d = Math.ceil(Math.random() * 13);
        return [a, b, c, d];
    }

    // Return up to 6 valid solutions for given set
    solveSet(nums) {
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

    checkAnswer(answer) {
        const Parser = require('expr-eval').Parser;
        try {
            if (Parser.evaluate(answer) == 24) {
                return("yippee");
            }
            return("boo");            
        } catch (error) {
            return("bad input");
        }

    }
}

let newGame = new game('player1');
newGame.startGame();
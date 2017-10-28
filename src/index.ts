import * as R from 'ramda';

interface Square {
    td: HTMLTableDataCellElement;
    x: number;
    y: number;
    on?: boolean;
}

class Game {
    constructor(public readonly width: number, public readonly height: number) {
        this.table = document.createElement("table");
        this.squares = [];

        for (let y = 0; y < height; y++) {
            const row = document.createElement("tr");
            this.table.appendChild(row);
            this.squares[y] = [];

            for (let x = 0; x < width; x++) {
                const td = document.createElement("td");
                const square: Square = { td, x, y };
                td.id = `${x}-${y}`;
                td.onclick = d => this.tableClick(square);
                row.appendChild(td);
                this.squares[y][x] = square;
            }
        }
    }

    private allSquares() {
        const list: Square[] = [];
        this.squares.forEach(row => {
            row.forEach(square => {
                if (square.on)
                    list.push(square);
            });
        });
        return list;
    }

    private tableClick(square: Square) {
        square.on = !square.on;
        square.td.className = square.on ? "on" : "off";
    }

    public solve() {

        const noSolved = document.getElementById("nosolution");
        if (noSolved) {
            noSolved.style.display = "none";
        }

        const all = this.allSquares();
        all.forEach(x => x.td.innerText = "");
        if (all.length == 0)
            return;
        const current = all.shift()!;
        const used = new Set<Square>([current]);
        const solved = this.solveR(current, current, used, all.length);

        if (!solved && noSolved) {
            noSolved.style.display = "block";
        }
    }

    private solveR(start: Square, current: Square, used: Set<Square>, remain: number): boolean {
        const solutions = this.getSolutions(start, current, used, remain);
        if (solutions.length == 0)
            return false;

        if (remain == 0) {
            current.td.innerText = this.getAscii(solutions[0].d);
            return true;
        }

        for (let solution of solutions) {
            current.td.innerText = this.getAscii(solution.d);

            // creating new sets is killing me with performance. Optimize by 
            // simply adding to the set and then removing after. Not "functional",
            // but damn. No other solution. 
            used.add(solution.sq);
            const solved = this.solveR(start, solution.sq, used, remain - 1);
            used.delete(solution.sq);

            if (solved)
                return true;
        }

        return false;
    }

    private getAscii(direction: number) {
        switch (direction) {
            case 0: return "<";
            case 1: return "^";
            case 2: return ">";
            case 3: return "v";
        }
        return "";
    }

    private getSolutions(start: Square, current: Square, used: Set<Square>, remain: number)
        : { sq: Square, d: number }[] {
        const squares: { sq: Square, d: number }[] = [];
        for (let d = 0; d < 4; d++) {
            const sq = this.getSquareInDirection(current, d);
            if (!sq)
                continue;

            // special case. Terminate the loop. 
            if (remain == 0 && sq == start) {
                squares.push({ sq, d });
                continue;
            }

            if (used.has(sq))
                continue;

            squares.push({ sq, d });
        }
        return squares;
    }

    private hasSquareInDirection(square: Square, direction: number) {
        return this.getSquareInDirection(square, direction) != null;
    }

    private getSquareInDirection(square: Square, direction: number): Square | null {
        const newx = this.hdirs[direction] + square.x;
        const newy = this.vdirs[direction] + square.y;

        if (newx < 0 || newx >= this.width)
            return null;
        if (newy < 0 || newy >= this.height)
            return null;
        const sq = this.squares[newy][newx];
        if (!sq.on)
            return null;
        return sq;
    }

    private readonly hdirs = [-1, 0, 1, 0];
    private readonly vdirs = [0, -1, 0, 1];
    private readonly squares: Square[][];
    table: HTMLTableElement;
}


function renderSolver(dom: HTMLElement | null, width: number, height: number): Game {
    if (!dom)
        throw new Error("Need a dom element.");
    const game = new Game(width, height);
    dom.innerHTML = "";
    dom.appendChild(game.table);
    return game;
}



const game = renderSolver(document.getElementById("game"), 12, 12);
const solve = document.getElementById("solve");
if (solve) {
    solve.onclick = x => game.solve();
}
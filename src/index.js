/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Game = /** @class */ (function () {
    function Game(width, height) {
        var _this = this;
        this.width = width;
        this.height = height;
        this.hdirs = [-1, 0, 1, 0];
        this.vdirs = [0, -1, 0, 1];
        this.table = document.createElement("table");
        this.squares = [];
        for (var y = 0; y < height; y++) {
            var row = document.createElement("tr");
            this.table.appendChild(row);
            this.squares[y] = [];
            var _loop_1 = function (x) {
                var td = document.createElement("td");
                var square = { td: td, x: x, y: y };
                td.id = x + "-" + y;
                td.onclick = function (d) { return _this.tableClick(square); };
                row.appendChild(td);
                this_1.squares[y][x] = square;
            };
            var this_1 = this;
            for (var x = 0; x < width; x++) {
                _loop_1(x);
            }
        }
    }
    Game.prototype.allSquares = function () {
        var list = [];
        this.squares.forEach(function (row) {
            row.forEach(function (square) {
                if (square.on)
                    list.push(square);
            });
        });
        return list;
    };
    Game.prototype.tableClick = function (square) {
        square.on = !square.on;
        square.td.className = square.on ? "on" : "off";
    };
    Game.prototype.solve = function () {
        var noSolved = document.getElementById("nosolution");
        if (noSolved) {
            noSolved.style.display = "none";
        }
        var all = this.allSquares();
        all.forEach(function (x) { return x.td.innerText = ""; });
        if (all.length == 0)
            return;
        var current = all.shift();
        var used = new Set([current]);
        var solved = this.solveR(current, current, used, all.length);
        if (!solved && noSolved) {
            noSolved.style.display = "block";
        }
    };
    Game.prototype.solveR = function (start, current, used, remain) {
        var solutions = this.getSolutions(start, current, used, remain);
        if (solutions.length == 0)
            return false;
        if (remain == 0) {
            current.td.innerText = this.getAscii(solutions[0].d);
            return true;
        }
        for (var _i = 0, solutions_1 = solutions; _i < solutions_1.length; _i++) {
            var solution = solutions_1[_i];
            current.td.innerText = this.getAscii(solution.d);
            // creating new sets is killing me with performance. Optimize by 
            // simply adding to the set and then removing after. Not "functional",
            // but damn. No other solution. 
            used.add(solution.sq);
            var solved = this.solveR(start, solution.sq, used, remain - 1);
            used.delete(solution.sq);
            if (solved)
                return true;
        }
        return false;
    };
    Game.prototype.getAscii = function (direction) {
        switch (direction) {
            case 0: return "<";
            case 1: return "^";
            case 2: return ">";
            case 3: return "v";
        }
        return "";
    };
    Game.prototype.getSolutions = function (start, current, used, remain) {
        var squares = [];
        for (var d = 0; d < 4; d++) {
            var sq = this.getSquareInDirection(current, d);
            if (!sq)
                continue;
            // special case. Terminate the loop. 
            if (remain == 0 && sq == start) {
                squares.push({ sq: sq, d: d });
                continue;
            }
            if (used.has(sq))
                continue;
            squares.push({ sq: sq, d: d });
        }
        return squares;
    };
    Game.prototype.hasSquareInDirection = function (square, direction) {
        return this.getSquareInDirection(square, direction) != null;
    };
    Game.prototype.getSquareInDirection = function (square, direction) {
        var newx = this.hdirs[direction] + square.x;
        var newy = this.vdirs[direction] + square.y;
        if (newx < 0 || newx >= this.width)
            return null;
        if (newy < 0 || newy >= this.height)
            return null;
        var sq = this.squares[newy][newx];
        if (!sq.on)
            return null;
        return sq;
    };
    return Game;
}());
function renderSolver(dom, width, height) {
    if (!dom)
        throw new Error("Need a dom element.");
    var game = new Game(width, height);
    dom.innerHTML = "";
    dom.appendChild(game.table);
    return game;
}
var game = renderSolver(document.getElementById("game"), 12, 12);
var solve = document.getElementById("solve");
if (solve) {
    solve.onclick = function (x) { return game.solve(); };
}


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map
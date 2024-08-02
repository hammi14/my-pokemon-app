"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renamePokemon = exports.releasePokemon = exports.catchPokemon = void 0;
const pokemonService_1 = require("../services/pokemonService");
let nicknameCounter = {};
const catchPokemon = (req, res) => {
    const success = Math.random() < 0.5;
    res.json({ success });
};
exports.catchPokemon = catchPokemon;
const releasePokemon = (req, res) => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const success = (0, pokemonService_1.isPrime)(randomNumber);
    res.json({ success, number: randomNumber });
};
exports.releasePokemon = releasePokemon;
const renamePokemon = (req, res) => {
    const { nickname } = req.body;
    if (!nicknameCounter[nickname])
        nicknameCounter[nickname] = 0;
    const sequence = (0, pokemonService_1.getFibonacciSequence)(nicknameCounter[nickname]);
    nicknameCounter[nickname]++;
    res.json({ newName: `${nickname}-${sequence}` });
};
exports.renamePokemon = renamePokemon;

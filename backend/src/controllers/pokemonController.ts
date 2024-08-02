import { Request, Response } from 'express';
import { isPrime, getFibonacciSequence } from '../services/pokemonService';

let nicknameCounter: { [key: string]: number } = {};

export const catchPokemon = (req: Request, res: Response) => {
    console.log('Received request to catch Pokémon:', {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
    });

    const success = Math.random() < 0.5;
    res.json({ success });
};

export const releasePokemon = (req: Request, res: Response) => {
    console.log('Received request to release Pokémon:', {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
    });

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const success = isPrime(randomNumber);
    res.json({ success, number: randomNumber });
};

export const renamePokemon = (req: Request, res: Response) => {
    console.log('Received request to rename Pokémon:', {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
    });

    const { nickname } = req.body;
    if (!nicknameCounter[nickname]) nicknameCounter[nickname] = 0;
    const sequence = getFibonacciSequence(nicknameCounter[nickname]);
    nicknameCounter[nickname]++;
    res.json({ newName: `${nickname}-${sequence}` });
};

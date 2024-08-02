import { Router } from 'express';
import { catchPokemon, releasePokemon, renamePokemon } from '../controllers/pokemonController';

const router = Router();

router.post('/catch', catchPokemon);
router.post('/release', releasePokemon);
router.post('/rename', renamePokemon);

export { router };

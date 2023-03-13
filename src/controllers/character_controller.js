import models from '../models'
import { generateRangeNumArray, getRandomInteger } from '../utils/functions';
import { getData } from '../utils/connection';
import BaseController from './base'

export default class CharacterController extends BaseController {
  CharacterController () { }

  async index (req, res) {
    try {
    const number = parseInt(req.query.number);

    if (Number.isNaN(number)) {
      return super.ErrorBadRequest(res, { message: "Bad Request: missing number parameter or number parameter is not a number" });
    }
    if (number <= 0) {
      return super.ErrorBadRequest(res, { message: "Bad Request: number must me greater than 0" });
    }
    
    const randomNumber = getRandomInteger(1, number); // we generate a random number of characters between 1 and number to return.
    const idArray = generateRangeNumArray(randomNumber); // id array for query parameter.
    const url = `https://rickandmortyapi.com/api/character/[${idArray}]`;
    const getResponse = await getData(url);
    const finalData = getResponse.data.map(data => {
      return {
        name: data.name,
        status: data.status,
        species: data.species,
        origin: data.origin.name
      }
    });
    return super.Success(res, finalData);
  } catch(e) {
    return super.InternalError(res, { message: e.message });
  }
  }

  async create (req, res) {
    const { name, status, species, origin } = req.body;
    if (!name | !status | !species | !origin) {
      return super.ErrorBadRequest(res, { message: 'Bad Request: Expected parameter is missing' });
    }
    try {
          await models.Character.create({name, status, species, origin})
          return super.Success(res, {message: 'Character created successfully'});
        } catch (e) {
          return super.InternalError(res, { message: e.message });
        } 
  }

  async show (req, res) {
    const { name } = req.query;
    try {
    let characters;
    characters = await models.Character.findAll({
      where: { name },
    });
    characters = characters.map(character => {
      return {
        name: character.name,
        status: character.status,
        species: character.species,
        origin: character.origin
      }
    });

    if (characters.length === 0) {
      const url = `https://rickandmortyapi.com/api/character/?name=${name}`;
      characters = await getData(url);
      if (!characters) {
        return super.NotFound(res, { message: 'Not found: Character was not found. Try again with a different name.' });
      }
      characters = characters.data.results.map(data => {
        return {
          name: data.name,
          status: data.status,
          species: data.species,
          origin: data.origin.name
        }
      });
    }
    return super.Success(res, characters)
  } catch(e) {
    return super.InternalError(res, { message: e.message });
  }
  }
}

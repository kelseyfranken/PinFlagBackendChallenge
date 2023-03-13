import sequelize from '../../config/sequelize';
import models from '../../models';
import { app } from '../..';
import CharacterController from '../../controllers/character_controller';
import { getData } from '../../utils/connection';
import request from 'supertest';

/* for supertest, app was still running when exiting out of tests. No "elegant" solution from: https://github.com/ladjs/supertest/issues/520 worked. 
So added --forceExit to jest.*/

const characterData = {
  name: 'Rick',
  status: 'Alive',
  species: 'Human',
  origin: 'Earth'
};

jest.mock('../../utils/connection');
jest.mock('../../utils/functions');

describe('Character Controller Test', () => {
  let req;
  let res;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await models.Character.create(characterData);
    req = {
      query: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(async () => {
    await models.Character.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('index GET /characters', () => {
    it('should return an array of characters', async () => {
      req.query.number = 3;
      const characterData = {
        data: [
          {
            name: 'Rick Sanchez',
            status: 'Alive',
            species: 'Human',
            origin: { name: 'Earth' }
          },
          {
            name: 'Morty Smith',
            status: 'Alive',
            species: 'Human',
            origin: { name: 'Earth' }
          },
          {
            name: 'Summer Smith',
            status: 'Alive',
            species: 'Human',
            origin: { name: 'Earth' }
          }
        ]
      };
      const responseData = [
        {
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          origin: 'Earth'
        },
        {
          name: 'Morty Smith',
          status: 'Alive',
          species: 'Human',
          origin: 'Earth'
        },
        {
          name: 'Summer Smith',
          status: 'Alive',
          species: 'Human',
          origin: 'Earth'
        }
      ]
      getData.mockResolvedValue(characterData);
      const characterController = new CharacterController();
      await characterController.index(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(responseData);

      const response = await request(app)
        .get('/character?number=3')
        .expect(200);
      expect(response.body.length).toEqual(3);
      expect(response.body.every(character => character.name && character.status && character.species && character.origin)).toBeTruthy();
      
    });

    it('should return a 400 error if number parameter is missing or not a number', async () => {
      req.query.number = 'invalid';
      const characterController = new CharacterController();
      await characterController.index(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Bad Request: missing number parameter or number parameter is not a number" });

      const response = await request(app)
      .get('/character')
      .expect(400);
      expect(response.body).toEqual({ message: 'Bad Request: missing number parameter or number parameter is not a number' });
    });

    it('should return a 500 error if an internal error occurs', async () => {
      req.query.number = 3;
      getData.mockRejectedValue(new Error('Internal Server Error'));
      const characterController = new CharacterController();
      await characterController.index(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });

    it('should return a 400 error if number parameter is equal or less than 0', async () => {
      req.query.number = '0';
      const characterController = new CharacterController();
      await characterController.index(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Bad Request: number must me greater than 0" });

      const response = await request(app)
      .get('/character?number=0')
      .expect(400);
      expect(response.body).toEqual({ message: 'Bad Request: number must me greater than 0' });
    });
  });

  describe('create', () => {
    it('should create a character', async () => {
      const newCharacter = { name: 'Hannah Montana', status: 'Alive', species: 'Human', origin: 'Earth' };
      const response = await request(app)
        .post('/character')
        .send(newCharacter)
        .expect(200);
      expect(response.body).toEqual({ message: 'Character created successfully' });
      const character = await models.Character.findOne({ where: { name: newCharacter.name } });
      expect(character).toBeTruthy();
      expect(character.status).toEqual(characterData.status);
      expect(character.species).toEqual(characterData.species);
      expect(character.origin).toEqual(characterData.origin);
    });

    it('should return a 400 error if body parameter is missing', async () => {
      const character = { status: 'Alive', species: 'Human', origin: 'Earth' };
      const response = await request(app)
        .post('/character')
        .send(character);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch('Bad Request: Expected parameter is missing');
    });

  });

  describe('show', () => {
    it('should show a character', async () => {
      req.query.name = 'Rick';
      const responseData = [characterData];
      const characterController = new CharacterController();
      await characterController.show(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(responseData);

      const response = await request(app).get('/character/show?name=Rick');
      expect(response.status).toBe(200);
    });

    it('should return a 404 error if character is not found', async () => {
      req.query.name = 'Bad Bunny';
      getData.mockResolvedValue();
      const characterController = new CharacterController();
      await characterController.show(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Not found: Character was not found. Try again with a different name." });

      const response = await request(app).get('/character/show?name=Invalid Name');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Not found: Character was not found. Try again with a different name.');
    });

    it('should return a 500 error if an internal error occurs', async () => {
      // Internal error occurs here because getData is mocked.
      req.query.number = 'Bad Bunny';
      const characterController = new CharacterController();
      await characterController.show(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
  
});
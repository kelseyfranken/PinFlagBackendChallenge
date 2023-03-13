# PINFLAG NODE JS CHALLENGE

## Correr API

Para correr la API crear un `.env` como el de `.env.example`. Luego, seguir los siguientes pasos:

```
docker pull postgres && docker run --name pinflag_challenge_db -e POSTGRES_DB=pinflag_challenge -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

```
docker build -t pinflag-challenge-app-image .
```

```
docker-compose run app npx sequelize-cli db:migrate
```

```
docker-compose up --build
```

## Tests

Para correr los tests:

```
docker-compose run app npm test
```

## Documentacion

La documentacion se encuentra en: `http://localhost:8080/api-docs/` (se debe estar corriendo la API para poder visualizarla).

## Suposiciones y Consideraciones

Para el endpoint de entregar a lo mas N personajes, se elige un numero random entre 1 y N y se utiliza un array con los ids de los personajes para obtenerlos.

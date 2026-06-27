# Tolo-Jensen-Technologies
Company Website

## Local development

```sh
npm install
npm run dev
```

## Docker

Build and run the production container with Docker Compose:

```sh
docker compose up --build
```

Open `http://localhost:8080`.

Or run it directly with Docker:

```sh
docker build -t tolo-jensen-technologies .
docker run --rm -p 8080:80 tolo-jensen-technologies
```

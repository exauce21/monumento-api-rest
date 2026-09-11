import type { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "../config/env.js";

const spec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Monumento API",
      version: "1.0.0",
      description: "API de gestion des monuments historiques, avec chat visiteurs / guides.",
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", minLength: 3, maxLength: 25, example: "visiteur" },
            role: { type: "string", enum: ["visitor", "guide"], example: "visitor" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserInput: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", minLength: 3, maxLength: 25, example: "visiteur" },
            password: { type: "string", format: "password", minLength: 6, maxLength: 100, example: "secret123" },
          },
        },
        AuthTokens: {
          type: "object",
          properties: {
            userId: { type: "integer", example: 1 },
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
          },
        },
        Anecdote: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            content: {
              type: "string",
              minLength: 10,
              maxLength: 2000,
              example: "La première pierre du monument a été posée en présence du maire.",
            },
            monumentId: { type: "integer", example: 15 },
          },
        },
        AnecdoteInput: {
          type: "object",
          required: ["content"],
          properties: {
            content: {
              type: "string",
              minLength: 10,
              maxLength: 2000,
              example: "La première pierre du monument a été posée en présence du maire.",
            },
          },
        },
        Favorite: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 3 },
            monumentId: { type: "integer", example: 15 },
          },
        },
        Monument: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Tour Eiffel" },
            country: { type: "string", example: "France" },
            city: { type: "string", example: "Paris" },
            buildYear: { type: "integer", nullable: true, example: 1889 },
            picture: { type: "string", nullable: true },
            description: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        MonumentInput: {
        type: "object",
            required: ["title", "country", "city"],
            properties: {
                title: { type: "string", minLength: 3, maxLength: 70, example: "Tour Eiffel" },
                country: { type: "string", minLength: 2, maxLength: 100, example: "France" },
                city: { type: "string", minLength: 2, maxLength: 100, example: "Paris" },
                buildYear: { type: "integer", nullable: true, minimum: -3000, example: 1889 },
                picture: { type: "string", format: "uri", nullable: true },
                description: { type: "string", nullable: true, maxLength: 2000 },
            },
        },
        ApiResponse: {
          type: "object",
          properties: { message: { type: "string" }, data: {} },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
});

export function mountSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
}
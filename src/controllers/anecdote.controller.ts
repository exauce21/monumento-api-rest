import type { RequestHandler } from "express";
import { Anecdote } from "../models/anecdote.model.js";
import { Monument } from "../models/monument.model.js";
import { badRequestError, notFoundError } from "../errors/http-error.js";

function getContent(body: unknown): string {
  const content = typeof body === "object" && body !== null
    ? (body as { content?: unknown }).content
    : undefined;

  if (typeof content !== "string" || content.trim() === "") {
    throw badRequestError("Le contenu de l'anecdote est obligatoire.");
  }

  return content;
}

export const findAllByMonument: RequestHandler = async (req, res) => {
  const monument = await Monument.findByPk(Number(req.params.id));
  if (!monument) {
    throw notFoundError(`Le monument avec l'ID ${req.params.id} n'a pas été trouvé`);
  }

  const anecdotes = await monument.getAnecdotes();
  res.json({ message: "Liste des anecdotes", data: anecdotes });
};

export const create: RequestHandler = async (req, res) => {
  const monument = await Monument.findByPk(Number(req.params.id));
  if (!monument) {
    throw notFoundError(`Le monument avec l'ID ${req.params.id} n'a pas été trouvé`);
  }

  const anecdote = await monument.createAnecdote({ content: getContent(req.body) });
  res.status(201).json({ message: "Anecdote créée", data: anecdote });
};

export const update: RequestHandler = async (req, res) => {
  const anecdote = await Anecdote.findByPk(Number(req.params.id));
  if (!anecdote) {
    throw notFoundError(`L'anecdote avec l'ID ${req.params.id} n'a pas été trouvée`);
  }

  await anecdote.update({ content: getContent(req.body) });
  res.json({ message: "Anecdote mise à jour", data: anecdote });
};

export const remove: RequestHandler = async (req, res) => {
  const anecdote = await Anecdote.findByPk(Number(req.params.id));
  if (!anecdote) {
    throw notFoundError(`L'anecdote avec l'ID ${req.params.id} n'a pas été trouvée`);
  }

  await anecdote.destroy();
  res.json({ message: "Anecdote supprimée", data: null });
};

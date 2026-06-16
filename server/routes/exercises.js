const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');
const exercises = require('../data/exercises.json');

function localize(ex, lang) {
  const { title_zh, description_zh, answer, ...rest } = ex;
  if (lang === 'zh') {
    return { ...rest, title: title_zh || rest.title, description: description_zh || rest.description };
  }
  return rest;
}

router.get('/', (req, res) => {
  const lang = req.query.lang || 'en';
  const list = exercises.map(ex => localize(ex, lang));
  const grouped = {};
  for (const ex of list) {
    if (!grouped[ex.category]) grouped[ex.category] = [];
    grouped[ex.category].push(ex);
  }
  res.json(grouped);
});

router.get('/:id', (req, res) => {
  const exercise = exercises.find(e => e.id === req.params.id);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
  const lang = req.query.lang || 'en';
  res.json(localize(exercise, lang));
});

function normalizeYaml(text) {
  try {
    return JSON.stringify(yaml.loadAll(text));
  } catch {
    return null;
  }
}

router.post('/:id/check', (req, res) => {
  const exercise = exercises.find(e => e.id === req.params.id);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

  const userNorm = normalizeYaml(req.body.content || '');
  const refNorm = normalizeYaml(exercise.answer);
  const correct = userNorm !== null && refNorm !== null && userNorm === refNorm;

  res.json({ answer: exercise.answer, correct });
});

module.exports = router;

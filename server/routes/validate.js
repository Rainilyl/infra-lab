const express = require('express');
const router = express.Router();
const yaml = require('js-yaml');

const PLAYBOOK_REQUIRED = ['hosts', 'tasks'];
const K8S_REQUIRED = ['apiVersion', 'kind', 'metadata'];

function validateStructure(doc, category) {
  const warnings = [];
  if (!doc || typeof doc !== 'object') return warnings;

  if (category === 'playbook') {
    const play = Array.isArray(doc) ? doc[0] : doc;
    if (play && typeof play === 'object') {
      for (const field of PLAYBOOK_REQUIRED) {
        if (!(field in play)) {
          warnings.push(`Missing recommended field: "${field}"`);
        }
      }
    }
  } else if (category === 'k8s') {
    const resource = Array.isArray(doc) ? doc[0] : doc;
    if (resource && typeof resource === 'object') {
      for (const field of K8S_REQUIRED) {
        if (!(field in resource)) {
          warnings.push(`Missing recommended field: "${field}"`);
        }
      }
    }
  }
  return warnings;
}

router.post('/', (req, res) => {
  const { content, category } = req.body;

  if (!content || typeof content !== 'string') {
    return res.json({ valid: false, errors: [{ message: 'Empty content' }] });
  }

  try {
    const docs = yaml.loadAll(content);
    const warnings = [];
    for (const doc of docs) {
      warnings.push(...validateStructure(doc, category));
    }
    res.json({ valid: true, warnings });
  } catch (e) {
    const error = {
      message: e.message,
      line: e.mark ? e.mark.line + 1 : null,
      column: e.mark ? e.mark.column + 1 : null,
    };
    res.json({ valid: false, errors: [error] });
  }
});

module.exports = router;

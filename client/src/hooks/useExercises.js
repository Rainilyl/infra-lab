import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'yaml-playground-completed';

function loadCompleted() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

export default function useExercises(lang) {
  const [exercises, setExercises] = useState({});
  const [completedIds, setCompletedIds] = useState(() => loadCompleted());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/exercises?lang=${lang || 'en'}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setExercises(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [lang]);

  const markCompleted = useCallback((id) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { exercises, completedIds, markCompleted, loading, error };
}

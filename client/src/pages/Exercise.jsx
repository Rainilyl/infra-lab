import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import useExercises from '../hooks/useExercises';
import ExerciseList from '../components/ExerciseList';
import YamlEditor from '../components/YamlEditor';
import DiffViewer from '../components/DiffViewer';

const MemoizedExerciseList = memo(ExerciseList);

export default function Exercise() {
  const { id } = useParams();
  const { lang, t } = useI18n();
  const { exercises, completedIds, markCompleted } = useExercises(lang);
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState('');
  const [activeCategory, setActiveCategory] = useState('playbook');
  const [validation, setValidation] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [referenceAnswer, setReferenceAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!id) return;
    setFetchError(null);
    fetch(`/api/exercises/${id}?lang=${lang}`)
      .then(r => {
        if (!r.ok) throw new Error(t.exercise.loadFailed);
        return r.json();
      })
      .then(ex => {
        setExercise(ex);
        setActiveCategory(ex.category);
        const saved = localStorage.getItem(`yaml-code-${id}`);
        setCode(saved || ex.template);
        setValidation(null);
        setShowDiff(false);
        setReferenceAnswer('');
        setIsCorrect(null);
      })
      .catch(err => setFetchError(err.message));
  }, [id, lang]);

  const handleValidate = useCallback(async () => {
    if (!exercise) return;
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: code, category: exercise.category }),
      });
      setValidation(await res.json());
    } catch {
      setValidation({ valid: false, errors: [{ message: t.exercise.serverUnavailable }] });
    }
  }, [code, exercise, t]);

  const handleCheckAnswer = useCallback(async () => {
    if (!exercise) return;
    try {
      const res = await fetch(`/api/exercises/${id}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: code }),
      });
      const result = await res.json();
      setReferenceAnswer(result.answer);
      setIsCorrect(result.correct);
      setShowDiff(true);
      if (result.correct) markCompleted(id);
    } catch {
      setValidation({ valid: false, errors: [{ message: t.exercise.serverUnavailable }] });
    }
  }, [code, exercise, id, markCompleted, t]);

  const handleReset = useCallback(() => {
    if (!exercise) return;
    setCode(exercise.template);
    setValidation(null);
    setShowDiff(false);
    setIsCorrect(null);
    localStorage.removeItem(`yaml-code-${id}`);
  }, [exercise, id]);

  const handleCodeChange = useCallback((value) => {
    const v = value || '';
    setCode(v);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (id) localStorage.setItem(`yaml-code-${id}`, v);
    }, 500);
  }, [id]);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  if (fetchError) return (
    <div className="home" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h2>{t.exercise.loadFailed}</h2>
      <p className="home-subtitle">{fetchError}</p>
    </div>
  );

  if (!exercise) return <div className="loading">{t.exercise.loading}</div>;

  return (
    <div className="exercise-page">
      <MemoizedExerciseList
        exercises={exercises}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeId={id}
        completedIds={completedIds}
      />
      <div className="exercise-main">
        <div className="exercise-desc">
          <div className="exercise-desc-badges">
            <span className={`badge badge-${exercise.difficulty}`}>
              {t.difficulty[exercise.difficulty] || exercise.difficulty}
            </span>
            <span className="badge" style={{ background: 'rgba(137, 180, 250, 0.15)', color: '#89b4fa' }}>
              {t.category[exercise.category] || exercise.category}
            </span>
          </div>
          <h2>{exercise.title}</h2>
          <div className="exercise-desc-text">{exercise.description}</div>
        </div>

        <div className="editor-area">
          <div className="editor-toolbar">
            <button className="btn btn-primary" onClick={handleValidate}>
              {t.exercise.validate}
            </button>
            <button className="btn btn-success" onClick={handleCheckAnswer}>
              {t.exercise.checkAnswer}
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              {t.exercise.reset}
            </button>
            <div className="toolbar-spacer" />
            {isCorrect !== null && (
              <span className={`toolbar-status ${isCorrect ? 'valid' : 'warning'}`}>
                {isCorrect ? t.exercise.correct : t.exercise.notQuite}
              </span>
            )}
            {isCorrect === null && validation && (
              <span className={`toolbar-status ${validation.valid ? (validation.warnings?.length ? 'warning' : 'valid') : 'invalid'}`}>
                {validation.valid
                  ? validation.warnings?.length
                    ? t.exercise.warnings(validation.warnings.length)
                    : t.exercise.validYaml
                  : t.exercise.invalidYaml}
              </span>
            )}
          </div>

          {showDiff ? (
            <DiffViewer
              userYaml={code}
              referenceYaml={referenceAnswer}
              onClose={() => { setShowDiff(false); setIsCorrect(null); }}
            />
          ) : (
            <YamlEditor
              value={code}
              onChange={handleCodeChange}
              errors={validation && !validation.valid ? validation.errors : []}
            />
          )}

          {validation && !showDiff && (
            <div className="validation-panel">
              {validation.valid ? (
                <>
                  <div className="validation-success">{t.exercise.syntaxValid}</div>
                  {validation.warnings?.map((w, i) => (
                    <div key={i} className="validation-warning">{t.exercise.warning}: {w}</div>
                  ))}
                </>
              ) : (
                validation.errors?.map((e, i) => (
                  <div key={i} className="validation-error">
                    {e.line ? `Line ${e.line}: ` : ''}{e.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

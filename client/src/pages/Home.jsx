import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import useExercises from '../hooks/useExercises';

export default function Home() {
  const { lang, t } = useI18n();
  const { exercises, completedIds, loading, error } = useExercises(lang);
  const [activeCategory, setActiveCategory] = useState('playbook');

  if (loading) return <div className="loading">{t.exercise.loading}</div>;
  if (error) return (
    <div className="home" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h2>{t.exercise.loadFailed}</h2>
      <p className="home-subtitle">{error}</p>
      <button className="btn btn-primary" onClick={() => window.location.reload()}
        style={{ display: 'inline-flex', margin: '16px auto' }}>
        {t.error.retry}
      </button>
    </div>
  );

  const categories = Object.keys(exercises);
  const list = exercises[activeCategory] || [];

  return (
    <div className="home">
      <h2>{t.home.title}</h2>
      <p className="home-subtitle">{t.home.subtitle}</p>

      {categories.length > 0 && (
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {t.category[cat] || cat}
            </button>
          ))}
        </div>
      )}

      <div className="exercise-grid">
        {list.map(ex => (
          <Link to={`/exercise/${ex.id}`} key={ex.id} className="exercise-card">
            <div className="exercise-card-header">
              <h3>{ex.title}</h3>
              <span className={`badge badge-${ex.difficulty}`}>
                {t.difficulty[ex.difficulty] || ex.difficulty}
              </span>
            </div>
            <p>{ex.description}</p>
            <div className="exercise-card-footer">
              <span>{t.category[ex.category]}</span>
              {completedIds.has(ex.id) && (
                <span className="completed-badge">{t.home.completed}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

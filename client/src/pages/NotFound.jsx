import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="home" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h2>{t.notFound.title}</h2>
      <p className="home-subtitle">{t.notFound.message}</p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 16 }}>
        {t.notFound.back}
      </Link>
    </div>
  );
}

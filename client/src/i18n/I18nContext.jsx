import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import en from './en';
import zh from './zh';

const locales = { en, zh };
const AppContext = createContext();

function getDefaultLang() {
  const saved = localStorage.getItem('yaml-playground-lang');
  if (saved && locales[saved]) return saved;
  const browser = navigator.language || '';
  return browser.startsWith('zh') ? 'zh' : 'en';
}

function getDefaultTheme() {
  const saved = localStorage.getItem('yaml-playground-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return 'light';
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getDefaultLang);
  const [theme, setThemeState] = useState(getDefaultTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setLang = useCallback((l) => {
    setLangState(l);
    localStorage.setItem('yaml-playground-lang', l);
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
  }, []);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    localStorage.setItem('yaml-playground-theme', t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('yaml-playground-theme', next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{ lang, setLang, t: locales[lang], theme, setTheme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useI18n() {
  return useContext(AppContext);
}

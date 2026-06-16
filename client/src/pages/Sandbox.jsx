import { useState, useCallback, useRef, useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';
import Editor from '@monaco-editor/react';

const DEFAULT_YAML = `# Free practice — write any YAML here
---
server:
  host: 0.0.0.0
  port: 8080

database:
  driver: postgres
  host: localhost
  port: 5432
  name: myapp
  credentials:
    username: admin
    password: secret

features:
  - name: auth
    enabled: true
  - name: cache
    enabled: false
    ttl: 3600
`;

export default function Sandbox() {
  const { t, theme } = useI18n();
  const [validation, setValidation] = useState(null);
  const codeRef = useRef(localStorage.getItem('yaml-sandbox') || DEFAULT_YAML);
  const saveTimer = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const handleCodeChange = useCallback((value) => {
    codeRef.current = value || '';
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem('yaml-sandbox', codeRef.current);
    }, 500);
  }, []);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    monaco.editor.setTheme(theme === 'dark' ? 'yaml-dark' : 'yaml-light');
  }, [theme]);

  const handleValidate = useCallback(async () => {
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: codeRef.current }),
      });
      setValidation(await res.json());
    } catch {
      setValidation({ valid: false, errors: [{ message: t.exercise.serverUnavailable }] });
    }
  }, [t]);

  const handleClear = useCallback(() => {
    codeRef.current = '';
    if (editorRef.current) {
      editorRef.current.setValue('');
    }
    setValidation(null);
    localStorage.removeItem('yaml-sandbox');
  }, []);

  function handleMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme('yaml-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#1e293b',
      },
    });
    monaco.editor.defineTheme('yaml-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e2e',
        'editor.foreground': '#cdd6f4',
      },
    });
    monaco.editor.setTheme(theme === 'dark' ? 'yaml-dark' : 'yaml-light');
    editor.focus();
  }

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (!model) return;
    const markers = (validation && !validation.valid ? validation.errors : [])
      .filter(e => e?.line)
      .map(e => ({
        severity: monaco.MarkerSeverity.Error,
        message: e.message,
        startLineNumber: e.line,
        startColumn: e.column || 1,
        endLineNumber: e.line,
        endColumn: e.column ? e.column + 10 : 100,
      }));
    monaco.editor.setModelMarkers(model, 'yaml-validation', markers);
  }, [validation]);

  return (
    <div className="sandbox-layout">
      <div className="sandbox-sidebar">
        <div className="sandbox-sidebar-section">
          <div className="sandbox-sidebar-title">{t.sandbox.title}</div>
          <p className="sandbox-sidebar-desc">{t.sandbox.subtitle}</p>
        </div>
        <div className="sandbox-sidebar-section">
          <div className="sandbox-sidebar-label">{t.sandbox.status}</div>
          <div className={`sandbox-status ${validation ? (validation.valid ? 'ok' : 'err') : 'idle'}`}>
            {validation
              ? validation.valid
                ? t.exercise.validYaml
                : t.exercise.invalidYaml
              : t.sandbox.notValidated}
          </div>
        </div>
        {validation && !validation.valid && (
          <div className="sandbox-sidebar-section sandbox-errors">
            <div className="sandbox-sidebar-label">{t.sandbox.errors}</div>
            {validation.errors?.map((e, i) => (
              <div key={i} className="sandbox-error-item">
                {e.line && <span className="sandbox-error-line">L{e.line}</span>}
                <span>{e.message}</span>
              </div>
            ))}
          </div>
        )}
        {validation?.warnings?.length > 0 && (
          <div className="sandbox-sidebar-section">
            <div className="sandbox-sidebar-label">{t.exercise.warning}</div>
            {validation.warnings.map((w, i) => (
              <div key={i} className="sandbox-warning-item">{w}</div>
            ))}
          </div>
        )}
      </div>

      <div className="sandbox-main">
        <div className="sandbox-tab-bar">
          <div className="sandbox-tab active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            playground.yaml
          </div>
          <div className="sandbox-tab-actions">
            <button className="btn btn-primary btn-sm" onClick={handleValidate}>
              {t.exercise.validate}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleClear}>
              {t.sandbox.clear}
            </button>
          </div>
        </div>
        <div className="sandbox-editor">
          <Editor
            height="100%"
            language="yaml"
            defaultValue={codeRef.current}
            onChange={handleCodeChange}
            onMount={handleMount}
            loading={<div className="loading">{t.exercise.loadingEditor}</div>}
            options={{
              minimap: { enabled: true, maxColumn: 60 },
              fontSize: 14,
              fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
              tabSize: 2,
              insertSpaces: true,
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              automaticLayout: true,
              wordWrap: 'on',
              padding: { top: 12, bottom: 12 },
              bracketPairColorization: { enabled: true },
              guides: { indentation: true, bracketPairs: true },
            }}
          />
        </div>
      </div>
    </div>
  );
}

import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useI18n } from '../i18n/I18nContext';

function defineThemes(monaco) {
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
}

export default function YamlEditor({ value, onChange, errors }) {
  const { t, theme } = useI18n();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    monaco.editor.setTheme(theme === 'dark' ? 'yaml-dark' : 'yaml-light');
  }, [theme]);

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (!model) return;

    const markers = (errors || [])
      .filter(e => e.line)
      .map(e => ({
        severity: monaco.MarkerSeverity.Error,
        message: e.message,
        startLineNumber: e.line,
        startColumn: e.column || 1,
        endLineNumber: e.line,
        endColumn: e.column ? e.column + 10 : 100,
      }));
    monaco.editor.setModelMarkers(model, 'yaml-validation', markers);
  }, [errors]);

  function handleMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    defineThemes(monaco);
    monaco.editor.setTheme(theme === 'dark' ? 'yaml-dark' : 'yaml-light');
  }

  return (
    <div className="editor-wrapper">
      <Editor
        height="100%"
        language="yaml"
        value={value}
        onChange={onChange}
        onMount={handleMount}
        loading={<div className="loading">{t.exercise.loadingEditor}</div>}
        options={{
          minimap: { enabled: false },
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
        }}
      />
    </div>
  );
}

import * as RDW from 'react-diff-viewer-continued';
import { useI18n } from '../i18n/I18nContext';

const _default = RDW.default;
const ReactDiffViewer = typeof _default === 'function' ? _default : _default?.default;
const DiffMethod = RDW.DiffMethod || _default?.DiffMethod;

const customStyles = {
  variables: {
    light: {
      diffViewerBackground: '#ffffff',
      addedBackground: 'rgba(34, 197, 94, 0.08)',
      addedColor: '#166534',
      removedBackground: 'rgba(239, 68, 68, 0.08)',
      removedColor: '#991b1b',
      wordAddedBackground: 'rgba(34, 197, 94, 0.2)',
      wordRemovedBackground: 'rgba(239, 68, 68, 0.2)',
      addedGutterBackground: 'rgba(34, 197, 94, 0.12)',
      removedGutterBackground: 'rgba(239, 68, 68, 0.12)',
      gutterBackground: '#f8fafc',
      gutterBackgroundDark: '#f1f5f9',
      highlightBackground: '#eff6ff',
      highlightGutterBackground: '#eff6ff',
      codeFoldGutterBackground: '#f1f5f9',
      codeFoldBackground: '#f8fafc',
      emptyLineBackground: '#ffffff',
      gutterColor: '#94a3b8',
      addedGutterColor: '#166534',
      removedGutterColor: '#991b1b',
      codeFoldContentColor: '#64748b',
      diffViewerTitleBackground: '#f1f5f9',
      diffViewerTitleColor: '#1e293b',
      diffViewerTitleBorderColor: '#e2e8f0',
    },
    dark: {
      diffViewerBackground: '#1e1e2e',
      addedBackground: 'rgba(166, 227, 161, 0.1)',
      addedColor: '#a6e3a1',
      removedBackground: 'rgba(243, 139, 168, 0.1)',
      removedColor: '#f38ba8',
      wordAddedBackground: 'rgba(166, 227, 161, 0.25)',
      wordRemovedBackground: 'rgba(243, 139, 168, 0.25)',
      addedGutterBackground: 'rgba(166, 227, 161, 0.15)',
      removedGutterBackground: 'rgba(243, 139, 168, 0.15)',
      gutterBackground: '#181825',
      gutterBackgroundDark: '#181825',
      highlightBackground: '#2d2d44',
      highlightGutterBackground: '#2d2d44',
      codeFoldGutterBackground: '#242438',
      codeFoldBackground: '#242438',
      emptyLineBackground: '#1e1e2e',
      gutterColor: '#6c7086',
      addedGutterColor: '#a6e3a1',
      removedGutterColor: '#f38ba8',
      codeFoldContentColor: '#a6adc8',
      diffViewerTitleBackground: '#181825',
      diffViewerTitleColor: '#cdd6f4',
      diffViewerTitleBorderColor: '#313244',
    },
  },
  line: {
    padding: '4px 8px',
    fontSize: '13px',
    fontFamily: "'Cascadia Code', 'Fira Code', monospace",
  },
};

export default function DiffViewer({ userYaml, referenceYaml, onClose }) {
  const { t, theme } = useI18n();

  return (
    <div className="diff-container">
      <div className="diff-header">
        <h3>{t.diff.title}</h3>
        <button className="btn btn-secondary" onClick={onClose}>
          {t.diff.backToEditor}
        </button>
      </div>
      <div className="diff-wrapper">
        <ReactDiffViewer
          oldValue={userYaml}
          newValue={referenceYaml}
          splitView={true}
          useDarkTheme={theme === 'dark'}
          leftTitle={t.diff.yourAnswer}
          rightTitle={t.diff.referenceAnswer}
          compareMethod={DiffMethod.WORDS}
          styles={customStyles}
        />
      </div>
    </div>
  );
}

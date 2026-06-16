import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: '#cdd6f4' }}>
          <h2>Something went wrong</h2>
          <p style={{ color: '#a6adc8', marginTop: 8 }}>{this.state.error.message}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16, padding: '8px 20px', background: '#89b4fa',
              border: 'none', borderRadius: 6, cursor: 'pointer', color: '#1e1e2e',
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

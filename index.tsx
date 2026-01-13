
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("CRITICAL APP ERROR:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#050b14', 
          color: '#fff',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>🚀 Houston, we have a problem!</h1>
          <p>The gaming portal encountered a critical error.</p>
          <pre style={{
            background: 'rgba(255,0,0,0.1)', 
            padding: '15px', 
            borderRadius: '10px', 
            marginTop: '20px', 
            maxWidth: '80%', 
            overflow: 'auto',
            border: '1px solid rgba(255,0,0,0.3)'
          }}>
            {this.state.error?.toString() || 'Unknown Error'}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px', 
              padding: '10px 20px', 
              background: '#6366f1', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Restart System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log("Starting Gaming Portal...");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#300', color: '#fff', height: '100vh' }}>
          <h1>CRITICAL RENDER ERROR</h1>
          <pre style={{ color: '#faa' }}>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{ fontSize: '0.8em', opacity: 0.8 }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log("React Entry: Full Bootstrap Initializing...");

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ErrorBoundary>
        </React.StrictMode>
    );
    console.log("React Entry: App Rendered with Router.");
} else {
    console.error("React Entry: Critical Error - Root container not detected.");
}

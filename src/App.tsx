import * as React from 'react';
import './App.css';
import { loadMetadata } from './utils/metadata';

function App() {
  const [metadata, setMetadata] = React.useState('not loaded');
  React.useEffect(() => {
    (async () => {
      console.log("hello world");
      const m = await loadMetadata();
      setMetadata(JSON.stringify(m, null, 2));
    })();
  }, [])
  return (
    <div style={{padding: 30}}>
        <pre>{metadata}</pre>
    </div>
  );
}

export default App;

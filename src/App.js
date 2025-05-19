import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import RouterComponent from './RouterComponent.js';
import './App.scss';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouterComponent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AuthLoader from './components/AuthLoader';
import { Toaster } from 'react-hot-toast';

function App() {


  return (
    <Provider store={store}>
      <Router>
        <AuthLoader/>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;
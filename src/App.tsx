import { Suspense } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AuthLoader from './components/AuthLoader';
import { Toaster } from 'react-hot-toast';
import SimpleCheckoutModal from './components/ui/SimpleCheckoutModal';

function App() {


  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        }>
          {/* <AuthLoader/> */}
          <SimpleCheckoutModal/>
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
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
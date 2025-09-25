import { BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AuthLoader from './components/AuthLoader';

function App() {


  return (
    <Provider store={store}>
      <Router>
        <AuthLoader/>
      </Router>
    </Provider>
  );
}

export default App;
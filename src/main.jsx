import ReactDOM from 'react-dom/client';
import store, {persistor} from './features/store';
import {Provider} from 'react-redux';
import App from './App';
import {PersistGate} from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import * as serviceWorker from './serviceWorker';
import * as subscription  from './subscription';

import MensaProvider from './Components/HOC/MensaProvider';
import Firebase, { FirebaseContext } from './Components/Firebase'
import SessionProvider from './Components/Session/SessionProvider';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <SnackbarProvider maxSnack = { 3 } autoHideDuration={ 2000 }>
      <SessionProvider>
        <MensaProvider>
              <App/>
        </MensaProvider> 
      </SessionProvider>
    </SnackbarProvider>
    </FirebaseContext.Provider>,
  document.getElementById("root")
);

serviceWorker.register();
//subscription.subscribeUser()

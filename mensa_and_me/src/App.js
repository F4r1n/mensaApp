import React from 'react';

import withMensa from './Components/HOC/MensaHOC';
import { withFirebase } from './Components/Firebase';
import withAuthentication from './Components/Session/SessionHOC';

import Home from "./Components/pages/Home"

import { createMuiTheme, MuiThemeProvider} from '@material-ui/core';
import { green, purple, red } from '@material-ui/core/colors';

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      light: green[300],
      main: "#64DD17",
      dark: green[700]
    },
    secondary: {
      light: purple[300],
      main: "#F5F5F5",
      dark: purple[700]
    },
    error: {
      light: red[300],
      main: red[500],
      dark: red[700]
    }
  }
});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: green[300],
      main: "#64DD17",
      dark: green[700]
    },
    secondary: {
      light: purple[300],
      main: "#F5F5F5",
      dark: purple[700]
    },
    error: {
      light: red[300],
      main: red[500],
      dark: red[700]
    }
  }
});

class App extends React.Component {
  render() {
    var backgCol = "whitesmoke"
    var theme = lightTheme

    if (this.props.user) {
      if (this.props.user.darkMode) {
        backgCol = "darkslategrey"
        theme = darkTheme
      }
    }
    
    return (
      < div style = {
        {
          backgroundColor: backgCol,
          color: backgCol,
          minHeight: "100vh",
          fontSize: "calc(10px + 2vmin)"
        }
      } >
        <header>
          <MuiThemeProvider theme={theme}>
            <Home/>
          </MuiThemeProvider>
        </header> 
      </div>
    );
  }
}

export default withMensa(withFirebase(withAuthentication(App)));

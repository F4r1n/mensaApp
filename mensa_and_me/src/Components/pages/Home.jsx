import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";

import TopBar from "../utils/TopBar";
import BottomNav from "../utils/BottomNav";
import Health from "./Health";
import Finance from "./Finance";
import Overview from "./Overview";
import withMensa from "../HOC/MensaHOC";
import Settings from "./Settings";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import PasswortForget from "./PasswortForget";
import PasswordChange from "./PasswordChange";
import { withFirebase } from "../Firebase";

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    title: {
        flexGrow: 1
    },
    content: {
        margin: theme.spacing(1)
    },
    bottomNav: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
    },
});

class ButtonAppBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const classes = this.props.classes;

        return (
            <Router>
                <div className={classes.root}>
                    <TopBar/>
                    <div className={classes.content}>
                        <Switch>
                            <Route exact path='/'>
                                <Overview/>
                            </Route>

                            <Route path='/health'>
                                <Health />
                            </Route>

                            <Route path='/finance'>
                                <Finance />
                            </Route>

                            <Route path='/settings'>
                                <Settings />
                            </Route>

                            <Route path='/login'>
                                <SignInForm />
                            </Route>

                            <Route path='/signup'>
                                <SignUpForm />
                            </Route>

                            <Route path='/forgot'>
                                <PasswortForget />
                            </Route>

                            <Route path='/change'>
                                <PasswordChange />
                            </Route>
                        </Switch>
                    </div>
                    {this.props.user && <BottomNav />}
                </div>
            </Router>
        );
    }
}

export default withStyles(styles)(withMensa(withFirebase(ButtonAppBar)))
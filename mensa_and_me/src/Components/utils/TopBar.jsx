import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Grid, IconButton, Button } from '@material-ui/core';

import SettingsIcon from '@material-ui/icons/Settings';
import withMensa from '../HOC/MensaHOC';
import { Link } from 'react-router-dom';
import SignOutButton from './SignOutButton';
import withAuthentication from '../Session/SessionHOC';

import logo from './../../logo_2.svg';

const styles = theme => ({
    logo: {
        height: theme.spacing(6)
    }
});

class TopBar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        const { classes } = this.props

        return (
            <AppBar position="static" id="back-to-top-anchor">
                <Toolbar>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item >
                            <Link to={'/'} style={{ textDecoration: 'none' }}>
                                <img alt="Mensa & Me" src={logo} className={classes.logo} />
                            </Link>
                        </Grid>
                        <Grid item >
                            {!this.props.authUser &&
                                <Link to={'/login'} style={{ textDecoration: 'none' }}>
                                    <Button variant="outlined">Login</Button>
                                </Link>
                            }

                            {this.props.authUser &&
                                <div>
                                    <Link to={'/'} style={{ textDecoration: 'none' }}>
                                        <SignOutButton />
                                    </Link>

                                    <Link to={'/settings'} style={{ textDecoration: 'none' }}>
                                        <IconButton> <SettingsIcon /></IconButton>
                                    </Link>
                                </div>}
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles)(withMensa(withAuthentication(TopBar)))
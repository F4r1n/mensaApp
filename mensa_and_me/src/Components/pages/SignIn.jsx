import React from 'react';
import { withRouter } from 'react-router-dom';
import withMensa from '../HOC/MensaHOC';
import { withFirebase } from '../Firebase';

import { SignUpLink } from '../pages/SignUp';
import { Button, withStyles, Grid, Paper, TextField } from '@material-ui/core';
import { PasswordForgetLink } from './PasswortForget';

const styles = theme => ({
    form: {
        padding: theme.spacing(2)
    },
    textField: {
        margin: theme.spacing()
    },
    root: {
        marginBottom: theme.spacing(6)
    }
});

class SignInForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ email: '', password: '' });
                this.props.history.push("/");
            })
            .catch(function (error) {
                this.props.snackbar(error)
            }.bind(this));

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password } = this.state;
        const classes = this.props.classes

        const isInvalid = password === '' || email === '';

        return (
            <Paper elevation={3} className={classes.root}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <form onSubmit={this.onSubmit} className={classes.form}>
                        <Grid item>
                            <TextField
                                className={classes.textField}
                                name="email"
                                value={email}
                                onChange={this.onChange}
                                type="email"
                                label="Email"
                                color="primary"
                                variant='outlined'
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                className={classes.textField}
                                name="password"
                                value={password}
                                onChange={this.onChange}
                                type="password"
                                label="Passwort"
                                color="primary"
                                variant='outlined'
                            />
                        </Grid>
                        <Grid item>
                            <PasswordForgetLink />
                            <Button color="primary" variant="contained" disabled={isInvalid} type="submit">Anmelden</Button>
                        </Grid>
                    </form>
                    <Grid item>
                        <SignUpLink />
                    </Grid>
                </Grid>                
            </Paper>
        );
    }
}

export default withStyles(styles)(withMensa(withRouter(withFirebase(SignInForm))))
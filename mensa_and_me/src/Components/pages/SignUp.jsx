import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import withMensa from '../HOC/MensaHOC';
import { withFirebase } from '../Firebase';

import { Button, withStyles, Grid, Paper, Typography, TextField } from '@material-ui/core';

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

class SignUpForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            emailError: false,
            password: '',
            passwordVerifictaion: ''
        }
    }

    onSubmit = event => {
        const { username, email, password } = this.state;
        let user = {
            name: username,
            favMensa: { "id": 30, "name": "Mensa HTW Treskowallee", "city": "Berlin", "address": "Treskowallee 8, 10318 Berlin", "coordinates": [52.4931221056714, 13.5258704423904] },
            favMeals: [],
            role: "Student",
            notificationPreferences: false,
            darkMode: false,
            balance: 0,
            boughtMeals: []
        }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, password)
            .then(authUser => {
                return this.props.firebase
                    .doPutUser(email, user)
            })
            .then(() => {
                this.setState({ 
                    username: '',
                    email: '',
                    emailError: false,
                    password: '',
                    passwordVerifictaion: '',
                 });
                this.props.history.push("/");
            })
            .catch(function (error) {
                this.props.snackbar(error)
            }.bind(this));
        event.preventDefault();
    }

    onChange = event => {
        var field = event.target.name
        var value = event.target.value
        this.setState({ [field]: value }, () => {
            if (field === "email") {
                let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                this.state.email === "" ? this.setState({ emailError: false }) : this.setState({ emailError: !re.test(String(this.state.email).toLowerCase()) })
            }
        });
    };

    render() {
        const { username, email, emailError, password, passwordVerifictaion } = this.state;
        const { classes } = this.props

        const isInvalid = password !== passwordVerifictaion ||
            password === '' ||
            email === '' ||
            username === '' ||
            emailError;

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
                                    name="username"
                                    value={username}
                                    onChange={this.onChange}
                                    type="name"
                                    label="Name"
                                    color="primary"
                                    variant='outlined'
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    className={classes.textField}
                                    name="email"
                                    value={email}
                                    error={emailError}
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
                                    helperText="Mindestens sechs Zeichen lang"
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
                                <TextField
                                    className={classes.textField}
                                    name="passwordVerifictaion"
                                    value={passwordVerifictaion}
                                    onChange={this.onChange}
                                    type="password"
                                    label="Passwort bestätigen"
                                    color="primary"
                                    variant='outlined'
                                />
                            </Grid>
                            <Grid item>
                                <Button color="primary" variant="contained" disabled={isInvalid} type="submit">Konto anlegen</Button>
                            </Grid>
                        </form>
                    </Grid>
                </Paper>
        );
    }
}
const SignUpLink = () => (
    <Typography>
        Noch kein Konto? <Link to={"/signup"}>Konto anlegen</Link>
    </Typography>
);

export default withStyles(styles)(withMensa(withRouter(withFirebase(SignUpForm))))
export { SignUpLink }
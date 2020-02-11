import React from 'react';
import { withFirebase } from '../Firebase';
import { Button, Paper, Grid, TextField, withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import withMensa from '../HOC/MensaHOC';

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

class PasswordChangeForm extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            password: '',
            passwordVerifictaion: ''
        };
    }

    onSubmit = event => {
        const { password } = this.state;
        this.props.firebase
            .doPasswordUpdate(password)
            .then(() => {
                this.setState({ password: '', passwordVerifictaion: ''});
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
        const { classes } = this.props
        const { password, passwordVerifictaion } = this.state;
        const isInvalid = password !== passwordVerifictaion || password === '';

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
                            <Button color="primary" variant="contained" disabled={isInvalid} type="submit">
                                Passwort ändern
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        );
    }
}
export default withStyles(styles)(withMensa(withRouter(withFirebase(PasswordChangeForm))));
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { Typography, withStyles, Paper, Grid, Button, TextField } from '@material-ui/core';
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

class PasswordForgetForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
    }

    onSubmit = event => {
        const { email } = this.state;
        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ email: '' });
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
        const { email, error } = this.state;
        const isInvalid = email === '';

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
                            <Button color="primary" variant="contained" disabled={isInvalid} type="submit">
                                Passwort zurücksetzen
                            </Button>
                            {error && <Typography color="error">{error.message}</Typography>}
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        );
    }
}
const PasswordForgetLink = () => (
    <Typography>
        <Link to={"/forgot"}>Passwort vergessen?</Link>
    </Typography>
);

export default withStyles(styles)(withMensa(withRouter(withFirebase(PasswordForgetForm))))
export { PasswordForgetLink };
import React from 'react';
import { withStyles } from '@material-ui/styles';

import { Typography, Paper, Grid, IconButton, TextField, Button, InputAdornment } from '@material-ui/core';
import withMensa from '../HOC/MensaHOC';

import { FaBitcoin, FaPaypal, FaCcVisa, FaApplePay, FaAmazonPay, FaAlipay } from "react-icons/fa"
import withAuthentication from '../Session/SessionHOC';
import { withFirebase } from '../Firebase';

const styles = theme => ({
    body: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(6)
    },
    element: {
        padding: theme.spacing(2)
    },
    button: {
        padding: theme.spacing(),
        margin: theme.spacing(),
        width: "20px"
    },
    elementIcons: {
        padding: theme.spacing(),
        marginLeft: theme.spacing(8)
    }
});

class Finance extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            amount: 10
        }
    }

    onChange = event => {
        var value = Number(event.target.value)
        if (value !== "NaN") {
            this.setState({ amount: value });
        }
    };

    addBalance() {
        var localUser = this.props.user
        localUser.balance = this.props.user.balance + this.state.amount
        this.props.firebase.users.doc(this.props.authUser.email).update({
            "balance": localUser.balance
        })
            // .then(function () {
            //     console.log("Document successfully updated!");
            // })
            .then(this.props.getUser(this.props.authUser))
    }

    render() {
        const classes = this.props.classes;
        const { amount } = this.state

        return (
            <Paper elevation={3} className={classes.body}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={classes.body}
                >
                    <Grid item sm={12} className={classes.element}>
                        <Typography variant="h5">Bezahlung</Typography>
                    </Grid>
                    <Grid item sm={12} className={classes.element}>
                        <Typography>Wert auswählen</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Grid item sm={4} xs={6}>
                                <Button onClick={() => this.setState({ amount: 5 })} color="primary" variant="contained" size="large" className={classes.button}>5 €</Button>
                            </Grid>
                            <Grid item sm={4} xs={6}>
                                <Button onClick={() => this.setState({ amount: 10 })} color="primary" variant="contained" size="large" className={classes.button}>10 €</Button>
                            </Grid>
                            <Grid item sm={4} xs={6}>
                                <Button onClick={() => this.setState({ amount: 20 })} color="primary" variant="contained" size="large" className={classes.button}>20 €</Button>
                            </Grid>
                            <Grid item sm={4} xs={6}>
                                <Button onClick={() => this.setState({ amount: 50 })} color="primary" variant="contained" size="large" className={classes.button}>50 €</Button>
                            </Grid>
                            <Grid item sm={4} xs={6}>
                                <Button onClick={() => this.setState({ amount: 100 })} color="primary" variant="contained" size="large" className={classes.button}>100 €</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.element}>
                        <TextField
                            name="amount"
                            value={amount}
                            onChange={this.onChange}
                            label="Wert"
                            type="number"
                            color="primary"
                            variant='outlined'
                            InputProps={{
                                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item sm={12} className={classes.element}>
                        <Typography>Bezahlart auswählen</Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.elementIcons}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Grid item sm={4} xs={6}>
                                <IconButton onClick={() => this.addBalance()}><FaBitcoin style={{ fontSize: 40 }} /></IconButton>
                            </Grid>
                            <Grid item sm={4} xs={6}>
                                <IconButton onClick={() => this.addBalance()}><FaPaypal style={{ fontSize: 40 }} /></IconButton>
                            </Grid>
                            <Grid item sm={4} xs={6}>
                                <IconButton onClick={() => this.addBalance()}><FaCcVisa style={{ fontSize: 40 }} /></IconButton>
                            </Grid>
                            <Grid item sm={4} xs={6}>
                                <IconButton onClick={() => this.addBalance()}><FaApplePay style={{ fontSize: 40 }} /></IconButton>
                            </Grid>
                            <Grid item sm={4} xs={6}>
                                <IconButton onClick={() => this.addBalance()}><FaAmazonPay style={{ fontSize: 40 }} /></IconButton>
                            </Grid>
                            <Grid item sm={4} xs={6}>
                                <IconButton onClick={() => this.addBalance()}><FaAlipay style={{ fontSize: 40 }} /></IconButton>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item sm={12} className={classes.element}>
                        <Typography>Aktuelles Guthaben</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {this.props.user && <Typography variant="h3">{parseFloat(this.props.user.balance).toFixed(2)}€</Typography>}
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(withMensa(withFirebase(withAuthentication(Finance))));
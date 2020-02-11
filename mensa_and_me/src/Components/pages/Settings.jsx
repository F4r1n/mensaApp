import React from 'react';

import { Typography, Paper, Grid, Switch, FormControlLabel, InputLabel, MenuItem, Select, FormControl, Button, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import withMensa from '../HOC/MensaHOC';
import { withFirebase } from '../Firebase';
import withAuthentication from './../Session/SessionHOC';
import FavFoodDialog from '../dialogs/FavFoodDialog';
import BoughtMealsDialog from '../dialogs/BoughtMealsDialog';


const styles = theme => ({
    settingProp: {
        margin: theme.spacing(2),
    },
    body: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(6)
    }
});

class Settings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            favFoodDialogOpen: false,
            boughtFoodDialogOpen: false
        }
    }

    handleChangeDarkModeSwitch() {
        var localUser = this.props.user
        localUser.darkMode = !this.props.user.darkMode
        // this.setState({ user: localUser });
        this.props.firebase.users.doc(this.props.authUser.email).update({
            "darkMode": localUser.darkMode
        })
            .then(this.props.getUser(this.props.authUser))
    }

    handleFavMensaChange(ev) {
        var localUser = this.props.user
        localUser.favMensa = this.props.mensen.find(o => o.id === ev.target.value);
        this.setState({ user: localUser });
        this.props.firebase.users.doc(this.props.authUser.email).update({
            "favMensa": localUser.favMensa
        })
            .then(this.props.getUser(this.props.authUser))
    }

    handleRoleChange(ev) {
        var localUser = this.props.user
        localUser.role = ev.target.value;
        this.props.firebase.users.doc(this.props.authUser.email).update({
            "role": localUser.role
        })
            .then(this.props.getUser(this.props.authUser))
    }

    handleNotificationSwitch() {
        Notification.requestPermission(status => {
            console.log("Notification permission status: ", status);
            if (status === "granted") {
                this.props.firebase.users.doc(this.props.authUser.email).update({
                    "notificationPreferences": !this.props.user.notificationPreferences
                })
                    .then(this.props.getUser(this.props.authUser))
            }
        });
    }

    handleCloseFavFoodDialog() {
        this.setState({ favFoodDialogOpen: !this.state.favFoodDialogOpen})
    }

    handleCloseBoughtFoodDialog() {
        this.setState({ boughtFoodDialogOpen: !this.state.boughtFoodDialogOpen})
    }

    render() {
        const { classes, mensen, user } = this.props;
        const { favFoodDialogOpen, boughtFoodDialogOpen } = this.state;

        mensen && mensen.sort((a, b) => {
            return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
        });

        return (
            <Paper elevation={3} className={classes.body}>
                <FavFoodDialog open={favFoodDialogOpen} handleClose={() => this.handleCloseFavFoodDialog()} />
                <BoughtMealsDialog open={boughtFoodDialogOpen} handleClose={() => this.handleCloseBoughtFoodDialog()} />
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Typography variant="h5">Einstellungen</Typography>
                    {user ?
                        <div>
                            <Grid item className={classes.settingProp}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={user.darkMode}
                                            onChange={() => this.handleChangeDarkModeSwitch()}
                                            color="primary"
                                        />
                                    }
                                    label="Dark Mode"
                                />
                            </Grid>

                            <Divider orientation="horizontal" />
                            
                            <Grid item className={classes.settingProp}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={user.notificationPreferences}
                                            onChange={() => this.handleNotificationSwitch()}
                                            color="primary"
                                        />
                                    }
                                    label="Benachrichtigungen erlauben"
                                />
                            </Grid>
                            <Divider orientation="horizontal" />
                            <Grid item className={classes.settingProp}>
                                <FormControl>
                                    <InputLabel id="favMensa-label">Favorisierte Mensa</InputLabel>
                                    <Select
                                        labelId="favMensa-label"
                                        value={user.favMensa.id}
                                        onChange={this.handleFavMensaChange.bind(this)}
                                    >
                                        {this.props.mensen.map(mensa => {
                                            return (
                                                <MenuItem key={mensa.id} value={mensa.id}>{mensa.name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Divider orientation="horizontal"/>
                            <Grid item className={classes.settingProp}>
                                <FormControl>
                                    <InputLabel id="role-label">Nutzerrolle</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        value={user.role}
                                        onChange={this.handleRoleChange.bind(this)}
                                    >
                                        
                                        <MenuItem key={"student"} value={"Student"}>Student</MenuItem>
                                        <MenuItem key={"mitarbeiter"} value={"Mitarbeiter"}>Mitarbeiter</MenuItem>
                                        <MenuItem key={"andere"} value={"Andere"}>Andere</MenuItem>
                                      
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Divider orientation="horizontal" />
                            <Grid item className={classes.settingProp}>
                                <Button variant="contained" color="primary" onClick={() => this.setState({ favFoodDialogOpen: true})}>Lieblingsspeisen verwalten</Button>
                            </Grid>
                            <Divider orientation="horizontal" />
                            <Grid item className={classes.settingProp}>
                                <Button variant="contained" color="primary" onClick={() => this.setState({ boughtFoodDialogOpen: true})}>Käufe verwalten</Button>
                            </Grid>
                        </div> :
                        <Typography>Nur verfügbar für angemeldete Nutzer!</Typography>
                    }
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(withMensa(withFirebase(withAuthentication(Settings))))
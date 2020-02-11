import React from 'react';

import { Typography, Paper, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import withMensa from '../HOC/MensaHOC';
import { withFirebase } from '../Firebase';
import withAuthentication from '../Session/SessionHOC';

import PieChart from 'react-minimal-pie-chart'

const styles = theme => ({
    body: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(6)
    },
    item: {
        padding: theme.spacing(2)
    },
});

class Health extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    getPieData() {
        const user = this.props.user

        var rot = 0
        var grün = 0
        var gelb = 0
        var total = 0

        if (user) {
            user.boughtMeals.map(meal => {
                switch (meal.notes[meal.notes.length - 1]) {
                    case "grün (Ampel)":
                        grün++
                        total++
                        break;

                    case "gelb (Ampel)":
                        gelb++
                        total++
                        break;

                    case "rot (Ampel)":
                        rot++
                        total++
                        break;
                    default:
                        break;
                }
                return null
            })
            return { grün: grün, rot: rot, gelb: gelb, total: total }
        }
    }

    render() {
        const classes = this.props.classes;
        var data = this.getPieData()

        return (
            <Paper elevation={3} className={classes.body}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={classes.body}
                >
                    <Grid item sm={6} xs={12}>
                        <Typography variant="h5">Ihre Gesundheitsübersicht</Typography>
                        {data ?
                            <Grid container direction="column">
                                <Grid item className={classes.item}>
                                    <PieChart
                                        animate={true}
                                        data={[
                                            { title: 'Grün', value: data.grün, color: 'green' },
                                            { title: 'Gelb', value: data.gelb, color: 'yellow' },
                                            { title: 'Rot', value: data.rot, color: 'red' },
                                        ]}
                                    />
                                </Grid>
                                <Grid item><Typography>Grüne Gerichte: {data.grün}</Typography></Grid>
                                <Grid item><Typography>Gelbe Gerichte: {data.gelb}</Typography></Grid>
                                <Grid item><Typography>Rote Gerichte: {data.rot}</Typography></Grid>
                                <Grid item><Typography>Gesamt: {data.total}</Typography></Grid>
                            </Grid>
                            : <Typography>Sie haben anscheinend noch keine Gerichte über diese App gekauft.</Typography>}
                    </Grid>

                    <Grid item sm={6} xs={12}>

                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(withMensa(withAuthentication(withFirebase(Health))))
import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Typography, Paper, Grid, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, IconButton, Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/styles';
import Circle from './Circle';
import MensaDialog from '../dialogs/MensaDialog';

import WarningIcon from "@material-ui/icons/Warning"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import HeartIcon from '@material-ui/icons/Favorite';
import EmptyHeartIcon from '@material-ui/icons/FavoriteBorder';
import LocationIcon from '@material-ui/icons/LocationOn';
import ScrollTop from './ScrollToTop';

import withMensa from '../HOC/MensaHOC';
import { withFirebase } from '../Firebase';
import withAuthentication from './../Session/SessionHOC';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-prevent-tabpanel-${index}`}
            aria-labelledby={`scrollable-prevent-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-prevent-tab-${index}`,
        'aria-controls': `scrollable-prevent-tabpanel-${index}`,
    };
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        marginBottom: theme.spacing(3)
    },
    meal: {
        marginTop: theme.spacing(),
        marginBottom: theme.spacing()
    },
    body: {
        padding: theme.spacing(2)
    },
    backToTopFloat: {
        position: 'fixed',
        bottom: theme.spacing(8),
        right: theme.spacing(2)
    },
    price: {
        paddingTop: theme.spacing()
    },
    notes: {
        paddingLeft: theme.spacing(2)
    }
});

class Meallist extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: 0,
            dates: [],
            mealList: null,
            mensenOpen: false
        }
    }

    componentDidMount() {
        this.getWeek()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.mensa.id !== this.props.mensa.id) {
            this.getWeek()
        }
    }

    favoriteMeal(meal) {
        var localUser = this.props.user
        var i = localUser.favMeals.findIndex(element => element.id === meal.id)
        if (i > -1) {
            localUser.favMeals.splice(i, 1);
        } else {
            localUser.favMeals.push(meal)
        }

        this.props.firebase.users.doc(this.props.authUser.email).update({
            "favMeals": localUser.favMeals
        })
            .then(function () {
                console.log("Document successfully updated!");
            })
            .then(this.props.getUser(this.props.authUser))
    }

    getWeek() {
        var moment = require('moment')
        var weekDayToday = moment().weekday()
        var startOfWeekDisplayed = null
        var dayOpened = 0

        switch (weekDayToday) {
            //get next monday if it is saturday
            case 6:
                startOfWeekDisplayed = moment().add(2, 'days')
                break;
            //get next monday if it is sunday
            case 0:
                startOfWeekDisplayed = moment().add(1, 'days')
                break;
            //get this monday if it is any weekday
            default:
                startOfWeekDisplayed = moment().startOf('week').add(1, 'days')
                dayOpened = weekDayToday - 1
                break;
        }
        var monday = startOfWeekDisplayed
        var tuesday = startOfWeekDisplayed
        var wednesday = startOfWeekDisplayed
        var thursday = startOfWeekDisplayed
        var friday = startOfWeekDisplayed
        this.setState({
            dates: {
                monday: monday.format('YYYY-MM-D'),
                tuesday: tuesday.add(1, 'd').format('YYYY-MM-D'),
                wednesday: wednesday.add(1, 'd').format('YYYY-MM-D'),
                thursday: thursday.add(1, 'd').format('YYYY-MM-D'),
                friday: friday.add(1, 'd').format('YYYY-MM-D')
            }, value: dayOpened
        }, () => { this.getMeals() })
    }

    getMeals() {
        var request = require("request");
        const dates = this.state.dates

        Object.keys(dates).forEach(key => {
            var options = {
                method: 'GET',
                url: 'https://openmensa.org/api/v2/canteens/' + this.props.mensa.id + '/days/' + dates[key] + '/meals',
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                var obj = JSON.parse(body);
                var localMealList = []
                this.state.mealList ? localMealList = this.state.mealList : localMealList = []

                var groupBy = function (xs, key) {
                    return xs.reduce(function (rv, x) {
                        (rv[x[key]] = rv[x[key]] || []).push(x);
                        return rv;
                    }, {});
                };
                localMealList[key] = groupBy(obj, 'category')
                this.setState({ mealList: localMealList })
            }.bind(this));
        });
    }

    buyMeal(meal, date) {
        var localUser = this.props.user
        var price = 0.0

        switch (this.props.user.role) {
            case "Student":
                price = parseFloat(meal.prices.students)
                break;
            case "Mitarbeiter":
                price = parseFloat(meal.prices.employees)
                break;
            case "Andere":
                price = parseFloat(meal.prices.others)
                break;
            default:
                break;
        }
        
        if (parseFloat(localUser.balance) - price > 0) {
            localUser.balance = parseFloat(localUser.balance) - price
            meal["date"] = date
            meal["price"] = price
            meal["mensa"] = this.props.mensa.name
            localUser.boughtMeals.push(meal)
            this.props.firebase.users.doc(this.props.authUser.email).update({
                "boughtMeals": localUser.boughtMeals
            })
            this.props.firebase.users.doc(this.props.authUser.email).update({
                "balance": localUser.balance
            })
        } else {
            this.props.snackbar({code: "fundsmissing"})
        }
        
    }

    getMealDisplay(day, date) {
        const { classes } = this.props
        const colorMap = {
            "rot": "red",
            "grün": "green",
            "gelb": "yellow"
        }

        return (
            //Mensa closed
            day === undefined || Object.keys(day).length === 0 ?
                <Paper elevation={3} className={classes.meal}>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item>
                            <WarningIcon />
                        </Grid>
                        <Grid item>
                            <Typography>
                                Die Mensa hat heute leider geschlossen!
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper> :
                //Mensa open
                day && Object.keys(day).map(key => {
                    return (
                        <ExpansionPanel key={key}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                id={key}
                            >
                                <Typography>{key}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid
                                    container
                                    direction="column"
                                    spacing={0}
                                >
                                    {day[key].map((meal) => {
                                        var color = ""
                                        if (meal.notes !== [] && meal.notes[meal.notes.length - 1].includes("(Ampel)")) {
                                            color = meal.notes[meal.notes.length - 1].replace(" (Ampel)", "")
                                        }

                                        return (
                                            <Paper key={meal.id} className={classes.meal}>
                                                <Grid
                                                    container
                                                    className={classes.body}
                                                    direction="row"
                                                    justify="space-between"
                                                    alignItems="center"
                                                >
                                                    <Grid item sm={1} xs={5}>
                                                        <Grid
                                                            container
                                                            direction="row"
                                                            justify="flex-start"
                                                            alignItems="center"
                                                        >
                                                            {/* Health Indicator */}
                                                            <Grid item>
                                                                {color !== "" ? <Circle color={colorMap[color]} />: null}
                                                            </Grid>
                                                            {/* Favorite */}
                                                            <Grid item>
                                                                {this.props.authUser && this.props.user && 
                                                                    <IconButton onClick={() => this.favoriteMeal(meal)}>
                                                                        {this.props.user.favMeals.find(element => element.id === meal.id) ? <HeartIcon /> : <EmptyHeartIcon />}
                                                                    </IconButton>}
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item sm={9} xs={7}>
                                                        <Typography>{meal.name}</Typography>
                                                    </Grid>
                                                    {this.props.authUser && this.props.user && this.props.user.role ?
                                                        <Grid item sm={2} xs={12} className={classes.price}>
                                                            <Grid container direction="row" justify="space-between">
                                                                <Grid item>
                                                                    <Typography className={classes.price}>
                                                                        {this.props.user.role === "Student" && this.props.user.role + ":" + meal.prices.students && meal.prices.students + " €"}
                                                                        {this.props.user.role === "Mitarbeiter" && this.props.user.role + ":" + meal.prices.employees && meal.prices.employees + " €"}
                                                                        {this.props.user.role === "Andere" && this.props.user.role + ":" + meal.prices.others && meal.prices.others + " €"}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Button variant="contained" color="primary" onClick={() => {this.buyMeal(meal, date)}}>Kaufen</Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        : <Grid item sm={2} xs={12} className={classes.price}>
                                                            <ul>
                                                                <Typography>
                                                                    Studenten: {meal.prices.students ? meal.prices.students : "-"} €
                                                            </Typography>

                                                                <Typography>
                                                                    Mitarbeiter: {meal.prices.employees ? meal.prices.employees : "-"} €
                                                            </Typography>

                                                                <Typography>
                                                                    Andere: {meal.prices.others ? meal.prices.others : "-"} €
                                                            </Typography>
                                                            </ul>
                                                        </Grid>}
                                                </Grid>

                                                {(meal.notes[meal.notes.length - 2] === "vegan" || meal.notes[meal.notes.length - 2] === "vegetarisch") &&
                                                    <Grid item sm={12} className={classes.notes}>
                                                        <Typography>{meal.notes[meal.notes.length - 2]}</Typography>
                                                    </Grid>
                                                }
                                            </Paper>
                                        )
                                    })}
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                })
        )
    }

    reformatDay(day) {
        if (day) {
            var date = day.split('-')
            return date[2] + '.' + date[1] + '.'
        }
    }

    toggleMensenDialog() {
        this.setState({ mensenOpen: !this.state.mensenOpen })
    }

    render() {
        const { classes, mensa } = this.props
        const { value, mealList, dates, mensenOpen } = this.state

        var reformatedDates = {
            monday: this.reformatDay(dates.monday),
            tuesday: this.reformatDay(dates.tuesday),
            wednesday: this.reformatDay(dates.wednesday),
            thursday: this.reformatDay(dates.thursday),
            friday: this.reformatDay(dates.friday)
        }

        return (
            <div className={classes.root}>            
                {mensa && <IconButton variant="contained" onClick={() => this.toggleMensenDialog()}><LocationIcon color="action" /> {mensa.name}</IconButton>}
                <AppBar position="static">
                    <Tabs
                        value={value}
                        onChange={(event, newValue) => { this.setState({ value: newValue }) }}
                        variant="scrollable"
                        scrollButtons="on"
                    >
                        <Tab label={reformatedDates ? "Mo, " + reformatedDates.monday : "Mo"} {...a11yProps(0)} />
                        <Tab label={reformatedDates ? "Di, " + reformatedDates.tuesday : "Di"} {...a11yProps(1)} />
                        <Tab label={reformatedDates ? "Mi, " + reformatedDates.wednesday : "Mi"} {...a11yProps(2)} />
                        <Tab label={reformatedDates ? "Do, " + reformatedDates.thursday : "Do"} {...a11yProps(3)} />
                        <Tab label={reformatedDates ? "Fr, " + reformatedDates.friday : "Fr"} {...a11yProps(4)} />
                    </Tabs>
                </AppBar>

                <TabPanel value={value} index={0}>
                    {mealList && this.getMealDisplay(mealList.monday, reformatedDates.monday)}
                </TabPanel>

                <TabPanel value={value} index={1}>
                    {mealList && this.getMealDisplay(mealList.tuesday, reformatedDates.tuesday)}
                </TabPanel>

                <TabPanel value={value} index={2}>
                    {mealList && this.getMealDisplay(mealList.wednesday, reformatedDates.wednesday)}
                </TabPanel>

                <TabPanel value={value} index={3}>
                    {mealList && this.getMealDisplay(mealList.thursday, reformatedDates.thursday)}
                </TabPanel>

                <TabPanel value={value} index={4}>
                    {mealList && this.getMealDisplay(mealList.friday, reformatedDates.friday)}
                </TabPanel>
                <ScrollTop className={classes.backToTopFloat} />

                <MensaDialog open={mensenOpen} handleClose={() => this.toggleMensenDialog()} />
            </div>
        );
    }
}

export default withStyles(styles)(withMensa(withAuthentication(withFirebase(Meallist))))
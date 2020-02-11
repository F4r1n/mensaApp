import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import HealthIcon from '@material-ui/icons/Healing';
import OverviewIcon from '@material-ui/icons/List';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import withMensa from '../HOC/MensaHOC';

const styles = theme => ({
    root: {
        width: '100%',
        position: 'fixed',
        marginTop: theme.spacing(),
        bottom: 0,
        backgroundColor: theme.palette.primary.main
    },
});

class BottomNav extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: 0
        }
    }

    render() {
        const classes = this.props.classes;

        return (
            <BottomNavigation
                value={this.state.value}
                onChange={(event, newValue) => {
                    this.setState({ value: newValue })
                }}
                className={classes.root}
                showLabels
            >
                <Link to={'/'} style={{ textDecoration: 'none'}}>
                    <BottomNavigationAction label="Übersicht" showLabel icon={<OverviewIcon />} />
                </Link>
                <Link to={'/finance'} style={{ textDecoration: 'none' }}>
                    <BottomNavigationAction label="Finanzen" showLabel icon={<MoneyIcon />} />
                </Link>
                <Link to={'/health'} style={{ textDecoration: 'none' }}>
                    <BottomNavigationAction label="Gesundheit" showLabel icon={<HealthIcon />} />
                </Link>
            </BottomNavigation>
        );
    }
}

export default withStyles(styles)(withMensa(BottomNav))
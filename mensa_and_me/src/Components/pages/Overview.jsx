import React from 'react';
import { withStyles } from '@material-ui/styles';
import Meallist from '../utils/Meallist';
import withMensa from '../HOC/MensaHOC';

const styles = theme => ({
    body: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(6)
    }
});

class Overview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const classes = this.props.classes

        return (
            <div className={classes.body}>
                {this.props.mensa && <Meallist/>}
            </div>
        );
    }
}

export default withStyles(styles)(withMensa(Overview))
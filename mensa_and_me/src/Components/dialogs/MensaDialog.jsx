import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import withMensa from '../HOC/MensaHOC';

import { Dialog, Typography, Grid, Switch, FormControlLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

import MUIDataTable from "mui-datatables";

const styles = theme => ({
    body: {
        padding: theme.spacing(2)
    },
    formElement: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class MensaDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            mensaNearMe: false
        }
    }

    handleMensaSwitch() {
        this.setState({ mensaNearMe: !this.state.mensaNearMe })
    }

    getDistance(array) {
        var distFrom = require('distance-from')
        this.props.geolocationPermission && array && array.map((mensa, i) => {
            var dist = distFrom(mensa.coordinates).to([this.props.lat, this.props.long]).in('km').toFixed(2)
            mensa.distance = dist
            array[i] = mensa
            return null
        })
        return array
    }

    render() {
        const { classes, mensa, setMensa, open, handleClose } = this.props
        const mensaNearMe = this.state.mensaNearMe

        var mensen = this.getDistance(this.props.mensen)
        var mensenNearMe = this.getDistance(this.props.mensenNearMe)
       
        var data = mensaNearMe ? mensenNearMe : mensen

        return (
            <div className={classes.body}>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    maxWidth='xl'
                    fullWidth={true}
                    scroll="body"
                >
                    <DialogContent>
                        <Typography display="inline">{mensa && "Aktuell ausgewählt: "}</Typography>
                        <Typography display="inline" variant="h6">{mensa && mensa.name}</Typography>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="flex-start"
                        >
                            <Grid item sm={12}>
                                <Typography>Sie können entweder die Liste aller Mensen von Berlin benutzen oder sich Mensen in ihrer Nähe anzeigen lassen.</Typography>
                                {!this.props.geolocationPermission && <Typography>Letzteres sowie Entfernungen zu den Mensen benötigt Zugriff auf ihren Standort.</Typography>}
                            </Grid>
                            <Grid item className={classes.formElement}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.mensaNearMe}
                                            onChange={() => this.handleMensaSwitch()}
                                            color="primary"
                                            disabled={!this.props.geolocationPermission}
                                        />
                                    }
                                    label="Mensen in meiner Nähe"
                                />
                            </Grid>
                            {!this.props.geolocationPermission &&
                                <Grid item className={classes.formElement}>
                                    <Button variant="contained" color="primary" onClick={() => this.props.getGeoLocationPermission(this.props.getMensaNearMe())}>Zugriff auf Standort jetzt gewähren</Button>
                                </Grid>}
                        </Grid>

                        <MUIDataTable
                            title={"Mensen"}
                            data={data}
                            columns={[
                                {
                                    name: "id",
                                    label: "ID",
                                    options: {
                                        filter: false,
                                        sort: false,
                                        display: "excluded",
                                        viewColumns: false,
                                    }
                                },
                                {
                                    name: "setMensa",
                                    label: "Mensa auswählen",
                                    options: {
                                        filter: false,
                                        sort: false,
                                        customBodyRender: (value, tableMeta, updateValue) => {
                                            return (<Button variant="contained" color="primary" onClick={() => { setMensa(data.find(o => o.id === tableMeta.rowData[0])); handleClose() }}>Auswählen</Button>)
                                        }
                                    }
                                },
                                {
                                    name: "name",
                                    label: "Name",
                                    options: {
                                        filter: true,
                                        filterType: "dropdown",
                                        sort: true
                                    }
                                },
                                {
                                    name: "city",
                                    label: "Stadt",
                                    options: {
                                        filter: true,
                                        filterType: "dropdown",
                                        sort: false,
                                        display: false
                                    }
                                },
                                {
                                    name: "address",
                                    label: "Adresse",
                                    options: {
                                        filter: true,
                                        filterType: "dropdown",
                                        sort: true
                                    }
                                },
                                {
                                    name: "coordinates",
                                    label: "Adresse",
                                    options: {
                                        filter: false,
                                        sort: false,
                                        display: "excluded",
                                        viewColumns: false,
                                    }
                                },
                                {
                                    name: "distance",
                                    label: "Entfernung",
                                    options: {
                                        display: !this.props.geolocationPermission ? "excluded" : "true",
                                        filter: false,
                                        sort: true,
                                        customBodyRender: (value, tableMeta, updateValue) => {
                                            if (tableMeta.rowData != null) {
                                                return (
                                                    <Typography>{value + " km"}</Typography>
                                                )
                                            }
                                        }
                                    }
                                },
                                {
                                    name: "showRoute",
                                    label: "Route anzeigen",
                                    options: {
                                        display: !this.props.geolocationPermission ? "excluded" : "true",
                                        filter: false,
                                        sort: false,
                                        viewColumns: false,
                                        customBodyRender: (value, tableMeta, updateValue) => {
                                            return (<Button variant="contained" color="primary" onClick={() => { window.open("https://www.google.com/maps/dir/?api=1&origin=" + [this.props.lat, this.props.long].join(',') + "&destination=" + tableMeta.rowData[5].join(','), "_blank") }}>Route</Button>)
                                        }
                                    }
                                },
                            ]}
                            options={{
                                filterType: "checkbox",
                                responsive: 'scrollMaxHeight',
                                selectableRows: 'none',
                                rowHover: false,
                                print: false,
                                download: false,
                                pagination: false,
                                textLabels: {
                                    toolbar: {
                                        search: "Suche",
                                        viewColumns: "Spalten anzeigen",
                                        filterTable: "Tabelle filtern",
                                    },
                                    filter: {
                                        all: "Alle",
                                        title: "Filter",
                                        reset: "Zurücksetzen",
                                    },
                                    viewColumns: {
                                        title: "Spalten anzeigen",
                                        titleAria: "Spalten anzeigen/ausblenden",
                                    },
                                    body: {
                                        noMatch: "Keine passenden Ergebnisse gefunden",
                                        toolTip: "Sortieren",
                                    },
                                    pagination: {
                                        next: "Nächste Seite",
                                        previous: "Vorherige Seite",
                                        rowsPerPage: "Ergebnisse:",
                                        displayRows: "von",
                                    },
                                },
                                customSort: (data, colIndex, order) => {
                                    return data.sort((a, b) => {
                                        switch (colIndex) {
                                            case 2:
                                                return (a.data[colIndex].toLowerCase() < b.data[colIndex].toLowerCase() ? -1 : 1) * (order === 'desc' ? 1 : -1);
                                            case 4:
                                                return (a.data[colIndex].toLowerCase() < b.data[colIndex].toLowerCase() ? -1 : 1) * (order === 'desc' ? 1 : -1);
                                            case 6:
                                                return (a.data[colIndex] < b.data[colIndex] ? -1 : 1) * (order === 'desc' ? 1 : -1)
                                            default:
                                                return 0
                                        }
                                    });
                                },
                            }}
                        />
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" variant="contained">
                            Schließen
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

MensaDialog.propTypes = {
    /**
     * open
     */
    open: PropTypes.bool,
    /**
     * setOpen toggles open state
     */
    handleClose: PropTypes.func
};

export default withStyles(styles)(withMensa(MensaDialog))
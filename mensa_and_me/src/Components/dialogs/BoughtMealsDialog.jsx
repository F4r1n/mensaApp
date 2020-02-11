import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import withMensa from '../HOC/MensaHOC';
import { withFirebase } from '../Firebase';
import withAuthentication from '../Session/SessionHOC';

import { Dialog, IconButton, Slide, DialogContent, DialogActions, Button } from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close"

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

class BoughtMeals extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    removeBoughtMeal(meal) {
        var localUser = this.props.user
        var i = localUser.boughtMeals.findIndex(element => element.id === meal[1])
        if (i > -1) {
            localUser.boughtMeals.splice(i, 1);
        }

        this.props.firebase.users.doc(this.props.authUser.email).update({
            "boughtMeals": localUser.boughtMeals
        })
            .then(function () {
                console.log("Document successfully updated!");
            })
            .then(this.props.getUser(this.props.authUser))
    }

    render() {
        const { classes, open, handleClose } = this.props

        var tableData = this.props.user ? this.props.user.boughtMeals : []
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
                        <MUIDataTable
                            title={"Käufe"}
                            data={tableData}
                            columns={[
                                {
                                    name: "date",
                                    label: "Datum",
                                    options: {
                                        filter: false,
                                        sort: true,
                                        viewColumns: true,
                                    }
                                },
                                {
                                    name: "price",
                                    label: "Preis",
                                    options: {
                                        filter: false,
                                        sort: true,
                                        viewColumns: true,
                                    }
                                },
                                {
                                    name: "mensa",
                                    label: "Mensa",
                                    options: {
                                        filter: true,
                                        filterType: "dropdown",
                                        sort: true,
                                        viewColumns: true,
                                    }
                                },
                                {
                                    name: "category",
                                    label: "Kategorie",
                                    options: {
                                        filter: true,
                                        filterType: "dropdown",
                                        sort: true,
                                        viewColumns: true,
                                    }
                                },
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
                                    name: "name",
                                    label: "Name",
                                    options: {
                                        filter: false,
                                        sort: true
                                    }
                                },
                                {
                                    name: "notes",
                                    label: "Notizen",
                                    options: {
                                        filter: false,
                                        sort: false,
                                        display: "excluded",
                                        viewColumns: false
                                    }
                                },
                                {
                                    name: "prices",
                                    label: "Preis",
                                    options: {
                                        filter: false,
                                        sort: false,
                                        display: "excluded",
                                        viewColumns: false
                                    }
                                },
                                {
                                    name: "remove",
                                    label: "Entfernen",
                                    options: {
                                        filter: false,
                                        sort: false,
                                        customBodyRender: (value, tableMeta, updateValue) => {
                                            return (<IconButton onClick={() => { this.removeBoughtMeal(tableMeta.rowData) }}><CloseIcon /></IconButton>)
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
                                }
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

BoughtMeals.propTypes = {
    /**
     * open
     */
    open: PropTypes.bool,
    /**
     * setOpen toggles open state
     */
    handleClose: PropTypes.func,
};

export default withStyles(styles)(withMensa(withFirebase(withAuthentication(BoughtMeals))))

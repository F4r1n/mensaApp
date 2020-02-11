import React from "react";
import { withFirebase } from "../Firebase";
import withAuthentication from "../Session/SessionHOC";
import { withSnackbar } from 'notistack';

export const MensaContext = React.createContext(null);

/**
 * this is the provider of mensa context
 */
class MensaProvider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            geolocationPermission: null,
            mensen: [],
            long: 0,
            lat: 0,
            mensa: undefined,
            mensenNearMe: [],
            user: null,
            getGeoLocationPermission: (callback) => this.getGeoLocationPermission(callback),
            setMensa: (mensa) => this.setMensa(mensa),
            getMensaNearMe: () => this.getMensaNearMe(),
            getUser: (user) => this.getUser(user),
            setUser: (user) => this.setUser(user),
            snackbar: (error) => this.snackbar(error)
        };
        this.getMensaNearMe = this.getMensaNearMe.bind(this);
        this.setGeoState = this.setGeoState.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    componentWillUnmount() {
        this.listener();
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    this.getUser(authUser)
                } else {
                    if (this.state.mensa === undefined) {
                        this.setState({ mensa: { "id": 30, "name": "Mensa HTW Treskowallee", "city": "Berlin", "address": "Treskowallee 8, 10318 Berlin", "coordinates": [52.4931221056714, 13.5258704423904] } })
                    }
                }
            }
        );

        var appleDevices = ["MacIntel", "iPhone", "iPod", "iPad", "Macintosh"]
        if (!appleDevices.includes(navigator.platform)) {
            navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
                if (result.state === 'granted') {
                    console.log("Geo permission granted")
                    navigator.geolocation.getCurrentPosition(this.setGeoState, this.geoError, { maximumAge: 5 * 60 * 1000, timeout: 10 * 1000 });
                } else if (result.state === 'denied') {
                    console.log("Geo permission denied")
                    this.setState({ geolocationPermission: false })
                }
            }.bind(this))
        } else {
            this.setState({ geolocationPermission: false })
        }
        var mensen = []
        this.props.firebase && this.props.firebase.mensen.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                mensen.push(doc.data());
            });
        });
        this.setState({ mensen: mensen })

    }

    setUser(user) {
        this.setState({ user: user })
    }

    getUser(authUser) {
        this.props.firebase.users.doc(authUser.email).get().then((doc) => {
            if (doc.exists) {
                this.setState({ user: doc.data() }, () => {
                    this.setState({ mensa: this.state.user.favMensa })
                })
            } else {
                this.setState({ user: null });
                this.props.enqueueSnackbar('Nutzer nicht gefunden!', { variant: "error" });
            }
        }).catch(function (error) {
            this.setState({ user: null });
            this.snackbar(error)
        }.bind(this));
    }

    snackbar(message) {
        //Error Codes taken from https://firebase.google.com/docs/auth/admin/errors
        switch (message.code) {
            case "auth/too-many-requests":
                this.props.enqueueSnackbar("Zu viele fehlgeschlagene Loginanfragen. Versuchen Sie es später erneut.", { variant: "error" })
                break;
            case "auth/wrong-password":
                this.props.enqueueSnackbar("Das Passwort ist falsch oder der Nutzer ist nicht vorhanden.", { variant: "error" })
                break;
            case "auth/invalid-password":
                this.props.enqueueSnackbar("Das Passwort ist ungültig. Es muss mindestens 6 Zeichen lang sein.", { variant: "error" })
                break;
            case "auth/auth/invalid-email":
                this.props.enqueueSnackbar("Ungültige Email..", { variant: "error" })
                break;
            case "auth/user-not-found":
                this.props.enqueueSnackbar("Es ist kein Nutzer mit dieser Email registriert.", { variant: "error" })
                break;
            case "auth/email-already-exists":
                this.props.enqueueSnackbar("Es ist bereits ein Nutzer mit dieser Email registriert.", { variant: "error" })
                break;
            case "auth/uid-already-exists":
                this.props.enqueueSnackbar("Es ist bereits ein Nutzer mit dieser ID registriert.", { variant: "error" })
                break;
            case "fundsmissing":
                this.props.enqueueSnackbar("Nicht genügend Geld verfügbar.", { variant: "error" })
                break;
            default:
                this.props.enqueueSnackbar('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut!', { variant: "error" });
                break;
        }
    }

    getGeoLocationPermission(callback) {
        var geoOptions = {
            maximumAge: 5 * 60 * 1000,
            timeout: 10 * 1000
        };

        if (!('Navigator' in window) || (window.navigator.geolocation === undefined)) {
            console.log('GeoLocation not supported in this browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(this.setGeoState, this.geoError, geoOptions);
        callback && callback()
    }

    geoError(error) {
        switch (error.code) {
            case error.TIMEOUT:
                break;
            default:
                break;
        }
    }

    setGeoState(position) {
        this.setState({ geolocationPermission: true, long: position.coords.longitude, lat: position.coords.latitude }, () => this.getMensaNearMe())
    }

    getMensaNearMe() {
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://openmensa.org/api/v2/canteens?near[lat]=' + this.state.lat + '&near[lng]=' + this.state.long + '&near[dist]=20',
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var obj = JSON.parse(body);
            // console.log("API called successfully. Data returned: ", obj)
            this.setState({ mensenNearMe: obj })
        }.bind(this));
    }

    setMensa(mensa, callback) {
        this.setState({ mensa: mensa }, () => callback)
    }

    render() {
        return (
            <MensaContext.Provider value={this.state}>{this.props.children}</MensaContext.Provider>
        );
    }
}

export default withFirebase(withAuthentication(withSnackbar(MensaProvider)));

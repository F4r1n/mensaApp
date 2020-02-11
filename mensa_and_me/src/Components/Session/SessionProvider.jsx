import React from 'react';
import { withFirebase } from '../Firebase';

export const AuthUserContext = React.createContext(null);

class SessionProvider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            authUser: null
        };
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    this.setState({ authUser })
                } else {
                    this.setState({ authUser: null });
                }
            }
        );
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        return (
            <AuthUserContext.Provider value={this.state}>
                {this.props.children}
            </AuthUserContext.Provider>
        );
    }
}

export default withFirebase(SessionProvider);
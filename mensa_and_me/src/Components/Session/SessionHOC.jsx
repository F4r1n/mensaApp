import React from 'react';

import { AuthUserContext } from './SessionProvider';

const withAuthentication = (WrappedComponent) => {
    class SessionHOC extends React.Component {

        constructor(props) {
            super(props);

            this.state = {};
        }        

        render() {
            return (
                <AuthUserContext.Consumer>
                    {context => <WrappedComponent {...context} {...this.props} />}
                </AuthUserContext.Consumer>
            );
        }
    }

    return SessionHOC;
};

export default withAuthentication;
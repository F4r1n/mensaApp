import React from 'react';

import { MensaContext } from './MensaProvider';

const withMensa = (WrappedComponent) => {
    /**
     * this is the withMensa HOC, it injects global objects into Component props
     */
    class HOC extends React.Component {

        constructor(props) {
            super(props);
            this.state = {}
        }

        render() {
            return (
                <MensaContext.Consumer>
                    {context => <WrappedComponent {...context} {...this.props}/>}
                </MensaContext.Consumer>
            );
        }
    }

    return HOC;
};

export default withMensa;

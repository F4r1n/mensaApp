import React from 'react';
import PropTypes from 'prop-types';

class Circle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0
        }
    }

    render() {
        var circleStyle = {
            padding: 1,
            margin: 2,
            backgroundColor: this.props.color,
            borderRadius: "50%",
            width: 20,
            height: 20,
        };

        return (
            <div style={circleStyle}/>
        );
    }
}

Circle.propTypes = {
    /**
     * style color
     */
    color: PropTypes.string.isRequired,
};


export default Circle
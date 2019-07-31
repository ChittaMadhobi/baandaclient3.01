import React, { Component } from 'react';

import ShowPersona from '../../../intelligence/components/persona/ShowPersona';

import './dashboard.css';

class dashboard extends Component {
    render() {
        return (
            <div>
                <ShowPersona />
            </div>
        );
    }
}

export default dashboard;
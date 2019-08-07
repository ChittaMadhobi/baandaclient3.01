import React, { Component } from 'react';

class Review extends Component {
    constructor(props){
        super(props);

        this.state = {
            name: ''
        }
    }


    render() {
        console.log('this.props:', this.props);
        return (
            <div>
                <h4>Review stuff here</h4>
            </div>
        );
    }
}

export default Review;
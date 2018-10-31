import React from 'react';
import BaseComponent  from '../BaseComponent';

class Test extends BaseComponent {
    constructor(props, options) {
        super(props);
        console.log(props);
        this.state = {}
    }
    render() {
        return (
            <div style={{padding:'50px'}}>
                <h1>Test page</h1>
            </div>
        );
    }
}

export default Test;

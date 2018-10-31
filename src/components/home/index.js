import './index.css';
import React from 'react';
import BaseComponent  from '../BaseComponent';

class Home extends BaseComponent {

    render() {
        return (
             <div style={{padding:'50px'}}>
                 <h1>Home page</h1>
             </div>
        );
    }
}

export default Home;

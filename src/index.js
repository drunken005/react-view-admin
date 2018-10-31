import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {renderRoutes} from './router';

ReactDOM.render(renderRoutes(), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

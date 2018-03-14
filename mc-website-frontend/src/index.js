import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import Reboot from 'material-ui/Reboot'

ReactDOM.render(
    <Reboot><App /></Reboot>,
    document.getElementById('root')
);
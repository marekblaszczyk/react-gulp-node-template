"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var routes = require('./routes');

var ReactRouter = require('react-router');

var Router = ReactRouter.Router;
var hashHistory = ReactRouter.hashHistory;


// https://github.com/reactjs/react-router-tutorial/blob/start/lessons/02-rendering-a-router.md
// https://github.com/reactjs/react-router/tree/master/examples

ReactDOM.render(
    <Router history={hashHistory}>
        {routes}
    </Router>,
     document.getElementById('app'));



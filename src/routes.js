"use strict";

var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var routes = (
        <Route path="/" component={require('./react_components/app')}>
            <IndexRoute component={require('./react_components/homePage')} />
            <Route name="about" path="about" component={require('./react_components/aboutPage')} />
        </Route>
);

module.exports = routes;

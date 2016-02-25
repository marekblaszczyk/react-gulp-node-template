"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var HomePage = require('./react_components/homePage');
var AboutPage = require('./react_components/aboutPage');

var App = React.createClass({
    render: function() {
        var Child;

        switch(this.props.route) {
            case 'about': Child = AboutPage; break;
            default: Child = HomePage;
        }

        return (
            <div>
                <Child />
            </div>
        );
    }
});

function render() {
    var route = window.location.hash.substr(1);
    console.log(route);
    ReactDOM.render(<App route={route} />, document.getElementById('app'));
}

window.addEventListener('hashchange', render);
render();
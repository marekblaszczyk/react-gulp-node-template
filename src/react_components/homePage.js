"use strict";

var React = require('react');

var HomePage = React.createClass({
    render: function() {
        return (
            <div className="jumbotron">
                <h1>Hello from React component!</h1>
            </div>
        );
    }
});

module.exports = HomePage;
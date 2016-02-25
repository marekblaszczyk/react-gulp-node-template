"use strict";

var React = require('react');
var ReactRouter = require('react-router');

var Link = ReactRouter.Link;
var IndexLink = ReactRouter.IndexLink;

var App = React.createClass({
    render: function() {
        return (
            <div className="container">
                <ul>
                    <li><IndexLink to="/">starting page</IndexLink></li>
                    <li><Link to="about">about</Link></li>
                 </ul>
                {this.props.children}
            </div>
        );
    }
});

module.exports = App;
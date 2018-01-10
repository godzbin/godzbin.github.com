import React, { Component } from 'react';
import '../resources/css/page1/Top.css';

class Top extends Component {
    render() {
        return (
            <header>
                <div className="main">
                    <div className="logo">{this.props.name}</div>
                </div>
            </header>
        )
    }
}
export default Top;
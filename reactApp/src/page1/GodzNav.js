import React, { Component } from 'react';
import '../resources/css/page1/GodzNav.css';

class GodzNav extends Component {
    constructor(props, content) {
        super(props);
        this.state = {
            list: props.list
        }
    }
    renderGroup(data, i) {
        return (
            <Group list={data.list} key={i} title={data.title} />
        )
    }
    renderNode(data, i) {
        return (
            <Node key={i} data={data} />
        )
    }
    renderList() {
        const list = this.state.list, components = [];
        for (var i = 0, l = list.length; i < l; i++) {
            if (list[i].type && list[i].type === "group") {
                components.push(this.renderGroup(list[i], i));
            } else {
                components.push(this.renderNode(list[i], i));
            }
        }
        return components;
    }
    render() {
        return (
            <div className="godz-nav">
                {this.renderList()}
            </div>
        )
    }
}

class Group extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list || []
        }
    }
    renderNode(data, i) {
        return (
            <Node name={data.name} key={i} link={data.link || "#"} />
        )
    }
    renderList() {
        const list = this.state.list, components = [];
        for (var i = 0, l = list.length; i < l; i++) {
            components.push(this.renderNode(list[i], i));
        }
        return components;
    }
    render() {
        return (
            <div className="godz-nav-group">
                <p className="nav-title">{this.props.title}</p>
                <ul>
                    {this.renderList()}
                </ul>
            </div>
        )
    }
}

class Node extends Component {
    render() {
        return (
            <li>
                <a href={this.props.link}>
                {this.props.name}
                </a>
            </li>
        )
    }
}
export default GodzNav;
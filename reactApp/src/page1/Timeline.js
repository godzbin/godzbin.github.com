import React, { Component } from 'react';
import '../resources/css/page1/Timeline.css';
class Spot extends Component {
    render() {
        return (
            <div className="spot">
                <div className="spot-left">
                    <div className="dots"></div>
                </div>
                <div className="time">{this.props.time}</div>
                <div className="spot-main">
                    <div className="title">{this.props.title}</div>
                    <div className="desc">{this.props.desc}</div>
                </div>

            </div>
        )
    }
}
class Timeline extends Component {
    getSpots() {
        var arr = [];
        for (var i = 0, l = this.props.list.length; i < l; i++) {
            arr.push(this.renderSpot(this.props.list[i], i));
        }
        return arr;
    }
    renderSpot(data, i) {
        data = Object.assign({ title: "", desc: "", time: "" }, data);
        console.log(data);
        return (
            <Spot key={i} title={data.title} desc={data.desc} time={data.time} />
        )
    }
    render() {
        return (
            <div className="godz-timeline">
                {this.getSpots()}
            </div>
        )
    }
}
export default Timeline;
import React, { Component } from 'react';
import logo from './logo.svg';
import Top from "./page1/Top";
import GodzNav from "./page1/GodzNav";
import Timeline from "./page1/Timeline";
import axios from "axios";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: "Godz的react学习项目",
      list: props.list || [],
      navList: [{ type: "group", title: "组件", list: [{ name: "时间轴", link: "./index" }] }, { type: "group", title: "推荐", list: [{ name: "我爱的音乐" }] }]
    }
  }
  componentDidMount() {
    axios.get("./json/test.json").then(res => {
      const list = res.data.list;
      this.setState({ list }, () => console.log(this.state));
    });
  }
  render() {
    console.log(this.state);
    return (
      <div className="App">
        <Top name={this.state.appName} />
        <div className="content">
          <div className="content-main">
            <div className="left-nav">
              <GodzNav list={this.state.navList} />
            </div>
            <div className="timeline-box">
              <Timeline list={this.state.list} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

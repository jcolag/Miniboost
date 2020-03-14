import React, { Component } from "react";
import {
  Window,
  App
} from "proton-native";
import Categories from './categories';

const path = require('path');
const homedir = require('os').homedir();
const boostdir = path.join(homedir, 'Boostnote');

export default class MainWindow extends Component {
  render() {
    return (
      <App>
        <Window style={{
          backgroundColor: "darkgray",
          height: '75%',
          width: '75%',
        }}>
          <Categories boostdir={boostdir} />
        </Window>
      </App>
    );
  }
}

import React, { Component } from "react";
import {
  App,
  TextInput,
  View,
  Window,
} from "proton-native";
import ChoicePanel from './choicepanel';

const path = require('path');
const homedir = require('os').homedir();
const boostdir = path.join(homedir, 'Boostnote');

export default class MainWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: null,
      text: '',
    };
  }

  render() {
    return (
      <App>
        <Window
          style={{
            backgroundColor: "black",
            height: '75%',
            width: '75%',
          }}
        >
          <View style={{
            alignItems: 'flex-start',
            flex: 1,
            flexDirection: 'row',
            height: '100%',
            justifyContent: 'flex-start',
            width: '100%',
          }}>
            <ChoicePanel
              boostdir={boostdir}
            />
            <TextInput
              multiline
              stretch={true}
              style={{
                backgroundColor: 'black',
                color: 'white',
                fontSize: '18pt',
                height: '100%',
                width: '85%',
              }}
              value={this.state.text}
            />
          </View>
        </Window>
      </App>
    );
  }
}

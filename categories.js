import React, { Component } from "react";
import {
  App,
  Button,
  Picker,
  Text,
  View
} from "proton-native";

const fs = require('fs');
const path = require('path');

export default class Categories extends Component {
  categories = [];
  catFiles = [];
  currCategory = {
    color: 'white',
    key: '',
    name: 'Unknown',
  };

  constructor(props) {
    super(props);
    let filename = path.join(props.boostdir, 'boostnote.json');
    let config = JSON.parse(fs.readFileSync(filename, 'utf-8'));
    this.categories = config.folders;
 }

  updateNoteList(key) {
    let cat = this.categories.filter(c => c.key === key)[0];
    this.currCategory = cat;
    console.log(cat);
  }

  render() {
    return (
      <View style={{
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'flex-start',
        width: '20%',
      }}>
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            textAlign: 'left',
          }}
        >
          Folders
        </Text>
        <Text
          style={{
            backgroundColor: 'white',
            color: 'white',
            fontSize: 2,
          }}
        >
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - -
        </Text>
        <Picker
          style={{ flex: 1 }}
          onValueChange={val => this.updateNoteList(val)}
        >
          { this.categories.map((cat, idx) => {
            return <Picker.Item
              key={ cat.key }
              label={ cat.name }
              value={ cat.key }
            />
          }) }
        </Picker>
        <Text
          style={{
            color: this.currCategory.color,
            fontSize: 24,
            textAlign: 'left',
          }}
        >
          { this.currCategory.name} Notes
        </Text>
      </View>
    );
  }
}

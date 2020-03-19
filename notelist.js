import React, { Component } from "react";
import {
  Picker,
  Text,
  View
} from "proton-native";

const fs = require('fs');
const path = require('path');

export default class NoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: props.category,
      notes: props.notes,
    };
  }

  render() {
    return (
      <View style={{
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'column',
        height: '40%',
        justifyContent: 'flex-start',
        width: '100%',
      }}>
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        >
          { this.props.category.name } Notes
        </Text>
        <Picker
          style={{
            backgroundColor: 'black',
            border: '1px solid white',
            color: 'white',
            flex: 1,
            fontSize: 18,
            width: '100%',
          }}
          onValueChange={val => this.props.update(val)}
        >
          { this.props.notes.map((note, idx) => {
            return <Picker.Item
              key={ note.key }
              label={ note.title }
              value={ note.key }
            />
          }) }
        </Picker>
      </View>
    );
  }
}

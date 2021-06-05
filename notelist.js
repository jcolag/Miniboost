import React, { Component } from "react";
import {decode} from "html-entities";
import {
  Picker,
  Text,
  View
} from "proton-native";

export default class NoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: props.category,
      config: props.config,
      notes: props.notes,
    };
  }

  render() {
    const notes = this.props.notes.sort(function (a, b) {
      if (a.isPinned && !b.isPinned) {
        return -1;
      }

      if (b.isPinned && !a.isPinned) {
        return 1;
      }

      if (a.isStarred && !b.isStarred) {
        return -1;
      }

      if (b.isStarred && !a.isStarred) {
        return 1;
      }

      var adate = new Date(a.updatedAt);
      var bdate = new Date(b.updatedAt);
      return bdate - adate;
    });
    return (
      <View style={{
        alignItems: 'flex-start',
        display: this.props.visible ? 'visible' : 'none',
        flex: 1,
        flexDirection: 'column',
        height: '40%',
        justifyContent: 'flex-start',
        width: '100%',
      }}>
        <Text
          style={{
            color: this.state.config.foregroundColor,
            fontSize: `${this.state.config.fontSize * 1.25}pt`,
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        >
          { this.props.category.name } Notes
        </Text>
        <Picker
          style={{
            backgroundColor: this.state.config.backgroundColor,
            border: '1px solid ' + this.state.config.foregroundColor,
            color: this.state.config.foregroundColor,
            flex: 1,
            fontSize: `${this.state.config.fontSize}pt`,
            width: '100%',
          }}
          onValueChange={val => this.props.update(val)}
        >
          { notes.map((note, idx) => {
            return <Picker.Item
              key={ note.key }
              label={ decode(note.title.replace(/\\/g, '')) }
              value={ note.key }
            />
          }) }
        </Picker>
      </View>
    );
  }
}

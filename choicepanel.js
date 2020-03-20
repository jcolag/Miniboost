import React, { Component } from "react";
import {
  Button,
  Text,
  View,
} from "proton-native";
import Categories from "./categories";
import NoteList from "./notelist";

const CSON = require('cson');
const fs = require('fs');
const path = require('path');

export default class ChoicePanel extends Component {
  constructor(props) {
    const filename = path.join(props.boostdir, 'boostnote.json');
    const config = JSON.parse(fs.readFileSync(filename, 'utf-8'));

    super(props);
    this.boundUpdateNoteList = this.updateNoteList.bind(this);
    this.boundUpdateNote = this.updateNote.bind(this);
    this.state = {
      boostdir: props.boostdir,
      categories: config.folders,
      catNotes: [],
      currCategory: {
        color: 'white',
        key: '',
        name: 'Unknown',
      },
    };
  }

  updateNoteList(key) {
    const cat = this.state.categories.filter(c => c.key === key)[0];
    const notePath = path.join(this.state.boostdir, 'notes');
    const allFiles = fs.readdirSync(notePath);
    const inCat = [];

    allFiles.forEach((filename) => {
      const file = fs.readFileSync(path.join(notePath, filename));
      const note = CSON.parse(file);

      if (note.folder === key) {
        note.key = filename;
        inCat.push(note);
      }
    });
    this.setState({
      catNotes: inCat,
      currCategory: cat,
    });
  }

  updateNote(key) {
    const note = this.state.catNotes.filter(c => c.key === key)[0];
    this.props.updateNoteText(note);
  }
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
        <Categories
          categories={ this.state.categories }
          update={ this.boundUpdateNoteList }
        />
        <NoteList
          category={ this.state.currCategory }
          notes={ this.state.catNotes }
          update={ this.boundUpdateNote }
        />
        <Button
          style={{
            backgroundColor: 'black',
            border: '1px solid white',
            fontWeight: 'bold',
            color: 'white',
            fontSize: '18pt',
            width: '100%',
          }}
          title="New Note"
        />
      </View>
    );
  }
}

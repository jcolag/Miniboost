import React, { Component } from "react";
import {
  Button,
  Text,
  View,
} from "proton-native";
import { v4 as uuidv4 } from "uuid";
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

  newNote() {
    const uuid = uuidv4();
    const cat = this.state.currCategory;
    const note = {
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString(),
      type: "MARKDOWN_NOTE",
      folder: cat.key,
      title: 'Untitled',
      content: '',
      tags: [],
      isStarred: false,
      isTrashed: false,
    };
    const filename = path.join(this.props.boostdir, 'notes', `${uuid}.cson`);

    fs.writeFileSync(filename, CSON.stringify(note, ' ', 2));
    this.updateNoteList(cat.key);
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
          onPress={this.newNote.bind(this)}
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

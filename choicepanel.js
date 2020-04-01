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
      config: props.config,
      currCategory: {
        color: 'white',
        key: '',
        name: 'Unknown',
      },
      key: null,
    };
  }

  updateNoteList(key) {
    const cat = this.state.categories.filter(c => c.key === key)[0];
    const notePath = path.join(this.state.boostdir, 'notes');
    const allFiles = fs.readdirSync(notePath);
    const inCat = [];

    allFiles.forEach((filename) => {
      const filepath = path.join(notePath, filename);
      const file = fs.readFileSync(filepath);
      const note = CSON.parse(file);

      note.stats = fs.statSync(filepath);
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
    this.setState({
      key: key,
    });
    this.props.updateNoteText(note);
  }

  reloadNote() {
    const oldNote = this.state.catNotes.filter(c => c.key === this.state.key)[0];
    const filename = path.join(this.state.boostdir, 'notes', this.state.key);
    const file = fs.readFileSync(filename);
    const stats = fs.statSync(filename);
    const newNote = CSON.parse(file);

    oldNote.content = newNote.content;
    oldNote.stats = stats;
    this.updateNote(this.state.key);
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
        width: '250px',
      }}>
        <Categories
          categories={ this.state.categories }
          config={ this.state.config }
          update={ this.boundUpdateNoteList }
        />
        <NoteList
          category={ this.state.currCategory }
          config={ this.state.config }
          notes={ this.state.catNotes }
          update={ this.boundUpdateNote }
        />
        <Button
          onPress={this.newNote.bind(this)}
          style={{
            backgroundColor: this.state.config.backgroundColor,
            border: '1px solid ' + this.state.config.foregroundColor,
            fontWeight: 'bold',
            color: this.state.config.foregroundColor,
            fontSize: '18pt',
            width: '100%',
          }}
          title="New Note"
        />
        <Button
          onPress={this.reloadNote.bind(this)}
          style={{
            backgroundColor: this.state.config.backgroundColor,
            border: '1px solid ' + this.state.config.foregroundColor,
            display: this.props.needReload ? 'visible' : 'none',
            fontWeight: 'bold',
            color: this.state.config.foregroundColor,
            fontSize: '18pt',
            width: '100%',
          }}
          title="Reload File"
        />
      </View>
    );
  }
}

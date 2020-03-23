import React, { Component } from "react";
import {
  App,
  TextInput,
  View,
  Window
} from "proton-native";
import ChoicePanel from './choicepanel';

const CSON = require('cson');
const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();
const boostdir = path.join(homedir, 'Boostnote');

export default class MainWindow extends Component {
  constructor(props) {
    let config = {
      backgroundColor: 'black',
      foregroundColor: 'white',
    };

    super(props);
    try {
      const configFile = path.join(homedir, '.config', 'Miniboost.json');
      const configJson = fs.readFileSync(configFile, 'utf-8');

      config = JSON.parse(configJson);
    } catch {
    }

    this.state = {
      config: config,
      note: null,
      text: '',
      timer: null,
      updateNoteText: this.updateNoteText.bind(this),
    };
  }

  updateNoteText(newNote) {
    this.setState({
      note: newNote,
      text: newNote.content,
    });
  }

  noteUpdated(text) {
    if (this.state.note === null || this.state.note.content === text) {
      return;
    }

    if (this.state.timer !== null) {
      clearTimeout(this.state.timer);
    }

    const firstLine = text.split('\n')[0];
    const firstOrig = this.state.note.content.split('\n')[0];

    if (firstLine !== firstOrig) {
      this.state.note.title = firstLine.replace(/^#*\s*/, '');
    }

    const timer = setTimeout(function() {
      this.saveNoteFile(this.state.note, text);
    }.bind(this), 500);
    this.setState({
      timer: timer,
    });
  }

  saveNoteFile(note, newText) {
    const outfile = path.join(boostdir, 'notes', note.key);

    note.content = newText;
    note.updatedAt = (new Date()).toISOString();

    const content = CSON.stringify(note, ' ', 2);

    fs.writeFileSync(outfile, content);
    clearTimeout(this.state.timer);
    this.setState({
      timer: null,
    });
  }

  render() {
    return (
      <App>
        <Window
          style={{
            backgroundColor: this.state.config.backgroundColor,
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
              config={this.state.config}
              updateNoteText={this.state.updateNoteText}
            />
            <TextInput
              multiline
              onChangeText={text => this.noteUpdated(text)}
              stretch={true}
              style={{
                backgroundColor: this.state.config.backgroundColor,
                border: '1px solid ' + this.state.config.foregroundColor,
                color: this.state.config.foregroundColor,
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

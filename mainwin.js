import React, { Component } from "react";
import {
  App,
  TextInput,
  View,
  Window
} from "proton-native";
import ChoicePanel from './choicepanel';

const CSON = require('cson');
const MarkdownIt = require('markdown-it');
const fs = require('fs');
const opn = require('opn');
const path = require('path');
const tmp = require('tmp');
const homedir = require('os').homedir();
const md = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: true,
  typographer: true,
});

export default class MainWindow extends Component {
  constructor(props) {
    let config = {
      backgroundColor: 'black',
      boostdir: path.join(homedir, 'Boostnote'),
      exportStyle: '',
      fontSize: 18,
      foregroundColor: 'white',
      interval: 250,
    };

    super(props);
    try {
      const configFile = path.join(homedir, '.config', 'Miniboost.json');
      const configJson = fs.readFileSync(configFile, 'utf-8');
      const userConfig = JSON.parse(configJson);

      Object.assign(config, userConfig);
    } catch {
    }

    this.boundDisplayNote = this.displayNote.bind(this);
    this.state = {
      config: config,
      interval: setInterval(this.checkLastFileTime, config.interval, this),
      needReload: false,
      note: null,
      text: '',
      timer: null,
      updateNoteText: this.updateNoteText.bind(this),
    };
  }

  checkLastFileTime(self) {
    if (self.state.config.interval < 0) {
      clearInterval(self.state.interval);
      return;
    }

    if (self.state.note === null || typeof self.state.note === 'undefined') {
      return;
    }

    const filename = path.join(
      self.state.config.boostdir,
      'notes',
      self.state.note.key
    );
    const stats = fs.statSync(filename);

    self.setState({
      needReload: stats.mtime > self.state.note.stats.mtime,
    });
  }

  updateNoteText(newNote) {
    this.setState({
      note: newNote,
      text: newNote.content,
    });
  }

  noteUpdated(text) {
    if (this.state.note === null
      || typeof this.state.note === 'undefined'
      || this.state.note.content === text
    ) {
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

  displayNote() {
    const html = md.render(this.state.note.content);
    const file = tmp.fileSync({
      mode: parseInt('0600', 8),
      prefix: 'Miniboost-',
      postfix: '.html',
    });
    let result = `<html><head><title>${this.state.note.title}</title>`
      + `<style>${this.state.config.exportStyle}</style></head>`
      + `<body>${html}</body></html>`;

    result = result.replace(
      /\/:storage\//g,
      `file:///${this.state.config.boostdir}/images/`
    );
    fs.writeFileSync(file.name, result);
    opn(file.name);
  }

  saveNoteFile(note, newText) {
    const outfile = path.join(this.state.config.boostdir, 'notes', note.key);

    note.content = newText;
    note.updatedAt = (new Date()).toISOString();

    const content = CSON.stringify(note, ' ', 2);

    fs.writeFileSync(outfile, content);
    clearTimeout(this.state.timer);
    clearInterval(this.state.interval);
    this.state.note.stats.mtime = new Date();
    this.setState({
      interval: setInterval(
        this.checkLastFileTime,
        this.state.config.interval,
        this
      ),
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
            width: this.state.note === null ? '10%' : '75%',
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
              boostdir={this.state.config.boostdir}
              config={this.state.config}
              displayNote={this.boundDisplayNote}
              needReload={this.state.needReload}
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
                display: this.state.note === null ? 'none' : 'visible',
                fontSize: `${this.state.config.fontSize}pt`,
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

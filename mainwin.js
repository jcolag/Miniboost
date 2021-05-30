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
      autoRefresh: false,
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
      autoPreview: false,
      autoTimer: null,
      config: config,
      interval: setInterval(this.checkLastFileTime, config.interval, this),
      key: null,
      needReload: false,
      note: null,
      text: '',
      tempFiles: {},
      timer: null,
      toggleAutoPreview: this.toggleAutoPreview.bind(this),
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

  updateNoteText(newNote, key) {
    const tempFiles = this.state.tempFiles;
    if (this.state.autoTimer !== null) {
      clearInterval(this.state.autoTimer);
    }
    if (!Object.prototype.hasOwnProperty.call(tempFiles, key)) {
      tempFiles[key] = tmp.tmpNameSync();
    }
    this.setState({
      autoPreview: false,
      autoTimer: null,
      key: key,
      note: newNote,
      tempFiles: tempFiles,
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

  displayNote(inBrowser = true) {
    const filename = this.state.tempFiles[this.state.key];
    const html = md
      .render(
        this
          .state.note.content
          .replace(
            /(#[0-9A-Fa-f]{6})\b/g,
            '$1 <span class="chip" style="background-color: $1"></span>'
          )
      )
      .replace(
        /\n\s*<li>\s*\[\s*\] /g,
        '\n<li class="unchecked"> '
      )
      .replace(
        /\n\s*<li>\s*\[[^\s]*\] /g,
        '\n<li class="checked"> '
      );
    let result = `<html><head><title>${this.state.note.title}</title>`;
    if (this.state.config.autoRefresh === true) {
      result += '<meta http-equiv="refresh" content="5">';
    }
    result += '<style>'
      + ' ul { } '
      + ' ul .checked:before { list-style: none; content: "✅ "; }'
      + ' ul .unchecked:before { list-style: none; content: "🔳 "; }'
      + ' span.chip { border: 1px solid black; border-radius: 0.25em; '
      + 'display: inline-block; height: 1em; width: 1em; }'
      + `${this.state.config.exportStyle}`
      + '</style></head>'
      + `<body>${html}</body></html>`;

    result = result.replace(
      /\/:storage\//g,
      `file:///${this.state.config.boostdir}/images/`
    );
    fs.writeFileSync(filename, result);
    if (inBrowser) {
      opn(filename);
    }
  }

  toggleAutoPreview() {
    const auto = this.state.autoPreview;
    let timer = null;

    if (auto) {
      clearInterval(this.state.autoTimer);
    } else {
      timer = setInterval(function() {
        this.displayNote(false);
      }.bind(this), 500);
    }

    this.setState({
      autoPreview: !auto,
      autoTimer: timer,
    });
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
              autoPreview={this.state.autoPreview}
              boostdir={this.state.config.boostdir}
              config={this.state.config}
              displayNote={this.boundDisplayNote}
              needReload={this.state.needReload}
              toggleAutoPreview={this.state.toggleAutoPreview}
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

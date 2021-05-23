import React, { Component } from "react";
import {
  Button,
  Text,
  TextInput,
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
    this.boundAddCategory = this.addCategory.bind(this);
    this.boundCategoryName = this.changeCategoryName.bind(this);
    this.state = {
      autopreview: false,
      boostdir: props.boostdir,
      categories: config.folders,
      catNotes: [],
      config: props.config,
      currCategory: {
        color: 'white',
        key: '',
        name: 'Unknown',
      },
      errorCategory: false,
      key: null,
      nameCategory: '',
      newCategory: false,
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
      key: null,
    });
  }

  updateNote(key) {
    const note = this.state.catNotes.filter(c => c.key === key)[0];
    this.setState({
      key: key,
    });
    this.props.updateNoteText(note, key);
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

  changeCategoryName(name) {
    const cats = this.state.categories.map(c => c.name);
    let error = false;

    if (cats.indexOf(name) >= 0) {
      error = true;
    }

    this.setState({
      errorCategory: error,
      nameCategory: name,
    });
  }

  addCategory() {
    const adding = this.state.newCategory;

    if (adding) {
      const boostname = path.join(this.props.boostdir, 'boostnote.json');
      const boost = JSON.parse(fs.readFileSync(boostname, 'utf-8'));
      const uuid = uuidv4();
      const newCategory = {
        key: uuid.replace(/-/g, '').slice(0,20),
        color: this.state.config.foregroundColor,
        name: this.state.nameCategory,
      };
      const categories = this.state.categories;

      this.setState({
        categories: null,
      });
      categories.push(newCategory);
      boost.folders.push(newCategory);
      fs.writeFileSync(boostname, JSON.stringify(boost, ' ', 2));
      this.setState({
        categories: categories,
      });
    }

    this.setState({
      errorCategory: false,
      nameCategory: '',
      newCategory: !adding,
    });
  }

  render() {
    const categoryNameField = this.state.newCategory ?
      <TextInput
        onChangeText={text => this.boundCategoryName(text)}
        style={{
          backgroundColor: this.state.errorCategory
            ? 'darkred'
            : this.state.config.backgroundColor,
          border: '1px solid ' + this.state.config.foregroundColor,
          color: this.state.errorCategory
            ? 'white'
            : this.state.config.foregroundColor,
          fontSize: `${this.state.config.fontSize}pt`,
          height: '40px',
          width: '250px',
        }}
      /> :
      null;
    const newNoteButton = this.state.currCategory.key === '' ?
      null :
      <Button
        onPress={this.newNote.bind(this)}
        style={{
          backgroundColor: this.state.config.backgroundColor,
          border: '1px solid ' + this.state.config.foregroundColor,
          fontWeight: 'bold',
          color: this.state.config.foregroundColor,
          fontSize: `${this.state.config.fontSize * 1.2}pt`,
          width: '100%',
        }}
        title="New Note ➕"
      />;
    const reloadButton = this.props.needReload ?
      <Button
        onPress={this.reloadNote.bind(this)}
        style={{
          backgroundColor: this.state.config.backgroundColor,
          border: '1px solid ' + this.state.config.foregroundColor,
          fontWeight: 'bold',
          color: this.state.config.foregroundColor,
          fontSize: `${this.state.config.fontSize * 1.2}pt`,
          width: '100%',
        }}
        title="Reload File 🔃"
      /> :
      null;
    const auto = `Auto-Preview ${this.props.autoPreview ? "✅" : "❌"}`;
    const viewButton = this.state.key === null ?
      null :
      <Button
        onPress={this.props.displayNote}
        style={{
          backgroundColor: this.state.config.backgroundColor,
          border: '1px solid ' + this.state.config.foregroundColor,
          fontWeight: 'bold',
          color: this.state.config.foregroundColor,
          fontSize: `${this.state.config.fontSize * 1.2}pt`,
          width: '100%',
        }}
        title="View in Browser 🌐"
      />;
    const autoButton = (
      this.state.key === null || this.props.config.autoPreview
    ) ?
      null :
      <Button
        onPress={this.props.toggleAutoPreview}
        style={{
          backgroundColor: this.state.config.backgroundColor,
          border: '1px solid ' + this.state.config.foregroundColor,
          fontWeight: 'bold',
          color: this.state.config.foregroundColor,
          fontSize: `${this.state.config.fontSize * 1.2}pt`,
          width: '100%',
        }}
        title={auto}
      />;

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
        <View style={{
          alignItems: 'flex-start',
          flex: 1,
          flexDirection: 'row',
          height: '45px',
          justifyContent: 'flex-start',
          maxHeight: '40px',
          width: '100%',
        }}>
          {categoryNameField}
          <Button
            onPress={this.boundAddCategory}
            style={{
              backgroundColor: this.state.config.backgroundColor,
              border: '1px solid ' + this.state.config.foregroundColor,
              display: 'visible',
              fontWeight: 'bold',
              color: this.state.config.foregroundColor,
              fontSize: `${this.state.config.fontSize}pt`,
              height: '40px',
              width: this.state.newCategory ? '40px' : '100%',
            }}
            title={ this.state.newCategory ? '➕' : 'New Category ➕' }
          />
        </View>
        <NoteList
          category={ this.state.currCategory }
          config={ this.state.config }
          notes={ this.state.catNotes }
          update={ this.boundUpdateNote }
          visible={ this.state.currCategory.key !== '' }
        />
        {viewButton}
        {autoButton}
        {newNoteButton}
        {reloadButton}
      </View>
    );
  }
}

import React, { Component } from "react";
import {
  Picker,
  Text,
  View
} from "proton-native";

export default class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories.sort(function (a, b) {
        var aname = a.name.toUpperCase();
        var bname = b.name.toUpperCase();
        if (aname < bname) {
          return -1;
        }
        if (aname > bname) {
          return 1;
        }
        return 0;
      }),
      config: props.config,
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
            color: this.state.config.foregroundColor,
            fontSize: `${this.state.config.fontSize * 1.25}pt`,
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        >
          Folders
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
          { this.state.categories.map((cat, idx) => {
            return <Picker.Item
              key={ cat.key }
              label={ cat.name }
              value={ cat.key }
            />
          }) }
        </Picker>
      </View>
    );
  }
}

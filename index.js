import React from "react";
import { AppRegistry } from "proton-native";
import MainWindow from "./mainwin";

AppRegistry.registerComponent("example", <MainWindow />);

// ================================================================================
// This is for hot reloading (this will be stripped off in production by webpack)
// THIS SHOULD NOT BE CHANGED
if (module.hot) {
  module.hot.accept(["./mainwin"], function() {
    const app = require("./mainwin")["default"];
    AppRegistry.updateProxy(app);
  });
}

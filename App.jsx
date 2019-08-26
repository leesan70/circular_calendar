import React from 'react';
import { YellowBox } from 'react-native';
import AppContainer from "./src/navigators";

// Temporary ignore due to dependencies using componentWillReceiveProps, componentWillUpdate, ViewPagerAndroid
YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps',
  'Warning: componentWillUpdate',
  'Warning: ViewPagerAndroid',
]);

export default function App() {
  return <AppContainer />;
}

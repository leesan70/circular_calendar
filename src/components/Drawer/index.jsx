import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { Switch, Text, View } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-navigation';

export default class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideFreeItems: false,
    };
    this.onHideFreeItemsToggle = this.onHideFreeItemsToggle.bind(this);
  }

  async componentDidMount() {
    const hideFreeItems = await AsyncStorage.getItem("hideFreeItems") === "true";
    this.setState({ hideFreeItems });
  }

  async onHideFreeItemsToggle() {
    const { hideFreeItems } = this.state;
    await AsyncStorage.setItem("hideFreeItems", !hideFreeItems === true ? "true" : "false");
    this.setState({ hideFreeItems: !hideFreeItems });
  }

  render() {
    const { hideFreeItems } = this.state;
    return (
      <ScrollView>
        <SafeAreaView style={{ flex: 1, marginTop: 10, marginLeft: 20 }} forceInset={{ top: 'always', horizontal: 'never' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ alignSelf: "center" }}>Hide Free Items</Text>
            <Switch
              style={{ marginLeft: 80 }}
              trackColor={{ true: "#694fad" }}
              thumbColor="#9467bd"
              value={hideFreeItems}
              onChange={this.onHideFreeItemsToggle}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
};
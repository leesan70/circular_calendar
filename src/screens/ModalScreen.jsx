import moment from 'moment';
import React, { Component, Fragment } from 'react';
import { View, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Header, Input, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-navigation';

export default class ModalScreen extends Component {
  constructor(props) {
    super(props);
    const dataDate = this.props.navigation.getParam("dataDate").clone();
    this.state = {
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false,
      startDate: dataDate,
      endDate: dataDate.clone().add(30, "minutes"),
      title: '',
      content: '',
    };
  }

  componentWillUnmount() {
    const addTodo = this.props.navigation.getParam("addTodo");
    const { title = "Untitled", content, startDate, endDate } = this.state;
    const dataDate = startDate.clone().startOf("day");
    if (title !== "Untitled" || content) {
      const todo = { startDate, endDate, title, content, done: false };
      addTodo(todo, dataDate)
        .then(this.props.navigation.navigate('Schedule', { dataDate }));
    }
  }

  showStartDateTimePicker = () => {
    this.setState({ isStartDateTimePickerVisible: true });
  };

  hideStartDateTimePicker = () => {
    this.setState({ isStartDateTimePickerVisible: false });
  };

  showEndDateTimePicker = () => {
    this.setState({ isEndDateTimePickerVisible: true });
  };

  hideEndDateTimePicker = () => {
    this.setState({ isEndDateTimePickerVisible: false });
  };

  handleStartDateTimePicked = date => {
    const startDate = moment(date);
    this.setState({ startDate: startDate });
    this.handleEndDateTimePicked(startDate.clone().add(30, "minutes"));
    this.hideStartDateTimePicker();
  };

  handleEndDateTimePicked = date => {
    this.setState({ endDate: moment(date) });
    this.hideEndDateTimePicker();
  };

  handleTitleChange = title => {
    this.setState({ title });
  }

  handleContentChange = content => {
    this.setState({ content });
  }

  render() {
    const numberOfLines = 32;
    const { startDate, endDate } = this.state;
    return (
      <Fragment>
        <Header
          leftComponent={
            <Icon
              name="arrow-left"
              size={25}
              color="#3e2465"
              resizeMode="contain"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          backgroundColor='white'
          containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
        />
        <SafeAreaView
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#fff',
            alignItems: 'center',
          }}
        >
          <DateTimePicker
            isVisible={this.state.isStartDateTimePickerVisible}
            onConfirm={this.handleStartDateTimePicked}
            onCancel={this.hideStartDateTimePicker}
            date={startDate.toDate()}
            mode="datetime"
          />
          <DateTimePicker
            isVisible={this.state.isEndDateTimePickerVisible}
            onConfirm={this.handleEndDateTimePicked}
            onCancel={this.hideEndDateTimePicker}
            date={endDate.toDate()}
            minimumDate={startDate.toDate()}
            mode="datetime"
          />
          <KeyboardAvoidingView
            style={{
              flex: 1,
              width: "100%",
            }}
            behavior="padding"
            enabled={Platform.OS === "ios"}
            keyboardVerticalOffset={100}
          >
            <Button
              title={"From : " + startDate.format("LLL")}
              type="clear"
              onPress={this.showStartDateTimePicker}
              containerStyle={{ alignItems: "flex-start" }}
              titleStyle={{ color: "#694fad" }}
              icon={
                <Icon
                  name="calendar-clock"
                  size={20}
                  color="#3e2465"
                  resizeMode="contain"
                />
              }
            />
            <Button
              title={"To     : " + endDate.format("LLL")}
              type="clear"
              onPress={this.showEndDateTimePicker}
              containerStyle={{ alignItems: "flex-start" }}
              titleStyle={{ color: "#694fad" }}
              icon={
                <Icon
                  name="calendar-clock"
                  size={20}
                  color="#3e2465"
                  resizeMode="contain"
                />
              }
            />
            <Input
              onChangeText={this.handleTitleChange}
              inputContainerStyle={{ borderBottomWidth: 0, marginBottom: 10 }}
              inputStyle={{ fontSize: 25 }}
              placeholder="Title"
              placeholderTextColor="#694fad"
              selectionColor="#3e2465"
            />
            <SafeAreaView style={{ flex : 1 }}>
              <ScrollView>
                <Input
                  onChangeText={this.handleContentChange}
                  inputContainerStyle={{ 
                    borderBottomWidth: 0
                  }}
                  inputStyle={{
                    minHeight: (Platform.OS === "ios" && numberOfLines) ? (20 * numberOfLines) : null,
                  }}
                  placeholder="Content"
                  multiline={true}
                  numberOfLines={Platform.OS === "ios" ? null : numberOfLines}
                  selectionColor="#3e2465"
                  placeholderTextColor="#694fad"
                  textAlignVertical="top"
                  scrollEnabled={false}
                  autoFocus={true}
                />
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

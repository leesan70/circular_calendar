import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Button, Header, Input } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-navigation';
import { isSameTodo } from '../services/todo';

export default class ModalScreen extends Component {
  constructor(props) {
    super(props);
    const dataDate = this.props.navigation.getParam("dataDate").clone();
    const isEditMode = this.props.navigation.getParam("isEditMode");
    const existingTodo = this.props.navigation.getParam("existingTodo");
    this.state = {
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false,
      startDate: isEditMode ? existingTodo.startDate : dataDate,
      endDate: isEditMode ? existingTodo.endDate : dataDate.clone().add(30, "minutes"),
      title: isEditMode ? existingTodo.title : undefined,
      content: isEditMode ? existingTodo.content : undefined,
    };
  }

  componentWillUnmount() {
    const addTodo = this.props.navigation.getParam("addTodo");
    const editTodo = this.props.navigation.getParam("editTodo");
    const isEditMode = this.props.navigation.getParam("isEditMode");
    const existingTodo = this.props.navigation.getParam("existingTodo");
    const { title = "Untitled", content = "", startDate, endDate } = this.state;
    const dataDate = startDate.clone().startOf("day");
    if (title === "Untitled" && content === "") {
      return;
    }
    const newTodo = { startDate, endDate, title, content };
    if (isEditMode) {
      // Do not attempt editing if nothing has changed.
      if (isSameTodo(existingTodo, newTodo)) return;
      editTodo(existingTodo, newTodo)
        .then(this.props.navigation.navigate('Schedule', { dataDate }));
    } else {
      addTodo(newTodo)
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
    const { startDate, endDate, title, content } = this.state;
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
              value={title}
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
                  value={content}
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

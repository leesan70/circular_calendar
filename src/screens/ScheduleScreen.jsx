import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, { Component, Fragment } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-navigation';
import Pie from '../components/Pie';
import PieController from '../components/PieController';
import TodoList from '../components/TodoList';
import { deserializeData, serializeData } from '../services/serialize';
import { checkTodoAddable } from '../services/todo';
import Theme from '../theme';

const height = 220;

export default class ScheduleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: [],
      selectedIndex: -1,
      dataDate: null,
      displayDate: moment(),
      is12HrMode: false,
      showAM: true,
    };
    this.onPieItemPress = this.onPieItemPress.bind(this);
    this.onPieItemLongPress = this.onPieItemLongPress.bind(this);
    this.onBackgroundPress = this.onBackgroundPress.bind(this);
    this.onHrModePress = this.onHrModePress.bind(this);
    this.onAMPMPress = this.onAMPMPress.bind(this);
    this.prepareDisplayData = this.prepareDisplayData.bind(this);
    this.tick = this.tick.bind(this);

    this.addTodo = this.addTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.getData = this.getData.bind(this);
    this.setData = this.setData.bind(this);
    this.onFocus = this.onFocus.bind(this);
    
    AsyncStorage.clear();
  }

  async addTodo(todo) {
    if (!await checkTodoAddable(todo)) {
      alert("New todo overlaps with an existing one!");
      return;
    }
    try {
      const { startDate, endDate } = todo;
      const date = startDate.clone();
      while (date.isSameOrBefore(endDate)) {
        const dateString = date.startOf('day').format('YYYY-MM-DD');
        const prevSerializedData = await AsyncStorage.getItem(dateString) || '[]';
        const prevDeserializedData = deserializeData(prevSerializedData);
        const newData = prevDeserializedData.slice();
        newData.push(todo);
        await AsyncStorage.setItem(dateString, serializeData(newData));
        date.add(1, 'day');
      } 
      // Sync state with AsyncStorage
      this.getData();
    } catch (e) {
      // Error setting data
      console.log(e.message);
    }
    

    // try {
    //   this.getData().then(async () => {
        // const { data: prevData } = this.state;
        // const newData = prevData.slice();
        // newData.push(todo);
        // const dataDateString = dataDate.format('YYYY-MM-DD');
        // const serializedData = serializeData(newData);
    //     await AsyncStorage.setItem(dataDateString, serializedData);
    //     // Sync state with AsyncStorage
    //     this.getData();
    //   });
    // } catch (e) {
    //   // Error setting data
    //   console.log(e.message);
    // }
  }

  async editTodo() {
    return;
  }

  async deleteTodo() {
    return;
  }

  async setData(data, dataDate) {
    try {
      const dataDateString = dataDate.format('YYYY-MM-DD');
      const serializedData = serializeData(data);
      await AsyncStorage.setItem(dataDateString, serializedData);
      // Sync state with AsyncStorage
      this.getData();
    } catch (e) {
      // Error setting data
      console.log(e.message);
    }
  }

  async getData() {
    try {
      const { dataDate } = this.state;
      const dataDateString = dataDate.format('YYYY-MM-DD');
      const data = await AsyncStorage.getItem(dataDateString) || '[]';
      const deserializedData = deserializeData(data);
      this.setState({
        isLoaded: true,
        data: deserializedData,
      })
    } catch(e) {
      // Error getting data
      console.log(e.message);
    }
  }

  onFocus() {
    const { dataDate } = this.state;
    const propDataDate = this.props.navigation.getParam('dataDate');
    if (!dataDate || propDataDate && !dataDate.isSame(propDataDate, 'day')) {
      this.setState({
        selectedIndex: -1,
        dataDate: propDataDate,
        isLoaded: false,
      }, this.getData);
    }
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', this.onFocus);
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
    // onFocus gets called as the screen loads
  }

  componentWillUnmount() {
    this.focusListener.remove();
    clearInterval(this.intervalID);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { displayDate, ...rest } = this.state;
    const { displayDate:nextDisplayDate, ...nextRest } = nextState;
    // Re-render only when there's difference in minutes in displayDates or when any other state changes.
    return nextDisplayDate.minute() !== displayDate.minute() ||
      rest.dataDate && nextRest.dataDate && !rest.dataDate.isSame(nextRest.dataDate, 'day') ||
      rest.isLoaded != nextRest.isLoaded ||
      rest.data != nextRest.data ||
      rest.selectedIndex !== nextRest.selectedIndex ||
      rest.is12HrMode !== nextRest.is12HrMode ||
      rest.showAM !== nextRest.showAM;
  }

  tick() {
    this.setState({
      displayDate: moment(),
    });
  }

  onPieItemPress(index) {
    this.setState({
      selectedIndex: index,
    });
  }

  onPieItemLongPress(index) {
    this.onPieItemPress(index);
  }

  onBackgroundPress() {
    this.setState({
      selectedIndex: -1,
    });
  }

  onHrModePress(hrModeIndex) {
    const is12HrMode = hrModeIndex === 0;
    const { selectedIndex:prevSelectedIndex } = this.state;
    const selectedIndex = is12HrMode ? -1 : prevSelectedIndex;
    this.setState({
      is12HrMode,
      selectedIndex,
    });
  }

  onAMPMPress(AMPMIndex) {
    const showAM = AMPMIndex === 0;
    this.setState({
      showAM,
      selectedIndex: -1,
    });
  }

  prepareDisplayData() {
    const storage = AsyncStorage;
    const { data, dataDate } = this.state;
    // For the initial render
    if (!dataDate) {
      return null;
    }
    const displayData = [];
    const startOfDay = dataDate.clone().startOf('day');
    const endOfDay = dataDate.clone().endOf('day');
    // Empty data means free time all day
    if (!data || !data.length) {
      return [{
        startDate: startOfDay,
        endDate: endOfDay,
      }];
    }
    let lastFreeTimeStart = startOfDay.clone();
    for (let i = 0; i < data.length; i += 1) {
      // Add free time before this todo, if
      // 1) this todo started after startOfDay
      // 2) the previous todo didn't end at this todo's startDate
      if (data[i].startDate.isAfter(startOfDay) && lastFreeTimeStart.isBefore(data[i].startDate)) {
        displayData.push({
          startDate: lastFreeTimeStart,
          endDate: data[i].startDate,
        });
      }
      // Add this todo
      displayData.push(data[i]);
      lastFreeTimeStart = data[i].endDate;
    }
    // Add free time ending at the endOfDay, if appropriate.
    if (lastFreeTimeStart.isBefore(endOfDay)) {
      displayData.push({
        startDate: lastFreeTimeStart,
        endDate: endOfDay,
      });
    }
    return displayData;
  }

  render() {
    const background = 'white';
    const { width } = Dimensions.get('window');
    const {
      isLoaded,
      selectedIndex,
      is12HrMode,
      showAM,
      dataDate,
      displayDate,
    } = this.state;
    const { navigation } = this.props;
    const displayData = this.prepareDisplayData();
    const dateString = dataDate ? dataDate.format('MMM Do YYYY') : '';

    return (
      <Fragment>
        {
          !isLoaded &&
            <View style={styles.loading_button}>
              <ActivityIndicator size='large' color='#694fad'/>
            </View>
        }
        {
          isLoaded &&
          <Fragment>
            <Header
              leftComponent={{
                icon: 'menu',
                onPress: () => alert('Implement Side Drawer!')
              }}
              centerComponent={{
                text: dateString,
                style: { fontWeight: 'bold' }
              }}
              // rightComponent={{
              //   icon: 'home',
              //   onPress: () => this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
              // }}
              backgroundColor='white'
              containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
            />
            <SafeAreaView style={{flex: 1}}>
              <ScrollView 
                style={[styles.container, { backgroundColor: background }]}
                contentContainerStyle={styles.content}
                // ref="scrollView"
              >
                <View style={styles.container}>
                  <PieController
                    is12HrMode={is12HrMode}
                    showAM={showAM}
                    onHrModePress={this.onHrModePress}
                    onAMPMPress={this.onAMPMPress}
                  />
                  <Pie
                    pieWidth={150}
                    pieHeight={150}
                    onPieItemPress={this.onPieItemPress}
                    onPieItemLongPress={this.onPieItemPress}
                    onBackgroundPress={this.onBackgroundPress}
                    colors={Theme.colors}
                    width={width}
                    height={height}
                    displayData={displayData}
                    selectedIndex={selectedIndex}
                    is12HrMode={is12HrMode}
                    showAM={showAM}
                    dataDate={dataDate}
                    displayDate={displayDate}
                  />
                  <TodoList
                    selectedIndex={selectedIndex}
                    displayData={displayData}
                    deleteTodo={this.deleteTodo}
                    editTodo={this.editTodo}
                  />
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.floating_button}>
                <Icon
                  name="plus-circle"
                  size={70}
                  color="#694fad"
                  resizeMode="contain"
                  onPress={() => navigation.navigate('MyModal', {
                    addTodo: this.addTodo,
                    dataDate: this.state.dataDate,
                  })}
                />
              </TouchableOpacity>
            </SafeAreaView>
          </Fragment>
        }
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading_button: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 4,
  },
  card: {
    margin: 4,
  },
  floating_button: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 10,
  },
});

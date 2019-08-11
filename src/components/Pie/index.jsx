// Reference: https://medium.com/the-react-native-log/animated-charts-in-react-native-using-d3-and-art-21cd9ccf6c58
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Svg,
  G,
  Path,
  Line,
  Text,
} from 'react-native-svg';
import PropTypes from 'prop-types';

import * as shape from 'd3-shape';
import { pointRadial } from 'd3';
import moment from 'moment';

import { getHandleAngle, getAnglesFromTodo, } from '../../services/angle';
import Theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  label: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: 'normal',
  },
  pie: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

const selectedAdditionalWidth = 10;

function getColor(index) {
  return Theme.colors[index];
}

function getKey(todoItem) {
  return todoItem.startDate.unix();
}

export default class Pie extends Component {
  constructor() {
    super();
    this.createPiePieceFromIndex = this.createPiePieceFromIndex.bind(this);
    this.createPiePieceFromAngles = this.createPiePieceFromAngles.bind(this);
    this.getPointsAroundClock = this.getPointsAroundClock.bind(this);
    this.getDisplayHour = this.getDisplayHour.bind(this);
  }

  getArc(additionalWidth=0) {
    const { pieWidth } = this.props;
    return shape.arc()
      .outerRadius(pieWidth / 2 + additionalWidth)
      .padAngle(0.05)
      .innerRadius(30);
  }

  getPointsAroundClock() {
    const { is12HrMode, pieWidth } = this.props;
    const totalNumPoints = is12HrMode ? 12 : 24;
    const constantMultiplier = is12HrMode ? 1/6 : 1/12;
    const margin = 25;
    return [...Array(totalNumPoints).keys()].
      map(n => n * constantMultiplier * Math.PI).
      map(angle => pointRadial(angle, pieWidth / 2 + margin)).
      map(point => [point[0], point[1] + selectedAdditionalWidth / 2]);
  }

  getDisplayHour(hour) {
    const { is12HrMode } = this.props;
    if (is12HrMode) {
      return hour == 0 ? 12 : hour;
    }
    return hour % 6 === 0 ? hour : "."
  }

  createPiePieceFromIndex(index) {
    const {
      displayData,
      selectedIndex,
      is12HrMode,
      showAM,
      date,
    } = this.props;
    const angles = getAnglesFromTodo(displayData[index], is12HrMode, showAM, date);
    if (angles === null) {
      return null;
    }
    const isSelected = selectedIndex === index;
    return this.createPiePieceFromAngles(angles.startAngle, angles.endAngle, isSelected);
  }

  createPiePieceFromAngles(startAngle, endAngle, isSelected) {
    if (startAngle === null || endAngle === null) {
      return null;
    }
    const angles = { startAngle, endAngle };
    const additionalWidth = isSelected ? selectedAdditionalWidth : 0;
    return this.getArc(additionalWidth)(angles);
  }

  render() {
    const {
      date,
      is12HrMode,
      showAM,
      width,
      height,
      pieWidth,
      displayData,
      onPieItemPress,
      onPieItemLongPress,
      onBackgroundPress,
    } = this.props;
    const x = width / 2;
    const y = height / 2;
    const pie = displayData.map((item, index) => {
      const piePiece = this.createPiePieceFromIndex(index);
      const color = getColor(index);
      return piePiece === null ? null : (
        <Path
          key={getKey(item)}
          d={piePiece}
          stroke={color}
          fill={color}
          onPress={() => onPieItemPress(index)}
          onLongPress={() => onPieItemLongPress(index)}
        />
      );
    }).filter(item => item !== null);
    const rotation = getHandleAngle(date, is12HrMode, showAM);

    return (
      <TouchableWithoutFeedback onPress={onBackgroundPress}>
        <View width={width} style={styles.pie}>
          <Svg width={width} height={height}>
            <G translateX={x} translateY={y}>
              {pie}
            </G>
            <Line 
              x1={x}
              y1={y}
              x2={x}
              y2={y - pieWidth / 3}
              originX={x}
              originY={y}
              stroke="red"
              strokeWidth="2"
              rotation={rotation}
            />
            <G>
              {
                this.getPointsAroundClock().map((point, index) => {
                  return (
                    <Text
                      key={index}
                      x={x + point[0]}
                      y={y + point[1]}
                      textAnchor="middle"
                    >
                      {this.getDisplayHour(index)}
                    </Text>
                  );
                })
              }
            </G>
          </Svg>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const pieData = PropTypes.shape({
  startDate: PropTypes.instanceOf(moment).isRequired,
  endDate: PropTypes.instanceOf(moment).isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  done: PropTypes.bool,
});

Pie.propTypes = {
  displayData: PropTypes.arrayOf(pieData),
  pieWidth: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  onPieItemPress: PropTypes.func.isRequired,
  onPieItemLongPress: PropTypes.func.isRequired,
  onBackgroundPress: PropTypes.func.isRequired,
  is12HrMode: PropTypes.bool.isRequired,
  showAM: PropTypes.bool.isRequired,
  date: PropTypes.instanceOf(moment).isRequired,
};

Pie.defaultProps = {
  displayData: [],
};

// Reference: https://medium.com/the-react-native-log/animated-charts-in-react-native-using-d3-and-art-21cd9ccf6c58
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ART,
  LayoutAnimation,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Svg,
  G,
  Path,
} from 'react-native-svg';
import PropTypes from 'prop-types';

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import moment from 'moment';
import { isValidAngles, getAnglesFromDates, getAnglesFromTodo } from '../../services/angle';
import Theme from '../../theme';

const d3 = { scale, shape };

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

function getColor(index) {
  return Theme.colors[index];
}

export default class Pie extends Component {
  createPiePieceFromIndex(index) {
    const {
      displayData,
      highlightedIndex,
      is12HrMode,
      showAM,
      date,
    } = this.props;
    const angles = getAnglesFromTodo(displayData[index], is12HrMode, showAM, date);
    if (angles === null) {
      return null;
    }
    const shouldHighlight = highlightedIndex === index;
    return this.createPiePieceFromAngles(angles.startAngle, angles.endAngle, shouldHighlight);
  }

  createPiePieceFromAngles(startAngle, endAngle, shouldHighlight) {
    const { pieWidth } = this.props;
    if (startAngle === null || endAngle === null) {
      return null;
    }
    const angles = { startAngle, endAngle };
    const highlightedArc = d3.shape.arc()
      .outerRadius(pieWidth / 2 + 10)
      .padAngle(0.05)
      .innerRadius(30);
    const unselectedArc = d3.shape.arc()
      .outerRadius(pieWidth / 2)
      .padAngle(0.05)
      .innerRadius(30);
    return shouldHighlight ? highlightedArc(angles) : unselectedArc(angles);
  }

  render() {
    const {
      width,
      height,
      pieWidth,
      displayData,
      onPieItemPress,
      onPieItemLongPress,
      onBackgroundPress,
    } = this.props;
    // const margin = styles.container.margin;
    const x = width / 2;
    const y = height / 2;
    const pie = displayData.map((item, index) => {
      const piePiece = this.createPiePieceFromIndex(index);
      const color = getColor(index);
      return piePiece === null ? null : (
        <Path
          d={piePiece}
          stroke={color}
          fill={color}
          onPress={() => onPieItemPress(index)}
          onLongPress={() => onPieItemLongPress(index)}
        />
      );
    }).filter(item => item !== null);

    return (
      <TouchableWithoutFeedback onPress={onBackgroundPress}>
        <View width={width} height={height} style={styles.pie}>
          <Svg width={width} height={height}>
            <G translateX={x} translateY={y}>
              {pie}
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
  content: PropTypes.string.isRequired,
  done: PropTypes.bool.isRequired,
});

Pie.propTypes = {
  displayData: PropTypes.arrayOf(pieData),
  pieWidth: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  highlightedIndex: PropTypes.number.isRequired,
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

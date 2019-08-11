import React, { Fragment } from 'react';
import { ButtonGroup } from 'react-native-elements';

export default function PieController({ is12HrMode, showAM, onHrModePress, onAMPMPress }) {
  const hrModeButtons = ["12 Hr", "24 Hr"];
  const AMPMButtons = ["AM", "PM"];
  return (
    <Fragment>
      <ButtonGroup
        buttons={hrModeButtons}
        selectedIndex={is12HrMode ? 0 : 1}
        onPress={onHrModePress}
        selectedButtonStyle={{ backgroundColor: '#694fad'}}
      />
      {
        is12HrMode &&
          <ButtonGroup
            buttons={AMPMButtons}
            selectedIndex={showAM ? 0 : 1}
            onPress={onAMPMPress}
            selectedButtonStyle={{ backgroundColor: '#694fad'}}
          />
      }
    </Fragment>
  );
}
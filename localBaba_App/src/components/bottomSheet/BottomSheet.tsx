import React, {ComponentType} from 'react';
import {ScrollView, Dimensions, ViewStyle} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import Theme from '../../theme/Theme';
const {height} = Dimensions.get('window');

interface Props {
  descriptionSheet: any;
  showDrag?: boolean;
  sheetHeight?: number;
  Children?: ComponentType;
}

const BottomSheet = (props: Props) => {
  const {
    descriptionSheet = '',
    showDrag = true,
    sheetHeight = 0,
    Children = () => <></>,
  } = props;
  return (
    <RBSheet
      ref={descriptionSheet}
      openDuration={600}
      draggable={showDrag ? true : false}
      // dragOnContent
      customStyles={{
        container: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
      }}
      height={
        sheetHeight !== 0 ? sheetHeight : height - Theme.responsiveSize.size110
      }>
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <Children />
      </ScrollView>
    </RBSheet>
  );
};

export default BottomSheet;

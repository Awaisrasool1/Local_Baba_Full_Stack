import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Theme from '../../theme/Theme';

const {width} = Dimensions.get('window');

const CustomTabNavigator = ({tabs, initialTab = 0}: any) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;

  const handleTabPress = (index: any) => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(index);
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });

    Animated.spring(slideAnimation, {
      toValue: index * (width / tabs.length),
      tension: 68,
      friction: 12,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs?.map((tab: any, index: any) => (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.slider,
            {
              width: width / tabs.length,
              transform: [{translateX: slideAnimation}],
            },
          ]}
        />
      </View>

      <Animated.View
        style={[styles.contentContainer, {opacity: fadeAnimation}]}>
        {tabs[activeTab].content}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: Theme.responsiveSize.size1,
  },
  tabBar: {
    flexDirection: 'row',
    height: Theme.responsiveSize.size50,
    backgroundColor: Theme.colors.white,
    position: 'relative',
  },
  tab: {
    flex: Theme.responsiveSize.size1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: Theme.responsiveSize.size12,
    color: Theme.colors.black,
    fontWeight: '500',
  },
  activeTabText: {
    color: Theme.colors.appColor,
    fontWeight: '600',
  },
  slider: {
    position: 'absolute',
    bottom: 0,
    height: Theme.responsiveSize.size2,
    backgroundColor: Theme.colors.appColor,
  },
  contentContainer: {
    flex: 1,
  },
});

export default CustomTabNavigator;

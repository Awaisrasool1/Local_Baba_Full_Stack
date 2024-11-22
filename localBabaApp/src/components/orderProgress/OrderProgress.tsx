import React, {useEffect} from 'react';
import {View, Text, Animated, StyleSheet, Image} from 'react-native';
import Theme from '../../theme/Theme';
import styles from './styles';

const OrderProgress = ({currentStep = 0, steps = []}: any) => {
  const circleAnims = steps.map(
    () => React.useRef(new Animated.Value(0)).current,
  );
  const lineAnims = steps.map(
    () => React.useRef(new Animated.Value(0)).current,
  );
  const textAnims = steps.map(
    () => React.useRef(new Animated.Value(0)).current,
  );

  if (currentStep > 3) {
    currentStep = 3;
  }

  useEffect(() => {
    const animations = [];

    for (let i = 0; i <= currentStep; i++) {
      animations.push(
        Animated.timing(circleAnims[i], {
          toValue: 1,
          duration: 500,
          delay: i * 300,
          useNativeDriver: true,
        }),
      );
      animations.push(
        Animated.timing(textAnims[i], {
          toValue: 1,
          duration: 500,
          delay: i * 300,
          useNativeDriver: true,
        }),
      );
      if (i < steps.length - 1) {
        animations.push(
          Animated.timing(lineAnims[i], {
            toValue: 1,
            duration: 400,
            delay: i * 300 + 200,
            useNativeDriver: true,
          }),
        );
      }
    }

    Animated.parallel(animations).start();
  }, [currentStep]);

  const renderStep = (step: any, index: any) => {
    const isCompleted = index <= currentStep;
    const isActive = index === currentStep;
    const isLast = index === steps.length - 1;

    const circleScale = circleAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });

    return (
      <View key={index} style={styles.stepContainer}>
        <View style={styles.contentRow}>
          <Animated.View
            style={[
              styles.circle,
              {
                backgroundColor: isCompleted
                  ? Theme.colors.appColor
                  : '#E0E0E0',
                transform: [{scale: circleScale}],
              },
            ]}>
            {isCompleted ? (
              <Image source={Theme.icons.tick} style={styles.icon} />
            ) : (
              <View
                style={[
                  styles.dot,
                  {backgroundColor: !isActive ? '#9E9E9E' : ''},
                ]}
              />
            )}
          </Animated.View>

          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textAnims[index],
                transform: [
                  {
                    translateX: textAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text
              style={[
                styles.title,
                isActive && styles.activeTitle,
                isCompleted && styles.completedTitle,
              ]}>
              {step.title}
            </Text>
            <Text style={styles.description}>{step.description}</Text>
          </Animated.View>
        </View>

        {!isLast && (
          <Animated.View
            style={[
              styles.line,
              {
                backgroundColor: isCompleted
                  ? Theme.colors.appColor
                  : Theme.colors.disabled,
                transform: [
                  {
                    scaleY: lineAnims[index],
                  },
                ],
                opacity: lineAnims[index],
              },
            ]}
          />
        )}
      </View>
    );
  };

  return <View style={styles.container}>{steps.map(renderStep)}</View>;
};

export default OrderProgress;

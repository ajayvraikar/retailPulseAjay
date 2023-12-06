import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';

const CustomLoader = ({loadingText}) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#3498db" />
    {loadingText && <Text style={styles.loadingText}>{loadingText}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('screen').height - 100,
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3498db',
  },
});

export default CustomLoader;

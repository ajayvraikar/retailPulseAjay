import { Animated, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_LOGO } from "../Assets/Images";

const SplashScreen = (props) => {
  const [scaleValue] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: 1, // Final scale value is 1 (100%)
      duration: 700, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for performance
    }).start(); // Start the animation
  }, [scaleValue]);
  useEffect(() => {
    setTimeout(async () => {
      const jsonValue = await AsyncStorage.getItem("loginUser");
      let loginUser = jsonValue != null ? JSON.parse(jsonValue) : null;

      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: loginUser === null ? "LoginScreen" : "StoreListing",
            },
          ],
        })
      );
    }, 1000);
  }, []);
  return (
    <Animated.View
      style={[styles.mainView, { transform: [{ scale: scaleValue }] }]}
    >
      <Animated.View
        style={{
          width: 100,
          height: 100,
          //   borderWidth: 1,
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#2faff5",
          transform: [{ scale: scaleValue }],
        }}
      >
        <Animated.Image
          source={APP_LOGO}
          style={{
            width: 120,
            height: 120,
            transform: [{ scale: scaleValue }],
          }}
        />
      </Animated.View>

      <Text style={styles.text}>Retail Pulse</Text>
    </Animated.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    color: "#2faff5",
    fontWeight: "700",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

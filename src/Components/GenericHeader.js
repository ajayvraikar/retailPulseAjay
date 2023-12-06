import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BACK_ARROW, LOGOUT} from '../Assets/Images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';

const GenericHeader = ({title, navigation, hideBackBtn = false}) => {
  const [loginUserData, setLoginUserData] = useState(null);
  async function getLoginUserData() {
    const jsonValue = await AsyncStorage.getItem('loginUser');
    let loginUser = jsonValue != null ? JSON.parse(jsonValue) : null;
    setLoginUserData(loginUser);
  }
  useEffect(() => {
    getLoginUserData();
  }, []);
  function onlogOut() {
    Alert.alert('Confirm Logout', 'Do you want to logout', [
      {text: 'cancel'},
      {
        text: 'Ok',
        onPress: () => {
          AsyncStorage.removeItem('loginUser');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'LoginScreen',
                },
              ],
            }),
          );
        },
      },
    ]);
  }
  return (
    <View style={styles.headerMainView}>
      {hideBackBtn ? null : (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image style={styles.backImage} source={BACK_ARROW} />
        </TouchableOpacity>
      )}

      <Text style={{fontSize: 16, fontWeight: '600', color: 'white'}}>
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => {
          onlogOut();
        }}
        style={{position: 'absolute', right: 16, flexDirection: 'row'}}>
        <Text style={styles.logout}> Hi {loginUserData?.name}</Text>
        <Image
          source={LOGOUT}
          style={{height: 20, width: 20, tintColor: 'white'}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default GenericHeader;

const styles = StyleSheet.create({
  logout: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    textTransform: 'capitalize',
    marginRight: 6,
  },
  backImage: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
    marginRight: 16,
    tintColor: 'white',
  },
  headerMainView: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    paddingVertical: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: '#2faff5',
  },
});

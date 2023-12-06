import {StyleSheet, Text, ToastAndroid, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import GenericInput from '../Components/GenericInput';
import GenericButton from '../Components/GenericButton';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = props => {
  const [loginFields, setLoginFields] = useState({
    userName: '',
    password: '',
  });
  const [loginFieldsErrors, setLoginFieldsErrors] = useState({
    userName: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [usersData, setUsersData] = useState([]);
  async function getUsers() {
    const snapshot = await database().ref('users').once('value');
    const items = snapshot.val();
    setUsersData(
      Object.keys(items).map(item => {
        return {password: items[item]?.password, name: items[item]?.name};
      }),
    );
  }
  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    setError('');
  }, [loginFields]);
  async function onPressLogin() {
    let userNameError = '';
    let passwordError = '';
    let isValid = true;
    if (loginFields.userName === '') {
      userNameError = 'Please Enter Username';
      isValid = false;
    }
    if (loginFields.password === '') {
      passwordError = 'Please Enter Password';
      isValid = false;
    }
    setLoginFieldsErrors({
      userName: userNameError,
      password: passwordError,
    });

    if (isValid) {
      let userData_ = usersData?.find(
        item => item?.name === loginFields.userName,
      );
      if (userData_) {
        if (userData_?.password === loginFields.password) {
          await AsyncStorage.setItem('loginUser', JSON.stringify(userData_));
          ToastAndroid.showWithGravity(
            'Login Successfully',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          props.navigation.navigate('StoreListing');
        } else {
          setError('Invalid Password');
        }
      } else {
        setError('User Not Found');
      }
    }
  }
  return (
    <View>
      <Text style={styles.screenTitle}>Welcome to Retail Pulse </Text>
      <GenericInput
        value={loginFields.userName}
        onChangeText={value => {
          setLoginFields({...loginFields, userName: value});
        }}
        title="User Name"
        placeholder="Enter user name"
      />
      {loginFields?.userName === '' && loginFieldsErrors.userName && (
        <Text style={styles.fieldError}>{loginFieldsErrors.userName}</Text>
      )}

      <GenericInput
        value={loginFields.password}
        onChangeText={value => {
          setLoginFields({...loginFields, password: value});
        }}
        title="Password"
        placeholder="Enter Password"
      />
      {loginFields?.password === '' && loginFieldsErrors.password && (
        <Text style={styles.fieldError}>{loginFieldsErrors.password}</Text>
      )}
      {error ? <Text style={styles.errorTxt}>{error}</Text> : null}
      <GenericButton title="Login" onPress={onPressLogin} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 18,
    color: '#2faff5',
    fontWeight: '700',
    marginTop: 100,
    marginBottom: 40,
    alignSelf: 'center',
  },
  errorTxt: {
    fontSize: 12,
    color: 'red',
    width: '80%',
    alignSelf: 'center',
  },
  fieldError: {
    fontSize: 12,
    color: 'red',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 12,
    marginTop: -6,
  },
});

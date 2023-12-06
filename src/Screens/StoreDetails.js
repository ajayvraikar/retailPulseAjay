import {
  Dimensions,
  Image,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GenericButton from '../Components/GenericButton';
import PreviewModal from '../Components/PreviewModal';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import GenericHeader from '../Components/GenericHeader';
import CustomLoader from '../Components/CustomLoader';

const StoreDetails = props => {
  var ImagePicker = require('react-native-image-picker');
  const {id, name} = props.route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [imagesAlreadyUploaded, setImagesAlreadyUploaded] = useState([]);
  async function getUploadedImages() {
    const snapshot = await database()
      .ref('storeImages')
      .orderByChild('storeId')
      .equalTo(id)
      .once('value');
    const items = snapshot.val();

    const imageNames = Object.keys(items || {}).map(
      item_ => items[item_]?.imageName,
    );
    const urls = await Promise.all(
      imageNames.map(async imageName => {
        const reference = storage().ref(`${imageName}`);
        return await reference.getDownloadURL();
      }),
    );
    setIsLoading(false);
    setImagesAlreadyUploaded(urls);
  }

  useEffect(() => {
    getUploadedImages();
  }, []);

  const openGalary = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      selectionLimit: 2,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('response', response);
        setImageUri(response.assets[0].uri);
        setShowPreview(true);
      }
    });
  };
  const uploadImage = async uri => {
    try {
      setShowPreview(false);
      ToastAndroid.showWithGravity(
        'Uploading',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      let imageName = new Date().getTime() + id + 'storeImage.jpg';
      const reference = storage().ref(`${imageName}`);

      try {
        await reference.putFile(uri, {contentType: 'image/jpeg'});
        console.log('Image uploaded successfully!');
        await database().ref('storeImages').push({
          storeId: id,
          imageName: imageName,
        });
        getUploadedImages();
        ToastAndroid.showWithGravity(
          'Image uploaded successfully!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      } catch (error) {
        ToastAndroid.showWithGravity(
          'Error uploading image:',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        console.error('Error uploading image: ', error);
      }
    } catch (e) {
      console.log('rrro', e);
    }
  };
  const openCamera = async () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchCamera(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            console.log('response', response);
            setImageUri(response.assets[0].uri);
            setShowPreview(true);
          }
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <GenericHeader navigation={props.navigation} title={name} />
      {isLoading ? <CustomLoader /> : null}
      <ScrollView style={{flex: 1}}>
        {isLoading ? null : imagesAlreadyUploaded?.length ? (
          <Text style={styles.uploadedImages}>Uploaded Images</Text>
        ) : (
          <Text style={styles.uploadedImages}>No Images Found</Text>
        )}

        <View style={styles.mainView}>
          {imagesAlreadyUploaded?.map((item, index) => {
            console.log('item', item);
            return (
              <View key={index} style={styles.imageAlreadyU}>
                <Image source={{uri: item}} style={styles.image} />
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.btnView}>
        <GenericButton
          onPress={() => {
            openGalary();
          }}
          title="OPEN GALLARY"
          customeBtnStyle={styles.openBtn}
        />
        <GenericButton
          onPress={() => {
            openCamera();
          }}
          title="OPEN CAMERA"
          customeBtnStyle={styles.openBtn}
        />
      </View>
      {showPreview && (
        <PreviewModal
          onUploadImage={() => {
            uploadImage(imageUri);
          }}
          imageUriToPreview={imageUri}
          modalVisible={showPreview}
          closeModal={() => setShowPreview(!showPreview)}
        />
      )}
    </SafeAreaView>
  );
};

export default StoreDetails;

const styles = StyleSheet.create({
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    paddingTop: 0,
    justifyContent: 'space-around',
    borderTopWidth: 0.6,
  },
  openBtn: {width: '45%', marginTop: 12},
  uploadedImages: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
    width: '100%',
  },
  image: {height: '100%', resizeMode: 'cover', width: '100%'},
  imageAlreadyU: {
    height: 200,
    borderWidth: 0.6,
    width: Dimensions.get('screen').width * 0.42,
    margin: 12,
    padding: 12,
    borderRadius: 12,
  },
  mainView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import GenericButton from './GenericButton';

const PreviewModal = ({
  modalVisible,
  closeModal,
  imageUriToPreview,
  onUploadImage,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        closeModal();
      }}>
      <View style={styles.mainView}>
        <TouchableOpacity onPress={closeModal} style={styles.outerClose} />
        <View style={styles.innerView}>
          <Text style={styles.previewTxt}>Image Preview</Text>
          <View style={styles.previewView}>
            <Image
              source={{
                uri: imageUriToPreview,
              }}
              style={styles.previeeImage}
            />
          </View>
          <GenericButton
            onPress={onUploadImage}
            title="Upload"
            customeBtnStyle={{marginBottom: 12}}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PreviewModal;

const styles = StyleSheet.create({
  innerView: {
    width: '80%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 12,
  },
  previewView: {
    borderWidth: 1,
    height: 300,
    width: '80%',
    margin: 12,
    borderRadius: 12,
  },
  previeeImage: {
    height: '100%',
    width: '100%',
    borderRadius: 12,
  },
  outerClose: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  previewTxt: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  mainView: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

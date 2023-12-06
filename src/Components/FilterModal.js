import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GenericButton from './GenericButton';
import {BACK_ARROW, CHECKBOX} from '../Assets/Images';

const FilterModal = ({
  modalVisible,
  closeModal,
  filterData = [],
  onPressFilter = () => {},
  onApply = () => {},
}) => {
  const [rightState, setRightState] = useState({selectedName: '', values: []});
  useEffect(() => {
    if (filterData.length) {
      let dFilData = filterData[0];
      if (rightState.selectedName) {
        dFilData = filterData?.find(
          item => item?.name === rightState.selectedName,
        );
      }
      setRightState(
        filterData?.length
          ? {selectedName: dFilData?.name, values: dFilData?.values}
          : {selectedName: '', values: []},
      );
    } else {
      setRightState({selectedName: '', values: []});
    }
  }, [filterData]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        closeModal();
      }}>
      <View style={styles.modalMainView}>
        <TouchableOpacity onPress={closeModal} style={styles.outerClose} />
        <View style={styles.innerView}>
          <View style={styles.mainView}>
            <TouchableOpacity onPress={closeModal}>
              <Image style={{height: 30, width: 30}} source={BACK_ARROW} />
            </TouchableOpacity>
            <Text style={styles.filterByTxtx}>Filter By</Text>
          </View>
          <View style={styles.filterMainView}>
            <View style={{flex: 1, marginRight: 12}}>
              {filterData?.map((item, index) => {
                let anySelected = item?.values?.find(
                  item_ => item_?.isSelected === true,
                );
                let color =
                  rightState.selectedName === item?.name ? '#2faff5' : 'black';
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setRightState({
                        selectedName: item?.name,
                        values: item?.values,
                      });
                    }}
                    key={index}
                    style={styles.keyValueBtn}>
                    <Text style={[styles.keyValueTxt, {color}]}>
                      {item?.name}
                    </Text>
                    {anySelected && <View style={styles.selectedAny} />}
                  </TouchableOpacity>
                );
              })}
            </View>
            <View
              style={{flex: 1.5, borderLeftWidth: 0.5, borderColor: '#D3D3D3'}}>
              {rightState?.values?.map((item, index) => {
                let tintColor = item?.isSelected
                  ? '#2faff5'
                  : 'rgba(0,0,0,0.6)';
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onPressFilter(rightState.selectedName, item?.name);
                    }}
                    key={index}
                    style={styles.valueBtn}>
                    <Image
                      style={{
                        ...styles.checkBox,
                        tintColor,
                      }}
                      source={CHECKBOX}
                    />
                    <Text style={styles.valueTxt}>{item?.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.bottomView}>
            <GenericButton
              onPress={closeModal}
              title="Close"
              isFilled={false}
              customeBtnStyle={styles.closeBtn}
              customTxtStyle={{color: 'red'}}
            />
            <GenericButton
              onPress={onApply}
              title="Apply"
              customeBtnStyle={styles.applyBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  outerClose: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  closeBtn: {
    width: '45%',
    borderColor: 'white',
    marginTop: 12,
  },
  applyBtn: {width: '45%', marginTop: 12},
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.6,
    borderColor: '#D3D3D3',
    paddingTop: -12,
  },
  checkBox: {
    height: 20,
    width: 20,
  },
  valueTxt: {
    textTransform: 'capitalize',
    marginLeft: 12,
    color: 'black',
    fontSize: 14,
  },
  valueBtn: {
    padding: 12,
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    borderColor: '#D3D3D3',
  },
  selectedAny: {
    height: 5,
    width: 5,
    borderRadius: 12,
    backgroundColor: '#2faff5',
  },
  keyValueBtn: {
    padding: 12,
    borderBottomWidth: 0.6,
    borderColor: '#D3D3D3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  keyValueTxt: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  filterByTxtx: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    marginLeft: 16,
  },
  modalMainView: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  innerView: {
    height: '70%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterMainView: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 0.6,
    borderColor: '#D3D3D3',
  },
});

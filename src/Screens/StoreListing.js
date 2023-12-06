import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import GenericHeader from '../Components/GenericHeader';
import {CANCEL, FILTER} from '../Assets/Images';
import FilterModal from '../Components/FilterModal';
import CustomLoader from '../Components/CustomLoader';

const StoreListing = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [storeData, setStoreData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [pagenumber, setPagenumber] = useState(1);
  const [filterData, setFilterData] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    if (searchValue) {
      let searchResults = storeData?.filter(item => {
        return item?.name?.toLowerCase()?.includes(searchValue?.toLowerCase());
      });
      setDisplayData(searchResults);
    } else {
      setDisplayData(storeData.slice(0, 20));
    }
  }, [searchValue]);

  const paginate = (items, page = 1, perPage = 20) => {
    const offset = perPage * (page - 1);
    const totalPages = Math.ceil(items.length / perPage);
    const paginatedItems = items?.slice(offset, perPage * page);
    return {
      previousPage: page - 1 ? page - 1 : null,
      nextPage: totalPages > page ? page + 1 : null,
      total: items.length,
      totalPages: totalPages,
      items: paginatedItems,
    };
  };
  async function getStoreData() {
    const snapshot = await database().ref('stores').once('value');
    const items = snapshot.val();

    let storeData = Object.keys(items).map(item_ => {
      return {...items[item_], id: item_};
    });
    setMasterData(storeData);
    setStoreData(storeData);
    setIsLoading(false);
    const uniqueFieldValues = {};
    storeData?.forEach(store => {
      Object.keys(store).forEach(field => {
        if (['type', 'route', 'area'].includes(field)) {
          if (!uniqueFieldValues[field]) {
            uniqueFieldValues[field] = new Set();
          }
          uniqueFieldValues[field].add(store[field]);
        }
      });
    });
    let mainFilterData = [];
    for (const data of Object.keys(uniqueFieldValues)) {
      let singleObj = {
        name: data,
        values: [],
      };
      for (const value of uniqueFieldValues[data]) {
        singleObj.values.push({
          name: value,
          isSelected: false,
        });
      }
      mainFilterData.push(singleObj);
    }
    setFilterData(mainFilterData);
  }
  useEffect(() => {
    getStoreData();
  }, []);

  useEffect(() => {
    let pagiData = paginate(storeData);
    setDisplayData([...pagiData.items]);
    setPagenumber(pagiData.nextPage);
  }, [storeData]);

  function filterDisplayData(filterFields) {
    setSearchValue('');
    let selectedFilters = {};
    filterFields?.forEach(element => {
      let selectedFilter = element?.values?.filter(item => item?.isSelected);

      if (selectedFilter?.length) {
        selectedFilters[element?.name] = selectedFilter?.map(
          item => item?.name,
        );
      }
    });
    setSelectedFilter(selectedFilters);
    let filteredStores;
    if (Object.keys(selectedFilters).length) {
      filteredStores = masterData.filter(store => {
        return Object.entries(selectedFilters).every(([key, values]) => {
          return store[key] && values?.includes(store[key]);
        });
      });
    } else {
      filteredStores = masterData;
    }
    setStoreData(filteredStores);
    setShowFilterModal(false);
  }
  function getAppliedFilters(obj) {
    let filters = [];
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const element = obj[key];

        let newArray = element.map(item => {
          return {name: key, value: item};
        });
        filters = [...filters, ...newArray];
      }
    }
    return filters;
  }
  function onPressFilter(name, value, update = false) {
    let filterDataNew = filterData?.map(item => {
      if (item?.name === name) {
        return {
          name: item?.name,
          values: item?.values?.map(item_ => {
            if (item_?.name === value) {
              return {...item_, isSelected: !item_?.isSelected};
            } else {
              return item_;
            }
          }),
        };
      }
      return item;
    });
    setFilterData(filterDataNew);
    if (update) {
      filterDisplayData(filterDataNew);
    }
  }
  function onPressClearAll() {
    let filterDataNew = filterData?.map(item => {
      return {
        name: item?.name,
        values: item?.values?.map(item_ => {
          return {...item_, isSelected: false};
        }),
      };
    });
    setFilterData(filterDataNew);
    filterDisplayData([]);
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <GenericHeader
        title={'Store List'}
        hideBackBtn={true}
        navigation={props.navigation}
      />
      {isLoading ? <CustomLoader /> : null}

      <View style={{flexDirection: 'row', marginVertical: 12}}>
        <TextInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="search store name here..."
          style={styles.searchBox}
        />
        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          style={styles.filterIconBtn}>
          <Image style={styles.filterIcon} source={FILTER} />
          <Text style={styles.filterTxtNew}>Filter</Text>
        </TouchableOpacity>
      </View>
      {getAppliedFilters(selectedFilter)?.length ? (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.mainView}>
          {getAppliedFilters(selectedFilter)?.length ? (
            <TouchableOpacity
              onPress={onPressClearAll}
              style={styles.clearAllBtn}>
              <Text style={styles.filterTxt}>Clear All</Text>
              <Image style={styles.cancelImage} source={CANCEL} />
            </TouchableOpacity>
          ) : null}
          {getAppliedFilters(selectedFilter)?.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => onPressFilter(item?.name, item?.value, true)}
                key={index}
                style={styles.filterBtn}>
                <Text style={styles.filterTxt}>{item?.value}</Text>
                <Image style={styles.cancelImage} source={CANCEL} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}
      <FlatList
        data={displayData}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('StoreDetails', item);
              }}
              style={styles.cardView}>
              <Text style={styles.label}>
                Store Name : <Text style={styles.value}>{item?.name}</Text>{' '}
              </Text>
              <Text style={[styles.label, {marginTop: 8}]} numberOfLines={1}>
                Address : <Text style={styles.address}>{item?.address}</Text>{' '}
              </Text>
              <View style={styles.bottomTxtView}>
                <Text style={styles.label}>
                  Route :{' '}
                  <Text style={[styles.value, {textTransform: 'capitalize'}]}>
                    {item?.route}
                  </Text>
                </Text>
                <Text style={styles.label}>
                  Area : <Text style={styles.value}>{item?.area}</Text>{' '}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        onEndReached={() => {
          if (pagenumber !== null) {
            let pagiData = paginate(storeData, pagenumber);
            setDisplayData([...displayData, ...pagiData.items]);
            setPagenumber(pagiData.nextPage);
          }
        }}
      />
      <FilterModal
        filterData={filterData}
        modalVisible={showFilterModal}
        closeModal={() => {
          setShowFilterModal(false);
        }}
        onApply={() => {
          filterDisplayData(filterData);
        }}
        onPressFilter={(name, value) => {
          onPressFilter(name, value);
        }}
      />
    </SafeAreaView>
  );
};

export default StoreListing;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: 'gray',
    fontWeight: '400',
  },
  searchBox: {
    borderWidth: 0.6,
    borderRadius: 12,
    paddingHorizontal: 16,
    width: '80%',
    marginHorizontal: 16,
  },
  filterIconBtn: {alignItems: 'center', justifyContent: 'center'},
  mainView: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    height: 50,
  },
  filterIcon: {height: 25, width: 25, tintColor: '#2faff5'},
  clearAllBtn: {
    borderWidth: 0.6,
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 12,
    padding: 6,
    height: 35,
    marginRight: 12,
  },
  filterTxtNew: {color: '#2faff5', fontSize: 12},
  cancelImage: {
    height: 20,
    width: 20,
    tintColor: 'black',
    marginLeft: 12,
  },
  filterTxt: {
    color: 'black',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  filterBtn: {
    borderWidth: 0.6,
    padding: 6,
    height: 35,
    marginRight: 12,
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  bottomTxtView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardView: {
    padding: 12,
    margin: 16,
    marginVertical: 8,
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: 'gray',
  },
  value: {
    fontSize: 15,
    color: 'black',
    fontWeight: '600',
  },
  address: {
    fontSize: 15,
    color: 'black',
    fontWeight: '400',
  },
});

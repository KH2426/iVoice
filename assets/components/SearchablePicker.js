// components/SearchablePicker.js
import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput,
  FlatList, TouchableOpacity, StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchablePicker = ({
  items,            // array of string codes, e.g. ['eng','fra',…]
  labelMapping,     // { eng: '🇬🇧 English', … }
  selectedValue,
  onValueChange,
  placeholder = 'Search…',
}) => {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = items.filter(code => {
    const label = labelMapping[code] || code;
    return label.toLowerCase().includes(query.toLowerCase());
  });

  const select = code => {
    onValueChange(code);
    setShow(false);
    setQuery('');
  };

  return (
    <>
      <TouchableOpacity style={s.button} onPress={() => setShow(true)}>
        <Text style={s.buttonText}>
          { labelMapping[selectedValue] || selectedValue }
        </Text>
        <Icon name="chevron-down" size={20} />
      </TouchableOpacity>

      <Modal visible={show} animationType="slide">
        <View style={s.modal}>
          <TextInput
            style={s.search}
            placeholder={placeholder}
            value={query}
            onChangeText={setQuery}
          />

          <FlatList
            data={filtered}
            keyExtractor={c => c}
            renderItem={({item: code}) => (
              <TouchableOpacity
                style={s.item}
                onPress={() => select(code)}
              >
                <Text>{ labelMapping[code] || code }</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={s.close} onPress={()=>setShow(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const s = StyleSheet.create({
  button: {
    flexDirection:'row', alignItems:'center',
    borderWidth:1, borderColor:'#ccc', padding:8, borderRadius:4
  },
  buttonText: { flex:1 },
  modal: { flex:1, padding:16, backgroundColor:'#fff' },
  search: {
    borderWidth:1, borderColor:'#ccc', borderRadius:4,
    padding:8, marginBottom:12
  },
  item: {
    paddingVertical:12, borderBottomWidth:1, borderBottomColor:'#eee'
  },
  close: { padding:12, alignItems:'center' }
});

export default SearchablePicker;
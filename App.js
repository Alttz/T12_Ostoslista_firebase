import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, TouchableOpacity } from 'react-native';

import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTHDOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECTID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.EXPO_PUBLIC_APPID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {

  const [product, setProduct] = useState({
    name: '',
    amount: ''
  });
  const [items, setItems] = useState([]);

  const saveItem = () => {
    push(ref(database, 'items/'), product);
  };

  const removeItem = (itemId) => {
    const itemRef = ref(database, 'items/' + itemId);
    remove(itemRef);
  };

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const firebaseItems = Object.keys(data).map((key) => {
          return { id: key, ...data[key] }; 
        });
        setItems(firebaseItems);
      } else {
        setItems([]); 
      }
    });
  }, []);


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder='Product'
        onChangeText={name => setProduct(prevState => ({ ...prevState, name }))} value={product.name} />
      <TextInput
        style={styles.textInput}
        placeholder='Amount'
        onChangeText={amount => setProduct(prevState => ({ ...prevState, amount }))} value={product.amount} />
      <Button onPress={saveItem} title="Save" />
      <Text style={styles.header}>Shopping list</Text>
      <FlatList
        style={{ marginLeft: "5%" }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listcontainer}>
            <Text>{item.name}, {item.amount} </Text>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        data={items}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textInput: {
    width: '90%',
    height: 40,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 15,
    fontSize: 20,
  },
  removeText: {
    color: 'blue',
    fontWeight: 'bold',
    marginLeft: 10,
  }
});
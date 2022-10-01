import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button } from 'react-native';
import { AsyncStorage } from'@react-native-async-storage/async-storage';
import * as SQLite from'expo-sqlite';

export default function App() {
const [amount, setAmount] = useState('');
const [product, setProduct] = useState('');
const [shoppingList, setShoppingList] = useState([]);

const db = SQLite.openDatabase('shoppinglistdb.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, amount text, product text);');
    }, null, updateList);
  },
    []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppinglist (amount, product) values (?, ?);',
        [parseInt(amount), product]);
    }, null, updateList)
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) =>
        setShoppingList(rows._array)
      );
    }, null, null);
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql('delete from shoppinglist where id = ?;', [id]);
      }, null, updateList
    )
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Product'
        onChangeText={product => setProduct(product)}
        value={product}
      />
      <TextInput
        style={{marginTop: 10,
          marginBottom: 10,
          width: 180,
          fontSize: 18,
          borderColor: 'gray',
          borderWidth: 1}}
        placeholder='Amount'
        keyboardType='numeric'
        onChangeText={amount => setAmount(amount)}
        value={amount}
      />
      <Button  title="SAVE" onPress={saveItem} />
      <Text style={styles.text}>Shopping list:</Text>
      <FlatList
        style={{ marginLeft: "5%" }}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.list}>
            <Text style={{fontSize: 18 }}>{item.product}, {item.amount} </Text>
            <Text style={{fontSize: 18, color: '#0000ff' }} onPress={() => deleteItem(item.id)}>bought</Text>
          </View>}
        data={shoppingList}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginTop: 80,
    width: 180,
    fontSize: 18,
    borderColor: 'gray',
    borderWidth: 1
  },
  text: {
    marginTop: 10,
    fontSize: 22,
    marginBottom: 15,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

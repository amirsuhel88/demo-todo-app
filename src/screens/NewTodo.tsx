import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../../type';
import {useDispatch} from 'react-redux';
import {addTodo} from '../store/slices/TodoSlice';
import {resolver} from '../../metro.config';

const NewTodo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleSaveTodo = async () => {
    try {
      const response = await axios.post(
        `http://192.168.255.150:5000/api/todo`,
        {
          title,
          description,
        },
      );

      dispatch(addTodo(response.data.todo));
      navigation.goBack();
    } catch (error) {
      console.log('error creating new todo');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a New Todo</Text>

      {/* Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description Input */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSaveTodo}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewTodo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#7fb3eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../../type';
import axios from 'axios';
import {RootState} from '../store/store';
import {
  addTodo,
  setError,
  setStatus,
  updateTodo,
} from '../store/slices/TodoSlice';

const EditTodo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const todoId = useSelector((state: RootState) => state.todos.selectedTodoId);
  console.log('todo id: ', todoId);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // fetch the selected todo from the server
  const fetchSelectedTodo = useCallback(
    async (todoId: string) => {
      dispatch(setStatus('loading'));
      try {
        const response = await axios.get(
          `http://192.168.255.150:5000/api/single-todo/${todoId}`,
        );
        // dispatch(setSingleTodo(response.data.todo));
        console.log('data', response.data.todo);
        setTitle(response.data.todo.title); // Populate the title
        setDescription(response.data.todo.description);
      } catch (error: any) {
        dispatch(setError(error.message));
        dispatch(setStatus('failed'));
      }
    },
    [dispatch],
  );
  useEffect(() => {
    if (todoId) {
      fetchSelectedTodo(todoId);
    }
  }, [todoId, fetchSelectedTodo]);

  const handleUpdateTodo = async (todoId: string) => {
    try {
      const response = await axios.patch(
        `http://192.168.255.150:5000/api/udpate-todo/${todoId}`,
        {
          title,
          description,
        },
      );
      dispatch(updateTodo(response.data.todo));
      console.log('hi');
      navigation.goBack();
    } catch (error) {
      console.log('error creating new todo');
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    if (todoId) {
      await fetchSelectedTodo(todoId);
    }
    setRefreshing(false);
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        <Text style={styles.heading}>Edit Todo</Text>

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
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (todoId) {
              handleUpdateTodo(todoId);
            } else {
              console.error('Todo ID is null');
            }
          }}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditTodo;

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
    color: '#000000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    color: '#000000',
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

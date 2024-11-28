import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {State} from 'react-native-gesture-handler';
import {setStatus} from '../store/slices/TodoSlice';

const Home = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const status = useSelector((state: RootState) => state.todos.status);
  const error = useSelector((state: RootState) => state.todos.error);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch(setStatus('loading'));
    };
  });

  return (
    <View>
      <Text>Todo Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});

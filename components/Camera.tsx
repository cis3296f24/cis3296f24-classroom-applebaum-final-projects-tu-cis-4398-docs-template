import React, { useState, useRef } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { storage } from "../utils/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import uuid from 'react-native-uuid';
import * as ImageManipulator from 'expo-image-manipulator';
import { useUser } from './UserContext';
import { doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [habitId, setHabitId] = useState('');
  const { user } = useUser();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePictureAndUpload = async () => {
    if (!habitId.trim()) {
      alert('Please enter a habit name before taking a photo.');
      return;
    }

    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();

        if (!photo) {
          alert('Failed to take photo');
          return;
        }

        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        const response = await fetch(manipResult.uri);
        const blob = await response.blob();

        const filename = `${uuid.v4()}.jpg`;
        const storageRef = ref(storage, `logs/${user?.uid}/${filename}`);

        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        await createLogEntry(downloadURL);

        alert('Photo uploaded and log entry created!');
        setHabitId('');
      } catch (error) {
        console.error('Error uploading photo: ', error);
        alert('Failed to upload photo');
      }
    }
  };

  const createLogEntry = async (imageUrl: string) => {
    try {
      await addDoc(collection(db, 'habit_logs'), {
        userId: user?.uid,
        habitId: habitId.trim(),
        imageUrl: imageUrl,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error creating log entry: ', error);
      alert('Failed to create log entry');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Habit Name"
        placeholderTextColor="gray"
        value={habitId}
        onChangeText={setHabitId}
        style={styles.input}
      />
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePictureAndUpload}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    minWidth: 300,
    width: '100%',
    borderColor: 'lightgray',
    borderWidth: 1,
    margin: 12,
    paddingHorizontal: 8,
    color: 'black',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

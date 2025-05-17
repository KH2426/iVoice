// File: utils/VoiceRecorder.js
import { PermissionsAndroid, Platform } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

// Request mic permission (same as before)
export const requestMicrophonePermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'We need access to your microphone to record audio.',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

let currentPath = null;

export const startRecording = async () => {
  const filename = `recording-${Date.now()}.m4a`;
  currentPath = Platform.select({
    ios: `${RNFS.CachesDirectoryPath}/${filename}`,
    android: `${RNFS.ExternalDirectoryPath}/${filename}`,
  });

  console.log('🎙️ Starting recorder at', currentPath);
  await audioRecorderPlayer.startRecorder(currentPath);
  audioRecorderPlayer.addRecordBackListener((e) => {
    console.log('recording time:', e.currentPosition);
  });
  return currentPath;
};

export const stopRecording = async () => {
  console.log('⏹️ Stopping recorder');
  const result = await audioRecorderPlayer.stopRecorder();
  audioRecorderPlayer.removeRecordBackListener();
  console.log('📁 Recording saved at', result);
  return result;
};

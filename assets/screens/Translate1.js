// File: Translate.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, Switch, ScrollView, ActivityIndicator, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../styles/TranslateStyles';
import Tts from 'react-native-tts';
import Sound from 'react-native-sound';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import { translateText } from '../utils/api/TranslationApi';
import { translateOffline } from '../utils/TranslationOffline';
import { requestMicrophonePermission, startRecording, stopRecording } from '../utils/VoiceRecorder';
import { createTable, insertHistory, fetchHistory } from '../utils/HistoryDB';
import { useNavigation } from '@react-navigation/native';
import { getPlaceDetails } from '../utils/getPlaceDetails';

const Translate = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [inputLanguage, setInputLanguage] = useState('eng');
  const [outputLanguage, setOutputLanguage] = useState('eng');
  const [autoDetect, setAutoDetect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFilePath, setRecordedFilePath] = useState(null);
  const [placeSummary, setPlaceSummary] = useState('');
  const [relatedInfo, setRelatedInfo] = useState([]);
  const [possibleIntent, setPossibleIntent] = useState('');

  const audioRecorderPlayer = new AudioRecorderPlayer();

  useEffect(() => {
    createTable();
    if (Platform.OS === 'android') {
      Sound.setCategory('Record');
    }
  }, []);

  const handleLanguageToggle = () => {
    setAutoDetect(prev => !prev);
  };

  const handleTranslate = async () => {
    if (!inputText.trim() && !recordedFilePath) {
      alert('Please enter some text or speak to translate.');
      return;
    }
    setLoading(true);
    setOutputText('');

    try {
      const netState = await NetInfo.fetch();
      let translated;
      let inputForHistory = inputText;
      let inputVoiceForHistory = recordedFilePath || 'text_input';

      if (recordedFilePath) {
        translated = 'Translation of voice input will appear here.';
        inputForHistory = 'Voice Input Recorded';
      } else if (netState.isConnected && netState.isInternetReachable) {
        translated = await translateText({
          text: inputText,
          sourceLang: inputLanguage,
          targetLang: outputLanguage,
          autoDetect
        });
      } else {
        translated = await translateOffline({
          text: inputText,
          sourceLang: inputLanguage,
          targetLang: outputLanguage
        });
      }

      setOutputText(translated);

      await insertHistory({
        input_text: inputForHistory,
        input_voice: inputVoiceForHistory,
        output_text: translated,
        output_voice: 'output_voice_placeholder.wav',
        input_language: inputLanguage,
        output_language: outputLanguage
      });
    } catch (err) {
      setOutputText('Error: ' + err.message);
    } finally {
      setLoading(false);
      setIsRecording(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      setIsRecording(false);
      const rawPath = await stopRecording();
      setRecordedFilePath(rawPath);
      alert('Recording stopped.');

      const playPath = rawPath.replace(/^file:\/\/+/, '/');
      const exists = await RNFS.exists(playPath);
      if (exists) {
        await audioRecorderPlayer.startPlayer(playPath);
        audioRecorderPlayer.setVolume(1.0);
        audioRecorderPlayer.addPlayBackListener(e => {
          if (e.currentPosition === e.duration) {
            audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
          }
        });
      }
    } else {
      const granted = await requestMicrophonePermission();
      if (!granted) return alert('Microphone permission not granted.');
      setIsRecording(true);
      setRecordedFilePath(null);
      alert('Recording started…');
      await startRecording();
    }
  };

  const getTTSLanguage = code => {
    if (code === 'eng') return 'en-US';
    if (code === 'hin') return 'hi-IN';
    if (code === 'cmn') return 'zh-CN';
    return 'en-US';
  };

  const handleReadOutput = () => {
    if (outputText) {
      Tts.stop();
      Tts.setDefaultLanguage(getTTSLanguage(outputLanguage));
      Tts.speak(outputText);
    } else {
      alert('No text to read aloud.');
    }
  };

  const handlePlaceDescriptionTranslate = async () => {
    if (!inputText.trim()) {
      alert('Please enter a place name.');
      return;
    }

    setLoading(true);
    setOutputText('');
    setPlaceSummary('');
    setRelatedInfo([]);
    setPossibleIntent('');

    try {
      const place = await getPlaceDetails(inputText.trim());
      setPlaceSummary(place.summary);
      setRelatedInfo(place.relatedInfo);
      setPossibleIntent(place.intent);

      const netState = await NetInfo.fetch();
      let translated;

      if (netState.isConnected && netState.isInternetReachable) {
        translated = await translateText({
          text: place.summary,
          sourceLang: 'eng',
          targetLang: outputLanguage,
          autoDetect: false
        });
      } else {
        translated = await translateOffline({
          text: place.summary,
          sourceLang: 'eng',
          targetLang: outputLanguage
        });
      }

      setOutputText(translated);

      await insertHistory({
        input_text: inputText,
        input_voice: 'place_query',
        output_text: translated,
        output_voice: 'output_voice_placeholder.wav',
        input_language: 'eng',
        output_language: outputLanguage
      });
    } catch (err) {
      setOutputText('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={appStyles.scrollContainer}>
        <View style={appStyles.container}>

          <Animatable.View animation="fadeInDown" duration={600} style={appStyles.topHeader}>
            <Text style={appStyles.topHeaderTitle}>Translate</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInDown" duration={700} style={appStyles.autoDetectSection}>
            <Text style={appStyles.autoDetectText}>Auto Detect Input Language</Text>
            <Switch value={autoDetect} onValueChange={handleLanguageToggle} />
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={200} style={appStyles.inputSection}>
            <Text style={appStyles.sectionTitle}>Input</Text>
            <TouchableOpacity style={appStyles.iconAboveInput} onPress={handleVoiceInput}>
              <Icon
                name={isRecording ? 'microphone-off' : 'microphone'}
                size={30}
                color={isRecording ? '#ef4444' : '#10b981'}
              />
            </TouchableOpacity>
            <TextInput
              style={appStyles.textArea}
              placeholder="Enter place name or text..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="top"
              editable={!isRecording}
            />
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={300}>
            <TouchableOpacity
              style={[appStyles.translateButtonModern, loading && appStyles.translateButtonDisabled]}
              onPress={handleTranslate}
              disabled={loading || isRecording}
            >
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={appStyles.translateButtonText}>Translate</Text>}
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={350}>
            <TouchableOpacity
              style={[appStyles.translateButtonModern, loading && appStyles.translateButtonDisabled]}
              onPress={handlePlaceDescriptionTranslate}
              disabled={loading}
            >
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={appStyles.translateButtonText}>Describe Place</Text>}
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={400} style={appStyles.outputSection}>
            <Text style={appStyles.sectionTitle}>Output</Text>
            <TouchableOpacity style={appStyles.iconAboveInput} onPress={handleReadOutput}>
              <Icon name="volume-high" size={30} color="#10b981" />
            </TouchableOpacity>
            <View style={appStyles.outputTextAreaContainer}>
              <Text style={appStyles.outputTextArea}>{outputText}</Text>
            </View>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={500} style={appStyles.contextSection}>
            <Text style={appStyles.sectionTitle}>Contextual Information</Text>
            {placeSummary ? (
              <View style={appStyles.contextInfoBox}>
                <Text style={appStyles.contextInfoText}>• Related Info: {relatedInfo.join(', ') || 'N/A'}</Text>
                <Text style={appStyles.contextInfoText}>• Possible Intent: {possibleIntent}</Text>
              </View>
            ) : (
              <Text style={appStyles.contextInfoText}>No contextual info available yet.</Text>
            )}
          </Animatable.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Translate;
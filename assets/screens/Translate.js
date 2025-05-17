import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
  ScrollView,
  ActivityIndicator,
  Platform
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
import {
  requestMicrophonePermission,
  startRecording,
  stopRecording,
} from '../utils/VoiceRecorder';
import { createTable, insertHistory, fetchHistory } from '../utils/HistoryDB';
import { useNavigation } from '@react-navigation/native';

// language lists & TTS map
import { onlineLanguages } from '../utils/languagesOnline';
import { offlineLanguages } from '../utils/languagesOffline';
import { ttsLanguageMap } from '../utils/ttsLanguageMap';
import SearchablePicker from '../components/SearchablePicker';
import { languageLabels } from '../utils/languageLabels';

import ContextualInformation from '../utils/api/ContextInfoApi';

const Translate = () => {
  const navigation = useNavigation();

  // State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [inputLanguage, setInputLanguage] = useState('eng');
  const [outputLanguage, setOutputLanguage] = useState('eng');
  const [autoDetect, setAutoDetect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFilePath, setRecordedFilePath] = useState(null);
  const [isOnlineMode, setIsOnlineMode] = useState(false);

  // Initialize DB, audio and network listener
  useEffect(() => {
    createTable();
    if (Platform.OS === 'android') {
      Sound.setCategory('Record');
      console.log('Audio category set to Record (Android)');
    }

    const unsubscribeNet = NetInfo.addEventListener(state => {
      setIsOnlineMode(state.isConnected && state.isInternetReachable);
    });

    return () => unsubscribeNet();
  }, []);

  // decide which list to render
  const availableLanguages = isOnlineMode
  ? onlineLanguages
  : offlineLanguages;

  // Toggle auto-detect
  const handleLanguageToggle = () => {
    setAutoDetect(prev => !prev);
  };

  // Translation handler
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
        console.log('🟡 Voice translation is not fully implemented yet');
        alert(
          'Voice translation is not fully implemented yet. Recording saved at: ' +
            recordedFilePath
        );
        translated = 'Translation of voice input will appear here.';
        inputForHistory = 'Voice Input Recorded';
      } else if (netState.isConnected && netState.isInternetReachable) {
        translated = await translateText({
          text: inputText,
          sourceLang: inputLanguage,
          targetLang: outputLanguage,
          autoDetect,
        });
        setOutputText(translated);
        console.log('✅ Translated:', translated);
      } else {
        translated = await translateOffline({
          text: inputText,
          sourceLang: inputLanguage,
          targetLang: outputLanguage,
        });
        setOutputText(translated);
      }

      // insert into history
      await insertHistory({
        input_text: inputForHistory,
        input_voice: inputVoiceForHistory,
        output_text: translated,
        output_voice: 'output_voice_placeholder.wav',
        input_language: inputLanguage,
        output_language: outputLanguage,
      });
    } catch (err) {
      console.error('❌ Translation error:', err);
      setOutputText('Error: ' + err.message);
    } finally {
      setLoading(false);
      setIsRecording(false);
    }
  };

  // Voice recording handler
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const handleVoiceInput = async () => {
    if (isRecording) {
      setIsRecording(false);
      const rawPath = await stopRecording();
      setRecordedFilePath(rawPath);
      console.log('📁 Recording saved at raw URI:', rawPath);
      alert('Recording stopped.');

      // playback
      const playPath = rawPath.replace(/^file:\/\/+/, '/');
      console.log('▶︎ Normalized playback path:', playPath);
      RNFS.stat(playPath)
        .then(stat => console.log('🗂️ File size (bytes):', stat.size))
        .catch(() => console.log('⚠️ Could not stat file'));

      await audioRecorderPlayer.startPlayer(playPath);
      audioRecorderPlayer.setVolume(1.0);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
        }
      });
    } else {
      const granted = await requestMicrophonePermission();
      if (!granted) return alert('Microphone permission not granted.');
      setIsRecording(true);
      setRecordedFilePath(null);
      alert('Recording started…');
      await startRecording();
    }
  };

  // TTS mapping and handler
  const getTTSLanguage = code => ttsLanguageMap[code] || 'en-US';
  const handleReadOutput = () => {
    if (outputText) {
      Tts.stop();
      Tts.setDefaultLanguage(getTTSLanguage(outputLanguage));
      Tts.speak(outputText);
    } else {
      alert('No text to read aloud.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={appStyles.scrollContainer}>
        <View style={appStyles.container}>

          {/* Header */}
          <Animatable.View animation="fadeInDown" duration={600} style={appStyles.topHeader}>
            <Text style={appStyles.topHeaderTitle}>Translate</Text>
          </Animatable.View>

          {/* Auto Detect Switch */}
          <Animatable.View animation="fadeInDown" duration={700} style={appStyles.autoDetectSection}>
            <Text style={appStyles.autoDetectText}>Auto Detect Input Language</Text>
            <Switch value={autoDetect} onValueChange={handleLanguageToggle} />
          </Animatable.View>

          {/* Language Pickers */}
          <Animatable.View animation="fadeInUp" delay={100} style={appStyles.languageSection}>
            {/* Input */}
            <View style={appStyles.languageSelector}>
              <Text style={appStyles.sectionSubText}>Input Language</Text>
              <SearchablePicker
                items={availableLanguages}
                labelMapping={languageLabels}
                selectedValue={inputLanguage}
                onValueChange={setInputLanguage}
                placeholder="Search input language…"
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                const tmp = inputLanguage;
                setInputLanguage(outputLanguage);
                setOutputLanguage(tmp);
              }}
              style={appStyles.swapButton}
            >
              <Icon name="swap-horizontal" size={28} color="#38bdf8" />
            </TouchableOpacity>

            {/* <View style={[appStyles.languageSelector, appStyles.languageSelectorLast]}> */}
              {/* <Text style={appStyles.sectionSubText}>Output Language</Text> */}
              {/* <Picker
                selectedValue={outputLanguage}
                style={appStyles.picker}
                onValueChange={setOutputLanguage}
              >
                {availableLanguages.map(code => (
                  <Picker.Item key={code} label={code} value={code} />
                ))}
              </Picker> */}
              
              {/* Output */}
            <View style={[appStyles.languageSelector, appStyles.languageSelectorLast]}>
              <Text style={appStyles.sectionSubText}>Output Language</Text>
              <SearchablePicker
                items={availableLanguages}
                labelMapping={languageLabels}
                selectedValue={outputLanguage}
                onValueChange={setOutputLanguage}
                placeholder="Search output language…"
              />
            </View>
              
            {/* </View> */}
          </Animatable.View>

          {/* Input Section */}
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
              placeholder="Enter text or speak..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="top"
              editable={!autoDetect && !isRecording}
            />
          </Animatable.View>

          {/* Translate Button */}
          <Animatable.View animation={loading ? undefined : 'pulse'} duration={300} style={{ transform: [{ scale: loading ? 0.98 : 1 }] }}>
            <TouchableOpacity
              style={[appStyles.translateButtonModern, loading && appStyles.translateButtonDisabled]}
              onPress={handleTranslate}
              disabled={loading || isRecording}
            >
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={appStyles.translateButtonText}>Translate</Text>}
            </TouchableOpacity>
          </Animatable.View>

          {/* Output Section */}
          <Animatable.View animation="fadeIn" delay={400} style={appStyles.outputSection}>
            <Text style={appStyles.sectionTitle}>Output</Text>
            <TouchableOpacity style={appStyles.iconAboveInput} onPress={handleReadOutput}>
              <Icon name="volume-high" size={30} color="#10b981" />
            </TouchableOpacity>
            <View style={appStyles.outputTextAreaContainer}>
              <Text style={appStyles.outputTextArea} selectable={true} >{outputText}</Text>
            </View>
          </Animatable.View>

          {/* Contextual Info */}
          <Animatable.View animation="fadeInUp" delay={500} style={appStyles.contextSection}>
            <Text style={appStyles.sectionTitle}>Contextual Information</Text>
            {outputText ? (
              <ContextualInformation
                text={outputText}
                sourceLang={outputLanguage}
                targetLang={outputLanguage}
                autoDetect={autoDetect}
              />
            ) : (
              <Text style={appStyles.contextInfoText}>
                No contextual info available yet.
              </Text>
            )}
          </Animatable.View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Translate;
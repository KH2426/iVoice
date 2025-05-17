// screens/HistoryPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchHistory } from '../utils/HistoryDB';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
//**SQLite
  // ✅ Fetch data when screen is focused
    useFocusEffect(
      React.useCallback(() => {
        console.log('🔁 useFocusEffect triggered on HistoryPage');

        fetchHistory()
          .then((data) => {
            console.log('📦 Data fetched from SQLite:', data);
            setHistory(data);
          })
          .catch((err) => console.error('❌ Failed to fetch history:', err));
      }, [])
    );

    // ✅ Optional: log whenever state is updated
    useEffect(() => {
      console.log('🧠 History state updated:', history);
    }, [history]);
//**end
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Translation History</Text>
      {history.length === 0 ? (
        <Text style={styles.noData}>No history available yet.</Text>
      ) : (
        history.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.label}>Input:</Text>
            <Text>{item.input_text}</Text>

            <Text style={styles.label}>Output:</Text>
            <Text>{item.output_text}</Text>

            <Text style={styles.details}>
              {item.input_language} ➜ {item.output_language}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(item.date).toLocaleString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noData: {
    fontStyle: 'italic',
    color: '#94a3b8',
  },
  card: {
    backgroundColor: '#e2e8f0',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  label: {
    fontWeight: '600',
  },
  details: {
    fontSize: 12,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
});

export default HistoryPage;

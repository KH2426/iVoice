// components/ContextualInformation.js

import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const POST_URL = 'https://shenuki-ner.hf.space/gradio_api/call/predict';
const GET_URL  = id => `https://shenuki-ner.hf.space/gradio_api/call/predict/${id}`;

export default function ContextualInformation({
  text,
  sourceLang,
  targetLang,
  autoDetect
}) {
  const [entities, setEntities] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!text) return;
    let canceled = false;

    async function load() {
      console.log('[Context] Starting POST to', POST_URL);
      setLoading(true);
      setError(null);

      try {
        // 1) Submit POST
        const postRes = await fetch(POST_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: [text, sourceLang, targetLang, autoDetect] }),
        });
        console.log('[Context] POST status:', postRes.status);
        const postJson = await postRes.json();
        console.log('[Context] POST response:', postJson);

        const eventId = postJson?.id ?? postJson?.event_id;
        if (!eventId) throw new Error('No event_id returned from POST');

        // 2) Poll GET until valid JSON.data
        let getJson = null;
        for (let attempt = 1; attempt <= 1; attempt++) {
          console.log(`[Context] GET attempt ${attempt} for eventId ${eventId}`);
          await new Promise(r => setTimeout(r, 500));

          const getRes = await fetch(GET_URL(eventId));
          console.log('[Context] GET status:', getRes.status);

          // Read raw text once
          const raw = await getRes.text();
          console.log('[Context] GET raw body:', raw.substring(0, 200));

          // Try JSON.parse
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.data) && parsed.data.length) {
              getJson = parsed;
              console.log('[Context] Parsed GET JSON:', getJson);
              break;
            }
          } catch (parseErr) {
            console.warn('[Context] GET response not JSON yet, retrying...');
          }
        }

        if (!getJson) throw new Error('No data returned after polling');

        const result = getJson.data[0];
        if (!canceled) {
          console.log('[Context] Setting entities:', result.entities);
          setEntities(result.entities);
        }
      } catch (e) {
        console.error('[Context] Error:', e);
        if (!canceled) setError(e.message);
      } finally {
        if (!canceled) {
          setLoading(false);
          console.log('[Context] Finished load');
        }
      }
    }

    load();
    return () => {
      canceled = true;
      console.log('[Context] Load canceled');
    };
  }, [text, sourceLang, targetLang, autoDetect]);

  if (!text) return null;
  if (loading) return <ActivityIndicator style={styles.loading} />;
  if (error)   return <Text style={styles.error}>{error}</Text>;
  if (!entities?.length) return <Text style={styles.none}>No entities found.</Text>;

  return (
    <View style={styles.container}>
      {entities.map((ent, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.title}>
            {ent.text} <Text style={styles.label}>({ent.label})</Text>
          </Text>

          {ent.type === 'location' && ent.geo && (
            <Text style={styles.text}>
              📍 {ent.geo.lat.toFixed(4)}, {ent.geo.lon.toFixed(4)}
            </Text>
          )}

          {ent.type === 'location' && ent.restaurants?.length > 0 && (
            <Text style={styles.text}>
              🍽 {ent.restaurants.map(r => r.name).join(', ')}
            </Text>
          )}

          {ent.type === 'location' && ent.attractions?.length > 0 && (
            <Text style={styles.text}>
              🏛 {ent.attractions.map(a => a.name).join(', ')}
            </Text>
          )}

          {ent.type === 'wiki' && (
            <Text style={styles.text}>{ent.summary}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  loading:   { marginVertical: 12 },
  error:     { color: 'red', marginVertical: 8 },
  none:      { fontStyle: 'italic', marginVertical: 8 },
  card:      {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2
  },
  title: { fontWeight: 'bold', marginBottom: 4, fontSize: 16 },
  label: { fontWeight: 'normal', color: '#555' },
  text:  { fontSize: 14, marginBottom: 4 }
});

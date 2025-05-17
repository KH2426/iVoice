// utils/api/TranslationApi.js

import { EventSourcePolyfill } from 'event-source-polyfill';

const API_BASE = 'https://shenuki-ivoice.hf.space/gradio_api/call/predict';

export async function translateText({ text, sourceLang, targetLang, autoDetect }) {
  // 1) POST and get event_id
  const payload = { data: [text, sourceLang, targetLang, autoDetect] };
  console.log('🔵 Translation API payload:', payload);

  const postRes = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!postRes.ok) throw new Error(`POST error ${postRes.status}`);

  const { event_id } = await postRes.json();
  console.log('🟢 event_id:', event_id);

  // 2) SSE stream
  return new Promise((resolve, reject) => {
    let lastTranslation = '';

    const url = `${API_BASE}/${event_id}`;
    console.log('🟣 Connecting to SSE at', url);

    const es = new EventSourcePolyfill(url, {
      headers: { Accept: 'text/event-stream' }
    });

    // Listen for the “generating” event (or whatever intermediate event you get)
    es.addEventListener('generating', (e) => {
      console.log('📨 [generating] raw data:', e.data);
      try {
        const [chunk] = JSON.parse(e.data);
        console.log('🔸 Partial chunk:', chunk);
        lastTranslation = chunk;
      } catch(err) {
        console.warn('⚠️ parsing generating data failed', err);
      }
    });

    // Listen for the final “complete” event
    es.addEventListener('complete', (e) => {
      console.log('✅ [complete] raw data:', e.data);
      try {
        const [chunk] = JSON.parse(e.data);
        console.log('🔹 Final chunk:', chunk);
        lastTranslation = chunk;
      } catch(err) {
        console.warn('⚠️ parsing complete data failed', err);
      }
      es.close();
      if (lastTranslation) resolve(lastTranslation);
      else reject(new Error('No translation received before complete'));
    });

    // Also catch any generic messages (in case there are default events)
    es.onmessage = (e) => {
      console.log('📧 [message] default data:', e.data);
    };

    es.onerror = (err) => {
      console.error('❌ SSE error', err);
      es.close();
      reject(err);
    };
  });
}
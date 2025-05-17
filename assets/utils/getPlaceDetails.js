import axios from 'axios';

export const getPlaceDetails = async (placeName) => {
  try {
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`,
      {
        headers: {
          'User-Agent': 'iVoiceApp/1.0 (https://yourappdomain.com)',
          'Accept': 'application/json'
        }
      }
    );

    const summary = response.data.extract || 'No summary available.';
    const title = response.data.title || placeName;

    const relatedInfo = [];
    if (/capital/i.test(summary)) relatedInfo.push('Capital city');
    if (/tourism|attraction/i.test(summary)) relatedInfo.push('Popular for tourism');
    if (/population/i.test(summary)) relatedInfo.push('Densely populated');
    if (/university/i.test(summary)) relatedInfo.push('Has major universities');
    if (/beach/i.test(summary)) relatedInfo.push('Known for beaches');

    let intent = 'General knowledge inquiry';
    if (/travel|tourism/i.test(summary)) intent = 'Looking for travel guidance';
    else if (/university|education/i.test(summary)) intent = 'Seeking educational info';

    return {
      title,
      summary,
      relatedInfo,
      intent
    };
  } catch (error) {
    console.error('Wikipedia fetch error:', error.message);
    return {
      title: placeName,
      summary: `Could not fetch description (status: ${error.response?.status || 'unknown'})`,
      relatedInfo: [],
      intent: 'Unknown'
    };
  }
};

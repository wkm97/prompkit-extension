import { v4 as uuidv4 } from 'uuid';

const SESSION_EXPIRATION_IN_MIN = 30;
const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;
const MEASUREMENT_ID = process.env.PLASMO_PUBLIC_GA_MEASUREMENT_ID;
const API_SECRET = process.env.PLASMO_PUBLIC_GA_API_SECRET;
const ENV = process.env.NODE_ENV

async function getOrCreateClientId() {
  const result = await chrome.storage.local.get('clientId');
  let clientId = result.clientId;
  if (!clientId) {
    // Generate a unique client ID, the actual value is not relevant
    clientId = uuidv4();
    await chrome.storage.local.set({ clientId });
  }
  return clientId;
}

async function getOrCreateSessionId() {
  // Store session in memory storage
  let { sessionData } = await chrome.storage.local.get('sessionData');
  // Check if session exists and is still valid
  const currentTimeInMs = Date.now();
  if (sessionData && sessionData.timestamp) {
    // Calculate how long ago the session was last updated
    const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
    // Check if last update lays past the session expiration threshold
    if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
      // Delete old session id to start a new session
      sessionData = null;
    } else {
      // Update timestamp to keep session alive
      sessionData.timestamp = currentTimeInMs;
      await chrome.storage.local.set({ sessionData });
    }
  }
  if (!sessionData) {
    // Create and store a new session
    sessionData = {
      session_id: currentTimeInMs.toString(),
      timestamp: currentTimeInMs.toString(),
    };
    await chrome.storage.local.set({ sessionData });
  }
  return sessionData.session_id;
}

interface GAEvent {
  name: string,
  params?: Object
}

const createGAEvent = (event: GAEvent, sessionId: string) => {
  const defaultParams = {
    ...(ENV === 'development' ? { debug_mode: true } : {}),
    session_id: sessionId,
    engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
  }

  return {
    name: event.name,
    params: {
      ...(event.params ? event.params : {}),
      ...defaultParams
    }
  }
}

export const track = async (events: Array<GAEvent>) => {
  if(process.env.PLASMO_TARGET === 'firefox-mv3'){
    return
  }
  const sessionId = await getOrCreateSessionId()
  const allEvents = events.map(event => createGAEvent(event, sessionId))
  fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
    {
      method: 'POST',
      body: JSON.stringify({
        client_id: await getOrCreateClientId(),
        events: allEvents
      }),
    }
  ).catch(e => ({}));
}

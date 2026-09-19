import type { QuizQuestion, QuizResult, MoodId } from '../types';

/** 10 questions, each option scores one or more moods. Extracted from QUIZ_QS. */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: "It's Saturday morning. What does your ideal day look like?",
    options: [
      { id: 'q1a', text: 'Brunch in the sun with friends', scores: { happy: 3, romantic: 1, party: 1 } },
      { id: 'q1b', text: 'A long walk alone with good music', scores: { calm: 3, minimal: 1, cool: 1 } },
      { id: 'q1c', text: 'Spontaneous plans — wherever the day takes me', scores: { energetic: 2, party: 2, happy: 1 } },
      { id: 'q1d', text: 'Something intentional. Museum, book, slow coffee.', scores: { confident: 2, professional: 1, calm: 2 } },
    ],
  },
  {
    id: 'q2',
    question: "You're getting dressed. What's your first instinct?",
    options: [
      { id: 'q2a', text: 'Something that makes me feel powerful', scores: { confident: 3, professional: 2 } },
      { id: 'q2b', text: 'Comfortable — but make it look effortless', scores: { cool: 3, minimal: 2 } },
      { id: 'q2c', text: 'Bright, fun, something that makes me smile', scores: { happy: 3, party: 1, energetic: 1 } },
      { id: 'q2d', text: 'Soft, flowing, a little romantic', scores: { romantic: 3, calm: 1 } },
    ],
  },
  {
    id: 'q3',
    question: 'Pick a colour that feels like you right now.',
    options: [
      { id: 'q3a', text: 'Golden yellow or warm orange', scores: { happy: 3, energetic: 2 } },
      { id: 'q3b', text: 'Deep navy or charcoal black', scores: { confident: 2, professional: 2, minimal: 2 } },
      { id: 'q3c', text: 'Dusty rose or soft blush', scores: { romantic: 3, calm: 1 } },
      { id: 'q3d', text: 'Ice blue or cool grey', scores: { cool: 3, minimal: 1 } },
    ],
  },
  {
    id: 'q4',
    question: 'How does your energy feel today?',
    options: [
      { id: 'q4a', text: "On fire — let's go", scores: { energetic: 3, party: 2, confident: 1 } },
      { id: 'q4b', text: 'Grounded and steady', scores: { calm: 3, professional: 1, minimal: 1 } },
      { id: 'q4c', text: 'Warm and open-hearted', scores: { romantic: 2, happy: 2, calm: 1 } },
      { id: 'q4d', text: 'Sharp and focused', scores: { confident: 3, professional: 2, cool: 1 } },
    ],
  },
  {
    id: 'q5',
    question: "You're picking a playlist. What do you put on?",
    options: [
      { id: 'q5a', text: 'Electronic / deep house — smooth and cool', scores: { cool: 3, minimal: 2, calm: 1 } },
      { id: 'q5b', text: 'Upbeat pop — something to dance to', scores: { party: 3, happy: 2, energetic: 1 } },
      { id: 'q5c', text: 'Slow indie or acoustic — emotional', scores: { romantic: 3, calm: 2 } },
      { id: 'q5d', text: 'Motivational hip-hop or rock', scores: { energetic: 3, confident: 2 } },
    ],
  },
  {
    id: 'q6',
    question: "Tonight you're going out. Where are you headed?",
    options: [
      { id: 'q6a', text: 'A rooftop bar — cocktails, good vibes', scores: { cool: 2, party: 2, confident: 1 } },
      { id: 'q6b', text: 'Dinner for two — candles, low lighting', scores: { romantic: 3, calm: 1 } },
      { id: 'q6c', text: 'A club — I want to dance all night', scores: { party: 3, energetic: 2 } },
      { id: 'q6d', text: "I'm staying in. Comfort over everything.", scores: { calm: 3, minimal: 2, happy: 1 } },
    ],
  },
  {
    id: 'q7',
    question: 'Which word feels most like you today?',
    options: [
      { id: 'q7a', text: 'Radiant', scores: { happy: 3, romantic: 1, energetic: 1 } },
      { id: 'q7b', text: 'Unbothered', scores: { cool: 3, minimal: 2 } },
      { id: 'q7c', text: 'Magnetic', scores: { confident: 3, party: 1 } },
      { id: 'q7d', text: 'Still', scores: { calm: 3, minimal: 2, romantic: 1 } },
    ],
  },
  {
    id: 'q8',
    question: "You're shopping for one new piece. What do you reach for?",
    options: [
      { id: 'q8a', text: 'A sharp blazer or tailored coat', scores: { professional: 3, confident: 2 } },
      { id: 'q8b', text: 'Something flowy and feminine', scores: { romantic: 3, calm: 1, happy: 1 } },
      { id: 'q8c', text: 'A statement sneaker or streetwear piece', scores: { cool: 3, energetic: 1 } },
      { id: 'q8d', text: 'A classic white shirt or clean basic', scores: { minimal: 3, professional: 2 } },
    ],
  },
  {
    id: 'q9',
    question: 'What matters most to you in a look?',
    options: [
      { id: 'q9a', text: "It's polished — not a wrinkle out of place", scores: { professional: 3, confident: 2, minimal: 1 } },
      { id: 'q9b', text: 'It moves with me — free and easy', scores: { energetic: 2, calm: 2, happy: 1 } },
      { id: 'q9c', text: 'It turns heads without trying', scores: { cool: 3, confident: 2 } },
      { id: 'q9d', text: 'It feels like a feeling, not just clothes', scores: { romantic: 3, happy: 1, calm: 1 } },
    ],
  },
  {
    id: 'q10',
    question: 'One last one — pick a texture.',
    options: [
      { id: 'q10a', text: 'Raw linen or soft cotton — natural, unforced', scores: { calm: 3, minimal: 2 } },
      { id: 'q10b', text: 'Silk or satin — smooth, effortless luxury', scores: { romantic: 3, cool: 1, confident: 1 } },
      { id: 'q10c', text: 'Leather or sharp suiting fabric', scores: { confident: 3, cool: 2, professional: 1 } },
      { id: 'q10d', text: 'Anything lightweight I can move in', scores: { energetic: 3, happy: 2 } },
    ],
  },
];

export const QUIZ_RESULTS: Record<MoodId, QuizResult> = {
  happy: { moodId: 'happy', emoji: '😊', line: 'You dress in colour and carry it like sunshine.' },
  confident: { moodId: 'confident', emoji: '🦁', line: 'You walk into rooms like the outcome is already decided.' },
  cool: { moodId: 'cool', emoji: '😎', line: 'Effortless is your default. Always.' },
  professional: { moodId: 'professional', emoji: '💼', line: 'Sharp, precise, and quietly unstoppable.' },
  party: { moodId: 'party', emoji: '🎉', line: 'Tonight deserves an outfit to match.' },
  energetic: { moodId: 'energetic', emoji: '⚡', line: 'Your energy sets the dress code for everyone around you.' },
  romantic: { moodId: 'romantic', emoji: '🌹', line: 'Some feelings deserve an entire outfit.' },
  calm: { moodId: 'calm', emoji: '🌊', line: 'Stillness is a style. You wear it naturally.' },
  minimal: { moodId: 'minimal', emoji: '🖤', line: 'Nothing extra. Nothing missing. Just right.' },
};

export function emptyScoreboard(): Record<MoodId, number> {
  return {
    happy: 0, confident: 0, cool: 0, professional: 0,
    party: 0, energetic: 0, romantic: 0, calm: 0, minimal: 0,
  };
}

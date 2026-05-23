const { readJSON } = require('../utils/dataReader');
const { success, fail } = require('../utils/response');

const ZODIAC_WEIGHT = 0.4;
const QUIZ_WEIGHT = 0.6;

function getList(req, res) {
  const characters = readJSON('characters.json');
  const list = characters.map(({ id, name, emoji, concept, tagline, zodiacAffinity }) => ({
    id, name, emoji, concept, tagline, zodiacAffinity
  }));
  res.json(success(list));
}

function matchCharacter(req, res) {
  const { zodiac, answers } = req.body;
  if (!zodiac) return res.json(fail('请选择星座'));
  if (!answers || !Array.isArray(answers) || answers.length !== 10) {
    return res.json(fail('请完成全部10道题目'));
  }

  const characters = readJSON('characters.json');
  const quizData = readJSON('quiz.json');

  // Calculate quiz attribute scores
  const quizScores = { adventure: 0, thought: 0, social: 0, rest: 0 };
  for (let i = 0; i < answers.length; i++) {
    const question = quizData.questions[i];
    const option = question.options.find(o => o.key === answers[i]);
    if (!option) return res.json(fail(`第${i+1}题答案无效`));
    for (const [attr, score] of Object.entries(option.weights)) {
      quizScores[attr] = (quizScores[attr] || 0) + score;
    }
  }

  // Normalize quiz scores to 0-1
  const maxQuiz = 100;
  const normQuiz = {};
  for (const [attr, score] of Object.entries(quizScores)) {
    normQuiz[attr] = score / maxQuiz;
  }

  // Calculate match scores for each character
  const scored = characters.map(char => {
    // Zodiac affinity: 1.0 if zodiac matches, 0.3 otherwise
    const zodiacScore = char.zodiacAffinity.includes(zodiac) ? 1.0 : 0.3;

    // Quiz similarity: cosine-like distance between quiz result and char attributes
    let dotProduct = 0, quizMag = 0, charMag = 0;
    for (const attr of ['adventure', 'thought', 'social', 'rest']) {
      dotProduct += normQuiz[attr] * char.attributes[attr];
      quizMag += normQuiz[attr] * normQuiz[attr];
      charMag += char.attributes[attr] * char.attributes[attr];
    }
    const quizSimilarity = dotProduct / (Math.sqrt(quizMag) * Math.sqrt(charMag) + 0.001);

    const totalScore = zodiacScore * ZODIAC_WEIGHT + quizSimilarity * QUIZ_WEIGHT;

    return { ...char, totalScore, zodiacScore, quizSimilarity };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);
  const best = scored[0];

  res.json(success({
    zodiac,
    answers,
    character: {
      id: best.id,
      name: best.name,
      emoji: best.emoji,
      concept: best.concept,
      tagline: best.tagline,
      visualTag: best.visualTag,
      visualPrompt: best.visualPrompt,
      personality: best.personality
    },
    scores: {
      total: Math.round(best.totalScore * 100),
      zodiacAffinity: Math.round(best.zodiacScore * 100),
      quizMatch: Math.round(best.quizSimilarity * 100)
    },
    allResults: scored.map(c => ({
      id: c.id,
      name: c.name,
      emoji: c.emoji,
      totalScore: Math.round(c.totalScore * 100)
    }))
  }));
}

module.exports = { getList, matchCharacter };

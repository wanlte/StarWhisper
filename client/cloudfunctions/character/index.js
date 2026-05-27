const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const fs = require('fs')
const path = require('path')

/**
 * 从 JSON 文件读取数据
 * @param {string} filename - JSON 文件名
 * @returns {object} 解析后的 JSON 对象
 */
function readJSON(filename) {
  const raw = fs.readFileSync(path.join(__dirname, filename), 'utf-8')
  return JSON.parse(raw)
}

/**
 * 返回成功响应
 * @param {any} data - 响应数据
 * @param {string} [message='ok'] - 响应消息
 * @returns {object} 标准成功响应对象
 */
function success(data, message = 'ok') {
  return { code: 0, message, data }
}

/**
 * 返回失败响应
 * @param {string} [message='error'] - 错误消息
 * @param {number} [code=-1] - 错误码
 * @returns {object} 标准失败响应对象
 */
function fail(message = 'error', code = -1) {
  return { code, message, data: null }
}

const ZODIAC_WEIGHT = 0.4
const QUIZ_WEIGHT = 0.6

/**
 * 处理获取角色列表请求
 * 从 characters.json 读取所有角色信息，返回简化的角色列表
 * @returns {object} 包含角色列表的成功响应
 */
function handleList() {
  const characters = readJSON('characters.json')
  const list = characters.map(({ id, name, emoji, concept, tagline, zodiacAffinity }) => ({
    id, name, emoji, concept, tagline, zodiacAffinity
  }))
  return success(list)
}

/**
 * 处理获取问卷题目请求
 * 从 quiz.json 随机抽取 10 道题目返回
 * @returns {object} 包含随机题目的成功响应
 */
function handleQuestions() {
  const quizData = readJSON('quiz.json')
  const shuffled = [...quizData.questions].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 10)
  const safe = selected.map(q => ({
    id: q.id,
    text: q.text,
    options: q.options.map(o => ({ key: o.key, text: o.text }))
  }))
  return success(safe)
}

/**
 * 处理匹配角色请求
 * 根据用户星座和答题结果计算相似度，返回最匹配的角色
 * @param {string} zodiac - 用户选择的星座
 * @param {Array} answers - 用户答案数组
 * @returns {object} 包含匹配角色和分数的响应
 */
function handleMatch(zodiac, answers) {
  if (!zodiac) return fail('请选择星座')
  if (!answers || !Array.isArray(answers) || answers.length !== 10) {
    return fail('请完成全部10道题目')
  }

  const characters = readJSON('characters.json')
  const quizData = readJSON('quiz.json')

  const quizScores = { adventure: 0, thought: 0, social: 0, rest: 0 }
  for (let i = 0; i < answers.length; i++) {
    const ans = answers[i]
    // Support both legacy (string key) and new (object with questionId + key) formats
    const questionId = typeof ans === 'object' ? ans.questionId : quizData.questions[i]?.id
    const answerKey = typeof ans === 'object' ? ans.key : ans
    const question = quizData.questions.find(q => q.id === questionId)
    if (!question) return fail(`题目${questionId}不存在`)
    const option = question.options.find(o => o.key === answerKey)
    if (!option) return fail(`题目${questionId}的答案${answerKey}无效`)
    for (const [attr, score] of Object.entries(option.weights)) {
      quizScores[attr] = (quizScores[attr] || 0) + score
    }
  }

  const maxQuiz = 100
  const normQuiz = {}
  for (const [attr, score] of Object.entries(quizScores)) {
    normQuiz[attr] = score / maxQuiz
  }

  const scored = characters.map(char => {
    const zodiacScore = char.zodiacAffinity.includes(zodiac) ? 1.0 : 0.3

    let dotProduct = 0, quizMag = 0, charMag = 0
    for (const attr of ['adventure', 'thought', 'social', 'rest']) {
      dotProduct += normQuiz[attr] * char.attributes[attr]
      quizMag += normQuiz[attr] * normQuiz[attr]
      charMag += char.attributes[attr] * char.attributes[attr]
    }
    const quizSimilarity = dotProduct / (Math.sqrt(quizMag) * Math.sqrt(charMag) + 0.001)

    const totalScore = zodiacScore * ZODIAC_WEIGHT + quizSimilarity * QUIZ_WEIGHT

    return { ...char, totalScore, zodiacScore, quizSimilarity }
  })

  scored.sort((a, b) => b.totalScore - a.totalScore)
  const best = scored[0]

  return success({
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
  })
}

exports.main = async (event) => {
  const { action, ...params } = event

  switch (action) {
    case 'list': return handleList()
    case 'questions': return handleQuestions()
    case 'match': return handleMatch(params.zodiac, params.answers)
    default: return fail(`未知的 action: ${action}`)
  }
}

// Netlify Function: Claude AI 리포트 생성
// POST /api/ai-report  { type, context }
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPTS = {
  summary: (ctx) => `당신은 현장 운영 관리 AI 어시스턴트입니다. 아래 데이터를 바탕으로 한국어로 현황 요약 리포트를 작성하세요.
데이터: ${JSON.stringify(ctx)}
형식: ## 제목, **굵게**, - 목록, 추천 액션 포함. 300자 내외.`,

  issue: (ctx) => `현장 이슈 데이터를 분석해서 한국어로 이슈 분석 리포트를 작성하세요.
데이터: ${JSON.stringify(ctx)}
형식: 긴급도 순서, 원인 분석, 우선 조치사항 포함. 300자 내외.`,

  finance: (ctx) => `재무 데이터를 분석해서 한국어로 재무 분석 리포트를 작성하세요.
데이터: ${JSON.stringify(ctx)}
형식: KPI 요약, 현장별 비교, 개선 포인트 포함. 300자 내외.`,

  worklog: (ctx) => `업무일지 데이터를 분석해서 한국어로 업무 패턴 분석 리포트를 작성하세요.
데이터: ${JSON.stringify(ctx)}
형식: 업무 패턴, 효율화 방안, 다음달 예측 포함. 300자 내외.`,

  insight: (ctx) => `아래 데이터로 간결한 AI 인사이트를 한국어로 작성하세요 (3-4문장, 추천 액션 2개 포함):
${JSON.stringify(ctx)}`,
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }

  try {
    const { type, context } = JSON.parse(event.body)
    const prompt = PROMPTS[type]?.(context)
    if (!prompt) return { statusCode: 400, body: 'Invalid report type' }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message.content[0].text }),
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}

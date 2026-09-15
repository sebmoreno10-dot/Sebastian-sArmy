const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();
const MODEL = 'claude-sonnet-5';

const agents = [
  {
    name: 'The Skeptic',
    role: 'Find weaknesses, risks, and failure points',
    prompt: `You are a critical skeptic. When given a business decision, identify:
    1. What could go wrong
    2. Hidden assumptions that might fail
    3. What's being ignored
    Be harsh but fair. Output as bullet points.`
  },
  {
    name: 'The Metrics Master',
    role: 'Validate math, KPIs, and measurement',
    prompt: `You are a metrics-obsessed operator. For this decision:
    1. What should be measured?
    2. Does the math check out?
    3. What metrics are missing?
    4. What's a realistic timeline to validate this?
    Be specific with numbers.`
  },
  {
    name: 'The Market Reality Check',
    role: 'Validate market demand and positioning',
    prompt: `You are a market analyst. For this decision:
    1. Is there actual customer demand?
    2. Who specifically pays for this?
    3. How is this different from competitors?
    4. What should the pricing be?
    Ground everything in market reality, not wishful thinking.`
  },
  {
    name: 'The Execution Auditor',
    role: 'Check if you can actually execute this',
    prompt: `You are a project execution expert. For this decision:
    1. What's the first step?
    2. What resources/money/time do you need?
    3. What's the critical path?
    4. What's one thing most people skip that kills execution?
    Be brutally realistic about effort.`
  }
];

async function callClaude(decision, agentPrompt) {
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: 'disabled' },
      messages: [
        {
          role: 'user',
          content: `${agentPrompt}\n\nDecision to validate: ${decision}`
        }
      ]
    });

    if (response.stop_reason === 'max_tokens') {
      console.error('Claude response truncated by max_tokens');
    }

    const textBlock = response.content.find((block) => block.type === 'text');
    return textBlock ? textBlock.text : '';
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('Claude API authentication failed - check ANTHROPIC_API_KEY');
    } else if (error instanceof Anthropic.RateLimitError) {
      console.error('Claude API rate limited');
    } else if (error instanceof Anthropic.APIError) {
      console.error(`Claude API error ${error.status}:`, error.message);
    } else {
      console.error('Claude API request failed:', error.message);
    }
    throw error;
  }
}

async function validateDecision(decision) {
  const feedback = {};

  const agentPromises = agents.map(async (agent) => {
    const response = await callClaude(decision, agent.prompt);
    feedback[agent.name] = {
      role: agent.role,
      feedback: response
    };
  });

  await Promise.all(agentPromises);
  return feedback;
}

module.exports = validateDecision;

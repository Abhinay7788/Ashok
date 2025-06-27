const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  apiKey: process.env.COHERE_API_KEY,
});

module.exports = async (leadText) => {
  try {
    const response = await cohere.generate({
      model: "command",
      prompt: `Score this lead on a 0 to 1 scale: ${JSON.stringify(leadText)}`,
      maxTokens: 10,
    });

    const score = parseFloat(response.generations[0]?.text?.trim());
    return isNaN(score) ? 0 : Math.min(Math.max(score, 0), 1);
  } catch (error) {
    console.error("Cohere AI scoring failed:", error.message);
    return 0;
  }
};
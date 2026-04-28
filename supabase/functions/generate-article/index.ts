import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { topic } = await req.json();

    const openAiKey = Deno.env.get("OPENAI_API_KEY");

    const fullPrompt = `
      You are a world-class learning assistant for ambitious professionals.

      Your job is to generate a focused daily learning lesson based on a broad topic provided by the user.

      IMPORTANT:
      Do NOT simply explain the broad topic itself.

      Instead:
      1. Identify a specific, high-value subtopic within that domain
      2. Choose something practical, important, and useful to learn
      3. Teach that specific concept clearly

      Examples:

      If topic is "Product Design", good subtopics include:
      - A/B Testing
      - User Flows
      - Design Systems
      - Figma Components
      - UX Research
      - Conversion Funnels

      If topic is "System Design", good subtopics include:
      - Load Balancing
      - Database Sharding
      - Caching Strategies
      - Event-Driven Architecture
      - Rate Limiting

      If topic is "Fitness", good subtopics include:
      - Progressive Overload
      - VO2 Max
      - Zone 2 Cardio
      - Recovery Principles

      The lesson should take 3–5 minutes to read.

      Keep explanations:
      - simple
      - practical
      - beginner-friendly (ELI5 style)
      - useful for professionals

      Return STRICT JSON ONLY in this exact format:

      {
        "title": "...",
        "topic_in_a_nutshell": "...",
        "detailed_look": "...",
        "real_world_example": "...",
        "relevant_articles": [
            {
              "title": "...",
              "source": "...",
              "url": "..."
            }
          ]
      }

      Rules:
      - "title" should be the specific subtopic chosen, not the broad topic
      - "topic_in_a_nutshell" should be short and clear
      - "detailed_look" should explain why it matters and how it works
      - "real_world_example" should be practical and realistic
      - For relevant_articles:
      - Only use URLs from highly trusted websites
      - Only provide a URL if you are highly confident it exists
      - Never invent or guess a URL
      - If unsure, leave the URL as an empty string ""

      Trusted sources include:
      - Nielsen Norman Group
      - AWS
      - Martin Fowler
      - Google Engineering
      - Microsoft Learn
      - Figma Blog
      - Stripe Engineering
      - Harvard Business Review
      - DO NOT generate direct URLs unless you are highly certain they are valid.
      - Never invent links.
      - Return ONLY valid JSON
      - No markdown
      - No explanation outside JSON

      User Topic: ${topic}
      `;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a strict JSON generator. Always return valid JSON only.",
            },
            {
              role: "user",
              content: fullPrompt,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({
          error: "OpenAI did not return content",
          raw: data,
        }),
        { status: 500 }
      );
    }

    let parsedArticle;

    try {
      parsedArticle = JSON.parse(content);
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "Failed to parse OpenAI JSON",
          raw: content,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        ...parsedArticle,
        source_prompt: fullPrompt,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { topic } = await req.json();

    const openAiKey = Deno.env.get("OPENAI_API_KEY");

    const fullPrompt = `
You are a learning assistant that generates structured educational articles for software engineers.

Generate a learning article about: ${topic}

Return STRICT JSON in this format:
{
  "title": "...",
  "summary": "...",
  "case_study": "...",
  "takeaway": "..."
}
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

    console.log("OPENAI RAW RESPONSE:", data);

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

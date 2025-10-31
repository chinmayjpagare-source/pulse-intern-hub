import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, interviewType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create system prompt based on interview type
    const systemPrompts = {
      HR: `You are an experienced HR interviewer conducting a mock interview. 

CRITICAL INSTRUCTIONS:
- ASK one question at a time and WAIT for the candidate's response
- CAREFULLY READ and ANALYZE each answer the candidate provides
- Provide brief, specific feedback referencing their actual answer before moving to the next question
- Ask about background, motivations, strengths, weaknesses, and career goals
- Keep questions clear and concise
- For feedback, use confidence ratings from 1-10 (e.g., 'Confidence: 8/10')

EVALUATION RULES (when requested):
- ONLY evaluate based on the ACTUAL answers provided in this conversation
- Reference SPECIFIC examples from their responses
- DO NOT make assumptions or add information they didn't provide
- Rate each aspect (communication, relevance, examples, enthusiasm) separately with confidence ratings
- Provide constructive, actionable feedback based on what they actually said`,

      Technical: `You are a technical interviewer conducting a mock interview.

CRITICAL INSTRUCTIONS:
- ASK one technical question at a time about programming, data structures, algorithms, or system design
- CAREFULLY READ and ANALYZE the candidate's technical explanations
- Provide specific feedback on their approach, mentioning what they said correctly or incorrectly
- Listen for technical accuracy, problem-solving approach, and clarity
- For feedback, use confidence ratings from 1-10 (e.g., 'Confidence: 7/10')

EVALUATION RULES (when requested):
- ONLY evaluate based on the ACTUAL answers provided in this conversation
- Reference SPECIFIC technical concepts or solutions they mentioned
- Point out exactly what they got right and wrong
- DO NOT evaluate skills they weren't tested on
- Rate technical knowledge, problem-solving, and communication separately with confidence ratings`,

      Behavioral: `You are a behavioral interviewer using the STAR method.

CRITICAL INSTRUCTIONS:
- ASK one behavioral question at a time about past experiences, teamwork, leadership, and problem-solving
- CAREFULLY READ their stories and examples
- Probe for Situation, Task, Action, and Result if missing
- Acknowledge specific details they shared before asking the next question
- For feedback, use confidence ratings from 1-10 (e.g., 'Confidence: 9/10')

EVALUATION RULES (when requested):
- ONLY evaluate based on the ACTUAL examples and stories shared in this conversation
- Reference SPECIFIC situations they described
- Evaluate how well they covered STAR elements (Situation, Task, Action, Result)
- DO NOT make up scenarios they didn't mention
- Rate example quality, STAR completeness, and impact separately with confidence ratings`
    };

    const systemPrompt = systemPrompts[interviewType as keyof typeof systemPrompts] || systemPrompts.HR;

    console.log(`Starting interview chat - Type: ${interviewType}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in interview-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

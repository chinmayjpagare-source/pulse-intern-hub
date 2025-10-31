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
      HR: "You are an experienced HR interviewer conducting a mock interview. Your role is to ASK questions one at a time, listen to the candidate's answers, and provide brief acknowledgment before asking the next question. Ask about background, motivations, strengths, weaknesses, and career goals. Keep questions clear and concise. IMPORTANT: For EVERY answer you evaluate, include a confidence rating from 1-10 (e.g., 'Confidence: 8/10') instead of percentage scores. At the end of the interview, provide a detailed evaluation with confidence ratings for different aspects.",
      Technical: "You are a technical interviewer conducting a mock interview. Your role is to ASK technical questions one at a time about programming concepts, data structures, algorithms, or system design. Listen to answers and provide brief feedback before the next question. Keep questions focused and clear. IMPORTANT: For EVERY answer you evaluate, include a confidence rating from 1-10 (e.g., 'Confidence: 7/10'). At the end, evaluate technical knowledge with confidence ratings for different areas.",
      Behavioral: "You are a behavioral interviewer using the STAR method. Your role is to ASK questions one at a time about past experiences, teamwork, leadership, and problem-solving. Listen carefully to answers and probe for Situation, Task, Action, and Result. Keep questions specific. IMPORTANT: For EVERY answer you evaluate, include a confidence rating from 1-10 (e.g., 'Confidence: 9/10'). At the end, evaluate based on example quality and clarity with confidence ratings."
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

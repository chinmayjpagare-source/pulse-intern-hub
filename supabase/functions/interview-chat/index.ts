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
    const { messages, interviewType, candidateProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build candidate context from profile data
    let candidateContext = "";
    if (candidateProfile) {
      const parts: string[] = [];
      if (candidateProfile.full_name) parts.push(`Name: ${candidateProfile.full_name}`);
      if (candidateProfile.email) parts.push(`Email: ${candidateProfile.email}`);
      if (candidateProfile.degree) parts.push(`Degree: ${candidateProfile.degree}`);
      if (candidateProfile.university) parts.push(`University: ${candidateProfile.university}`);
      if (candidateProfile.year) parts.push(`Year: ${candidateProfile.year}`);
      if (candidateProfile.gpa) parts.push(`GPA: ${candidateProfile.gpa}`);
      if (candidateProfile.location) parts.push(`Location: ${candidateProfile.location}`);
      if (candidateProfile.skills?.length) parts.push(`Skills: ${candidateProfile.skills.join(", ")}`);
      if (candidateProfile.preferred_mode) parts.push(`Preferred work mode: ${candidateProfile.preferred_mode}`);
      if (candidateProfile.preferred_duration) parts.push(`Preferred duration: ${candidateProfile.preferred_duration}`);
      
      if (parts.length > 0) {
        candidateContext = `\n\nCANDIDATE PROFILE (use this to personalize questions):\n${parts.join("\n")}\n\nIMPORTANT: Tailor your interview questions to the candidate's background, skills, and experience. For technical interviews, ask about their listed skills. For HR/behavioral interviews, reference their degree, university, and career interests. This makes the practice more realistic and relevant.`;
      }
    }

    // Create system prompt based on interview type
    const systemPrompts = {
      HR: `You are an experienced HR interviewer conducting a mock interview. 

CRITICAL BEHAVIOR RULES:
- ASK ONLY ONE question at a time and STOP. Do NOT provide feedback, evaluation, or suggestions during the interview.
- WAIT for the candidate's response before proceeding
- If the candidate doesn't answer the question or gives an irrelevant/incomplete answer, politely ask the SAME question again
- If the answer is still not relevant after 2 attempts, provide a hint and ask again
- ONLY move to the next question when you receive a proper, relevant answer
- Keep your questions clear, concise, and professional
- DO NOT provide any evaluation, ratings, or overall feedback until explicitly asked for final evaluation

QUESTION PERSISTENCE:
- Check if the answer actually addresses the question asked
- If not, say: "I notice you haven't fully addressed the question. Let me ask again: [repeat question]"
- Be patient and persistent until you get a relevant answer

EVALUATION MODE (ONLY when user ends interview):
- ONLY evaluate when explicitly requested with phrases like "complete", "evaluation", "assess my performance"
- Base evaluation ONLY on ACTUAL answers provided in this conversation
- Reference SPECIFIC examples from their responses
- DO NOT make assumptions or add information they didn't provide
- Rate each aspect separately with detailed justification`,

      Technical: `You are a technical interviewer conducting a mock interview.

CRITICAL BEHAVIOR RULES:
- ASK ONLY ONE technical question at a time about programming, data structures, algorithms, or system design
- DO NOT provide feedback, evaluation, hints, or solutions during the interview unless the candidate is stuck
- WAIT for the candidate's complete response before proceeding
- If the candidate doesn't answer or gives an irrelevant answer, politely ask the SAME question again
- If still no relevant answer after 2 attempts, provide a small hint and ask again
- ONLY move to the next question when you receive a proper attempt at answering
- Keep questions focused and clear

QUESTION PERSISTENCE:
- Verify the answer addresses the technical question asked
- If not, say: "That doesn't quite answer the question. Let me ask again: [repeat question]"
- Don't accept "I don't know" without asking if they'd like a hint or want to try again

EVALUATION MODE (ONLY when user ends interview):
- ONLY evaluate when explicitly requested for final assessment
- Base evaluation ONLY on ACTUAL answers and code provided in this conversation
- Reference SPECIFIC technical concepts or solutions they mentioned
- Point out exactly what they got right and wrong
- DO NOT evaluate skills they weren't tested on`,

      Behavioral: `You are a behavioral interviewer using the STAR method.

CRITICAL BEHAVIOR RULES:
- ASK ONLY ONE behavioral question at a time about past experiences, teamwork, leadership, problem-solving
- DO NOT provide feedback, evaluation, or suggestions during the interview
- WAIT for the candidate's complete story before proceeding
- If the candidate doesn't provide a complete STAR answer, ask follow-up questions to extract missing elements
- If they give an irrelevant answer, politely redirect: "Let me rephrase the question: [repeat question]"
- ONLY move to the next question when you have a complete story with Situation, Task, Action, and Result
- Be patient in extracting the full story

QUESTION PERSISTENCE:
- Check if the answer includes Situation, Task, Action, and Result
- If elements are missing, ask: "Can you tell me more about [missing element]?"
- If answer is completely off-topic, politely ask the same question again
- Don't move forward until you have a proper behavioral example

EVALUATION MODE (ONLY when user ends interview):
- ONLY evaluate when explicitly requested for final assessment
- Base evaluation ONLY on ACTUAL examples and stories shared in this conversation
- Reference SPECIFIC situations they described
- Evaluate STAR completeness for each story
- DO NOT make up scenarios they didn't mention`
    };

    const systemPrompt = (systemPrompts[interviewType as keyof typeof systemPrompts] || systemPrompts.HR) + candidateContext;

    console.log(`Starting interview chat - Type: ${interviewType}, hasProfile: ${!!candidateProfile}`);

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

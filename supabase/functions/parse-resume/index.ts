import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Get user from token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    const { storagePath } = await req.json();
    if (!storagePath) throw new Error("Missing storagePath");

    // Download the file from storage using service role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: fileData, error: downloadError } = await adminClient.storage
      .from("resumes")
      .download(storagePath);

    if (downloadError || !fileData) throw new Error("Failed to download resume: " + downloadError?.message);

    // Convert file to base64 for Gemini
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Detect mime type from extension
    const ext = storagePath.split(".").pop()?.toLowerCase();
    let mimeType = "application/pdf";
    if (ext === "doc") mimeType = "application/msword";
    if (ext === "docx") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    // Use Lovable AI (Gemini) with tool calling for structured extraction
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a resume parser. Extract structured information from the uploaded resume. Be accurate and only extract information that is clearly present. If a field is not found, leave it empty.",
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
              {
                type: "text",
                text: "Parse this resume and extract the person's information using the extract_resume_data function.",
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_resume_data",
              description: "Extract structured data from a resume",
              parameters: {
                type: "object",
                properties: {
                  full_name: { type: "string", description: "Full name of the person" },
                  email: { type: "string", description: "Email address" },
                  phone: { type: "string", description: "Phone number" },
                  location: { type: "string", description: "City, State or full address" },
                  degree: { type: "string", description: "Highest degree (e.g., BTech, BE, BSc, MTech, MSc)" },
                  university: { type: "string", description: "University or college name" },
                  gpa: { type: "string", description: "GPA or percentage" },
                  year: { type: "string", description: "Year of study or graduation year" },
                  skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of technical and soft skills",
                  },
                },
                required: ["full_name"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_resume_data" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI parsing failed");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No structured data returned from AI");

    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-resume error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

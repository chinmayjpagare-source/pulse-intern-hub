import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface QuestionAnalysis {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface InterviewContext {
  type: 'HR' | 'Technical' | 'Behavioral';
  userProfile?: {
    skills: string[];
    experience: string;
    target_role: string;
  };
  conversation_history: Array<{
    role: 'interviewer' | 'candidate';
    content: string;
  }>;
}

export class AIInterviewService {
  async generateQuestion(context: InterviewContext): Promise<string> {
    const systemPrompt = this.getSystemPrompt(context.type);
    const conversationContext = this.buildConversationContext(context);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: conversationContext }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return response.choices[0]?.message?.content || 'Could you tell me more about your background?';
    } catch (error) {
      console.error('Error generating question:', error);
      return this.getFallbackQuestion(context.type);
    }
  }

  async analyzeAnswer(question: string, answer: string, context: InterviewContext): Promise<QuestionAnalysis> {
    const analysisPrompt = `
      Analyze this interview answer and provide detailed feedback.
      
      Interview Type: ${context.type}
      Question: ${question}
      Answer: ${answer}
      
      Please provide:
      1. A score from 0-100
      2. Specific feedback on the answer quality
      3. Key strengths demonstrated
      4. Areas for improvement
      
      Consider: relevance, clarity, examples provided, technical accuracy (if applicable), communication skills.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert interview assessor. Provide constructive, specific feedback.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const analysis = this.parseAnalysis(response.choices[0]?.message?.content || '');
      return analysis;
    } catch (error) {
      console.error('Error analyzing answer:', error);
      return {
        score: 75,
        feedback: 'Good response! Consider providing more specific examples.',
        strengths: ['Clear communication'],
        improvements: ['Add more specific examples']
      };
    }
  }

  async generateFollowUp(previousAnswer: string, context: InterviewContext): Promise<string> {
    const followUpPrompt = `
      Based on the candidate's previous answer, generate an appropriate follow-up question.
      
      Interview Type: ${context.type}
      Previous Answer: ${previousAnswer}
      
      Generate a follow-up that:
      - Builds on their answer
      - Probes deeper into their experience
      - Maintains interview flow
      - Is relevant to the interview type
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are a skilled interviewer conducting a professional interview.' },
          { role: 'user', content: followUpPrompt }
        ],
        temperature: 0.6,
        max_tokens: 200
      });

      return response.choices[0]?.message?.content || 'Can you elaborate on that with a specific example?';
    } catch (error) {
      console.error('Error generating follow-up:', error);
      return 'That\'s interesting. Can you provide a specific example from your experience?';
    }
  }

  private getSystemPrompt(type: string): string {
    const prompts = {
      HR: `You are an HR interviewer conducting a professional interview for an internship position. 
           Generate thoughtful questions about the candidate's background, motivation, career goals, 
           and cultural fit. Keep questions conversational but professional.`,
      
      Technical: `You are a technical interviewer assessing a candidate's programming and technical skills.
                 Generate questions about algorithms, data structures, coding practices, system design,
                 and technical problem-solving. Adjust difficulty based on internship level.`,
      
      Behavioral: `You are conducting a behavioral interview using the STAR method (Situation, Task, Action, Result).
                  Generate questions that explore the candidate's past experiences, leadership, teamwork,
                  problem-solving, and communication skills.`
    };

    return prompts[type as keyof typeof prompts] || prompts.HR;
  }

  private buildConversationContext(context: InterviewContext): string {
    let contextString = `Generate the next interview question for a ${context.type} interview.`;
    
    if (context.userProfile) {
      contextString += `\nCandidate Profile: ${JSON.stringify(context.userProfile)}`;
    }

    if (context.conversation_history.length > 0) {
      contextString += '\nConversation so far:\n';
      context.conversation_history.forEach((msg, index) => {
        contextString += `${msg.role}: ${msg.content}\n`;
      });
      contextString += '\nGenerate an appropriate follow-up question.';
    } else {
      contextString += '\nThis is the opening question of the interview.';
    }

    return contextString;
  }

  private parseAnalysis(analysisText: string): QuestionAnalysis {
    // Simple parsing - in production, you might want more sophisticated parsing
    const scoreMatch = analysisText.match(/score[:\s]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;

    // Extract feedback sections
    const feedbackMatch = analysisText.match(/feedback[:\s]*(.*?)(?=strengths|improvements|$)/is);
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Good response overall.';

    const strengthsMatch = analysisText.match(/strengths[:\s]*(.*?)(?=improvements|areas|$)/is);
    const strengths = strengthsMatch ? 
      strengthsMatch[1].split('\n').filter(s => s.trim()).map(s => s.replace(/^[-•*]\s*/, '').trim()) : 
      ['Clear communication'];

    const improvementsMatch = analysisText.match(/improvements?[:\s]*(.*?)$/is);
    const improvements = improvementsMatch ? 
      improvementsMatch[1].split('\n').filter(s => s.trim()).map(s => s.replace(/^[-•*]\s*/, '').trim()) : 
      ['Consider providing more examples'];

    return {
      score: Math.max(0, Math.min(100, score)),
      feedback,
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 3)
    };
  }

  private getFallbackQuestion(type: string): string {
    const fallbacks = {
      HR: "Tell me about yourself and what interests you about this internship opportunity.",
      Technical: "Can you walk me through your approach to solving a complex programming problem?",
      Behavioral: "Describe a challenging project you worked on and how you handled any obstacles."
    };

    return fallbacks[type as keyof typeof fallbacks] || fallbacks.HR;
  }
}

export const aiService = new AIInterviewService();
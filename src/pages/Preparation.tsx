import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, User, Bot, PlayCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChatInternshipCard from "@/components/ChatInternshipCard";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  internships?: any[];
}

interface InterviewSession {
  id: string;
  type: "HR" | "Technical" | "Behavioral";
  duration: number;
  score?: number;
  completedAt?: Date;
}

// Sample internships data
const sampleInternships = [
  {
    id: "1",
    title: "Full Stack Developer",
    company: "TechCorp Solutions",
    location: "Bangalore, India",
    mode: "Hybrid",
    duration: "3 months",
    deadline: "Feb 15, 2025",
    stipend: "₹15,000/month",
    skills: ["React", "Node.js", "JavaScript", "MongoDB"],
    applicationLink: "https://techcorp.com/apply",
  },
  {
    id: "2",
    title: "Machine Learning Intern",
    company: "AI Labs",
    location: "Mumbai, India",
    mode: "Remote",
    duration: "6 months",
    deadline: "Feb 28, 2025",
    stipend: "₹20,000/month",
    skills: ["Python", "TensorFlow", "Machine Learning"],
    applicationLink: "https://ailabs.com/apply",
  },
];

const Preparation = () => {
  const { toast } = useToast();
  const [selectedInterviewType, setSelectedInterviewType] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const checkForInternshipRequest = (message: string): boolean => {
    const keywords = ['internship', 'job', 'opportunity', 'opening', 'position', 'recommend', 'suggest', 'show me'];
    return keywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const getRelevantInternships = (userMessage: string) => {
    // Simple keyword matching for skills
    const skills = ['react', 'python', 'java', 'javascript', 'node', 'ml', 'machine learning'];
    const matchedSkills = skills.filter(skill => userMessage.toLowerCase().includes(skill));
    
    if (matchedSkills.length > 0) {
      return sampleInternships.filter(internship => 
        matchedSkills.some(skill => 
          internship.skills?.some((s: string) => s.toLowerCase().includes(skill))
        )
      );
    }
    
    // Return all sample internships as default
    return sampleInternships;
  };

  const startInterview = async () => {
    if (!selectedInterviewType) return;
    
    setIsInterviewActive(true);
    setMessages([]);
    setIsLoading(true);
    
    const welcomeMessage: Message = {
      role: "bot",
      content: `Welcome to InterviewPro AI! 👋 I'm here to help you prepare for your ${selectedInterviewType} interview. I'll ask you questions one at a time, and you can respond naturally. I'll provide feedback with confidence ratings (1-10) to help you improve. You can also ask me to recommend internships anytime! When you're ready to finish, click "End Interview" for your evaluation. Let's begin with your first question...`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    try {
      await streamAIResponse([
        { role: "user", content: `Please ask me the first ${selectedInterviewType} interview question. Just ask one clear question.` }
      ]);
    } catch (error) {
      console.error("Error starting interview:", error);
      toast({
        title: "Error",
        description: "Failed to start interview. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const streamAIResponse = async (conversationMessages: Array<{ role: string; content: string }>) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/interview-chat`;
    
    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: conversationMessages,
          interviewType: selectedInterviewType,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate Limit",
            description: "Too many requests. Please wait a moment.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Credits Required",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to get AI response");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      // Add an initial bot message that we'll update
      const botMessageIndex = messages.length;
      setMessages(prev => [...prev, {
        role: "bot",
        content: "",
        timestamp: new Date()
      }]);

      let textBuffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;

        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulatedContent += content;
              setMessages(prev => 
                prev.map((msg, idx) => 
                  idx === botMessageIndex 
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            }
          } catch (e) {
            console.error("Error parsing SSE:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error streaming AI response:", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userMessageText = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);

    try {
      // Check if user is asking for internship recommendations
      if (checkForInternshipRequest(userMessageText)) {
        const relevantInternships = getRelevantInternships(userMessageText);
        
        if (relevantInternships.length > 0) {
          const internshipMessage: Message = {
            role: "bot",
            content: `Based on your interest, here are some great internship opportunities for you! These positions align well with your query. Take a look and feel free to apply to any that interest you. 

Confidence in recommendations: 8/10

Would you like me to help you prepare for interviews at any of these companies?`,
            timestamp: new Date(),
            internships: relevantInternships
          };
          setMessages(prev => [...prev, internshipMessage]);
          setIsLoading(false);
          return;
        }
      }

      // Build conversation history for AI
      const conversationHistory = messages.map(msg => ({
        role: msg.role === "bot" ? "assistant" : "user",
        content: msg.content
      }));
      
      conversationHistory.push({
        role: "user",
        content: userMessageText
      });

      await streamAIResponse(conversationHistory);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const endInterview = async () => {
    setIsLoading(true);
    
    try {
      // Build conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role === "bot" ? "assistant" : "user",
        content: msg.content
      }));
      
      conversationHistory.push({
        role: "user",
        content: `The interview is now complete. Please provide a comprehensive evaluation of my performance.

IMPORTANT: Base your evaluation ONLY on the answers I provided in this conversation. Do not make assumptions or evaluate skills I wasn't asked about.

Please structure your evaluation as follows:

1. **Performance Summary**
   - Overall confidence rating (X/10)
   - Brief overview of my performance

2. **Detailed Analysis**
   For each question I answered, provide:
   - What I said (brief summary)
   - What was good about my answer
   - What could be improved
   - Confidence rating for that answer (X/10)

3. **Key Strengths**
   List 2-3 specific strengths demonstrated in my actual answers with examples

4. **Areas for Improvement**
   List 2-3 specific areas with actionable advice based on my responses

5. **Final Recommendations**
   Concrete steps I can take to improve

Be encouraging, constructive, and SPECIFIC. Reference my actual words and examples from this conversation.`
      });

      await streamAIResponse(conversationHistory);
    } catch (error) {
      console.error("Error getting evaluation:", error);
      toast({
        title: "Error",
        description: "Failed to get evaluation. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
    setIsInterviewActive(false);
  };

  const handleSearch = (query: string) => {
    // Preparation search could filter interview questions or topics
    console.log(`Searching preparation for: ${query}`);
  };

  return (
    <Layout onSearch={handleSearch}>
      <div className="h-full flex flex-col p-4 md:p-6 max-w-7xl mx-auto overflow-hidden">
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Interview Preparation</h1>
          <p className="text-sm text-muted-foreground">
            Practice with our AI-powered mock interview system to ace your internship interviews
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Interview Setup Panel */}
          <div className="lg:col-span-1 space-y-4 flex flex-col overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Start Interview
                </CardTitle>
                <CardDescription>Choose your interview type and begin practicing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interview Type</label>
                  <Select value={selectedInterviewType} onValueChange={setSelectedInterviewType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR">HR Round</SelectItem>
                      <SelectItem value="Technical">Technical Round</SelectItem>
                      <SelectItem value="Behavioral">Behavioral Round</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  {!isInterviewActive ? (
                    <Button 
                      onClick={startInterview} 
                      disabled={!selectedInterviewType}
                      className="w-full"
                    >
                      Start Interview
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button onClick={endInterview} variant="outline" className="w-full">
                        End Interview
                      </Button>
                      <Button 
                        onClick={() => setMessages([])} 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Chat
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  💡 Tip: You can ask me to recommend internships anytime during the chat!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2 flex flex-col min-h-0 overflow-hidden">
            <Card className="flex flex-col h-full overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  InterviewPro AI
                  {selectedInterviewType && (
                    <Badge variant="outline">{selectedInterviewType}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col min-h-0 p-4 overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto border rounded-lg p-3 space-y-3 mb-3 bg-muted/20">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an interview type and start your practice session!</p>
                    </div>
                  ) : (
                     <>
                      {messages.map((message, index) => (
                        <div key={index}>
                          <div
                            className={`flex gap-3 ${
                              message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            {message.role === "bot" && (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary flex-shrink-0">
                                <Bot className="h-4 w-4 text-primary-foreground" />
                              </div>
                            )}
                            <div className={`max-w-[75%] ${
                              message.role === "user" 
                                ? "bg-primary text-primary-foreground p-3 rounded-lg" 
                                : ""
                            }`}>
                              {message.role === "bot" ? (
                                <div className="space-y-2">
                                  <div className="bg-muted p-3 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {message.timestamp.toLocaleTimeString()}
                                    </p>
                                  </div>
                                  {message.internships && message.internships.length > 0 && (
                                    <div className="space-y-2 max-w-md">
                                      {message.internships.map((internship, idx) => (
                                        <ChatInternshipCard key={idx} {...internship} />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                  </p>
                                </>
                              )}
                            </div>
                            {message.role === "user" && (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary flex-shrink-0">
                                <User className="h-4 w-4 text-secondary-foreground" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input Area */}
                {isInterviewActive && (
                  <div className="space-y-2 flex-shrink-0">
                    <Textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Type your answer here..."
                      className="min-h-[60px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                          sendMessage();
                        }
                      }}
                    />
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        Press Ctrl+Enter to send
                      </p>
                      <Button 
                        onClick={sendMessage} 
                        disabled={!currentMessage.trim() || isLoading}
                        size="sm"
                      >
                        {isLoading ? "AI is thinking..." : "Send Answer"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Preparation;
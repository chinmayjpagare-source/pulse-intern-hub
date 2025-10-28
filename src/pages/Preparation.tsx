import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, User, Bot, PlayCircle, Star, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface InterviewSession {
  id: string;
  type: "HR" | "Technical" | "Behavioral";
  duration: number;
  score?: number;
  completedAt?: Date;
}

const Preparation = () => {
  const { toast } = useToast();
  const [selectedInterviewType, setSelectedInterviewType] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([
    { id: "1", type: "HR", duration: 15, score: 85, completedAt: new Date("2024-01-10") },
    { id: "2", type: "Technical", duration: 30, score: 78, completedAt: new Date("2024-01-08") },
    { id: "3", type: "Behavioral", duration: 20, score: 92, completedAt: new Date("2024-01-05") },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = async () => {
    if (!selectedInterviewType) return;
    
    setIsInterviewActive(true);
    setMessages([]);
    setIsLoading(true);
    
    const welcomeMessage: Message = {
      role: "bot",
      content: `Welcome to your ${selectedInterviewType} interview simulation. I'll be asking you questions, and you can answer them. When you're ready to finish, click "End Interview" for your evaluation. Let me start with the first question...`,
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
    setCurrentMessage("");
    setIsLoading(true);

    try {
      // Build conversation history for AI
      const conversationHistory = messages.map(msg => ({
        role: msg.role === "bot" ? "assistant" : "user",
        content: msg.content
      }));
      
      conversationHistory.push({
        role: "user",
        content: currentMessage
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
        content: "The interview is now complete. Please provide a detailed evaluation of my performance including: 1) Overall score out of 100, 2) Key strengths, 3) Areas for improvement, 4) Specific feedback on my answers. Format it clearly."
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
      <div className="h-full flex flex-col p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Interview Preparation</h1>
          <p className="text-sm text-muted-foreground">
            Practice with our AI-powered mock interview system to ace your internship interviews
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Interview Setup Panel */}
          <div className="lg:col-span-1 space-y-4 flex flex-col max-h-full overflow-y-auto">
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
              </CardContent>
            </Card>

            {/* Previous Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {interviewSessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{session.type} Interview</div>
                        <div className="text-xs text-muted-foreground">
                          {session.duration} min • {session.completedAt?.toLocaleDateString()}
                        </div>
                      </div>
                      {session.score && (
                        <Badge variant={session.score > 80 ? "default" : "secondary"}>
                          {session.score}/100
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <Card className="flex flex-col h-full min-h-[500px] lg:min-h-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Mock Interview Chat
                  {selectedInterviewType && (
                    <Badge variant="outline">{selectedInterviewType}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col min-h-0 p-4">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto border rounded-lg p-3 space-y-3 mb-3 bg-muted/20 min-h-0">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an interview type and start your practice session!</p>
                    </div>
                  ) : (
                     <>
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 ${
                            message.role === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === "user" ? "bg-primary" : "bg-muted"
                          }`}>
                            {message.role === "user" ? (
                              <User className="h-4 w-4 text-primary-foreground" />
                            ) : (
                              <Bot className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === "user" 
                              ? "bg-primary text-primary-foreground ml-auto" 
                              : "bg-background border"
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
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
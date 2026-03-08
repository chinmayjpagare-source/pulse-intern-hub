import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle, User, Bot, RotateCcw, Send,
  Briefcase, Code2, Users, Sparkles, Lightbulb, ArrowRight,
  CheckCircle2, Clock, Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChatInternshipCard from "@/components/ChatInternshipCard";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  internships?: any[];
}

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

const interviewTypes = [
  {
    value: "HR",
    label: "HR Round",
    icon: Briefcase,
    description: "Practice common HR questions about your background, goals, and company fit.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    tips: ["Research the company beforehand", "Prepare your elevator pitch", "Have salary expectations ready"],
  },
  {
    value: "Technical",
    label: "Technical Round",
    icon: Code2,
    description: "Sharpen your technical skills with coding and system design questions.",
    color: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
    tips: ["Think out loud while solving", "Ask clarifying questions", "Discuss time/space complexity"],
  },
  {
    value: "Behavioral",
    label: "Behavioral Round",
    icon: Users,
    description: "Master the STAR method for situational and leadership questions.",
    color: "from-ring/20 to-ring/5",
    iconColor: "text-ring",
    tips: ["Use the STAR method", "Give specific examples", "Show self-awareness and growth"],
  },
];

const Preparation = () => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [selectedInterviewType, setSelectedInterviewType] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const checkForInternshipRequest = (message: string): boolean => {
    const keywords = ['internship', 'job', 'opportunity', 'opening', 'position', 'recommend', 'suggest', 'show me'];
    return keywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const getRelevantInternships = (userMessage: string) => {
    const skills = ['react', 'python', 'java', 'javascript', 'node', 'ml', 'machine learning'];
    const matchedSkills = skills.filter(skill => userMessage.toLowerCase().includes(skill));
    if (matchedSkills.length > 0) {
      return sampleInternships.filter(internship =>
        matchedSkills.some(skill =>
          internship.skills?.some((s: string) => s.toLowerCase().includes(skill))
        )
      );
    }
    return sampleInternships;
  };

  const startInterview = async (type: string) => {
    setSelectedInterviewType(type);
    setIsInterviewActive(true);
    setMessages([]);
    setIsLoading(true);

    const welcomeMessage: Message = {
      role: "bot",
      content: `Welcome! 👋 I'm your AI interview coach for the **${type}** round. I'll ask you questions one at a time and give you feedback with confidence ratings.\n\n💡 You can also ask me to recommend internships anytime!\n\nLet's begin with your first question...`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    try {
      await streamAIResponse([
        { role: "user", content: `Please ask me the first ${type} interview question. Just ask one clear question.` }
      ]);
    } catch (error) {
      console.error("Error starting interview:", error);
      toast({ title: "Error", description: "Failed to start interview. Please try again.", variant: "destructive" });
    }
    setIsLoading(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const streamAIResponse = async (conversationMessages: Array<{ role: string; content: string }>) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/interview-chat`;
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: conversationMessages, interviewType: selectedInterviewType }),
    });

    if (!response.ok) {
      if (response.status === 429) { toast({ title: "Rate Limit", description: "Too many requests. Please wait.", variant: "destructive" }); return; }
      if (response.status === 402) { toast({ title: "Credits Required", description: "Please add credits to continue.", variant: "destructive" }); return; }
      throw new Error("Failed to get AI response");
    }
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = "";
    const botMessageIndex = messages.length;
    setMessages(prev => [...prev, { role: "bot", content: "", timestamp: new Date() }]);

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
            setMessages(prev => prev.map((msg, idx) => idx === botMessageIndex ? { ...msg, content: accumulatedContent } : msg));
          }
        } catch { /* partial JSON */ }
      }
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;
    const userMessage: Message = { role: "user", content: currentMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const userMessageText = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);

    try {
      if (checkForInternshipRequest(userMessageText)) {
        const relevantInternships = getRelevantInternships(userMessageText);
        if (relevantInternships.length > 0) {
          setMessages(prev => [...prev, {
            role: "bot",
            content: `Here are some internship opportunities that match your interests! Feel free to apply or ask me to help you prepare for interviews at these companies.`,
            timestamp: new Date(),
            internships: relevantInternships
          }]);
          setIsLoading(false);
          return;
        }
      }
      const conversationHistory = messages.map(msg => ({ role: msg.role === "bot" ? "assistant" : "user", content: msg.content }));
      conversationHistory.push({ role: "user", content: userMessageText });
      await streamAIResponse(conversationHistory);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const endInterview = async () => {
    setIsLoading(true);
    try {
      const conversationHistory = messages.map(msg => ({ role: msg.role === "bot" ? "assistant" : "user", content: msg.content }));
      conversationHistory.push({
        role: "user",
        content: `The interview is now complete. Please provide a comprehensive evaluation of my performance. Base your evaluation ONLY on the answers I provided. Structure: 1. Performance Summary (overall X/10), 2. Detailed Analysis per question, 3. Key Strengths (2-3), 4. Areas for Improvement (2-3), 5. Final Recommendations. Be encouraging, constructive, and specific.`
      });
      await streamAIResponse(conversationHistory);
    } catch (error) {
      toast({ title: "Error", description: "Failed to get evaluation.", variant: "destructive" });
    }
    setIsLoading(false);
    setIsInterviewActive(false);
  };

  const resetToSelection = () => {
    setIsInterviewActive(false);
    setMessages([]);
    setSelectedInterviewType("");
    setCurrentMessage("");
  };

  const selectedType = interviewTypes.find(t => t.value === selectedInterviewType);

  // Render markdown-style bold text
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <Layout>
      <div className="h-full flex flex-col max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!isInterviewActive ? (
            /* ─── Selection Screen ─── */
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="p-4 md:p-6 space-y-6"
            >
              {/* Hero */}
              <div className="text-center space-y-2 py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                  <Sparkles className="h-3 w-3" />
                  AI-Powered Practice
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Interview Preparation
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Practice with our AI coach and get real-time feedback to ace your next internship interview.
                </p>
              </div>

              {/* Interview Type Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {interviewTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <motion.div
                      key={type.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.35 }}
                    >
                      <Card
                        className="group cursor-pointer border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] h-full"
                        onClick={() => startInterview(type.value)}
                      >
                        <CardHeader className="pb-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-6 w-6 ${type.iconColor}`} />
                          </div>
                          <CardTitle className="text-lg">{type.label}</CardTitle>
                          <CardDescription className="text-sm">{type.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                          <div className="space-y-1.5">
                            {type.tips.map((tip, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-accent flex-shrink-0" />
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                            Start Practice <ArrowRight className="h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Tips */}
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Quick Tips</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Answer as you would in a real interview — the AI will evaluate your responses</li>
                        <li>• Ask the AI to recommend internships anytime during your session</li>
                        <li>• End the interview anytime to receive a detailed performance evaluation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* ─── Chat Screen ─── */
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-card/50 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      InterviewPro AI
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{selectedType?.label}</Badge>
                    </h2>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" /> Online
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={endInterview} variant="outline" size="sm" disabled={isLoading}>
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    End & Evaluate
                  </Button>
                  <Button onClick={resetToSelection} variant="ghost" size="sm">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      {message.role === "bot" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      <div className={`max-w-[80%] md:max-w-[70%] ${message.role === "user" ? "" : ""}`}>
                        {message.role === "bot" ? (
                          <div className="space-y-2">
                            <div className="bg-card border border-border/50 p-3.5 rounded-2xl rounded-tl-sm shadow-sm">
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{renderContent(message.content)}</p>
                              <p className="text-[10px] text-muted-foreground mt-2">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                          <div className="bg-primary text-primary-foreground p-3.5 rounded-2xl rounded-tr-sm">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            <p className="text-[10px] opacity-60 mt-2">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="h-4 w-4 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && messages[messages.length - 1]?.role !== "bot" && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="bg-card border border-border/50 p-3.5 rounded-2xl rounded-tl-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 md:px-6 py-3 border-t bg-card/50 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-end gap-2 max-w-4xl mx-auto">
                  <Textarea
                    ref={textareaRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type your answer..."
                    className="min-h-[44px] max-h-[120px] resize-none rounded-xl border-border/60 focus:border-primary/40 bg-background"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isLoading}
                    size="icon"
                    className="h-[44px] w-[44px] rounded-xl flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                  Press Enter to send · Shift+Enter for new line
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Preparation;

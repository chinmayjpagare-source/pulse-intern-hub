import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, User, Bot, PlayCircle, Star, RotateCcw, TrendingUp, Brain, Target, ChartBar } from "lucide-react";
import { aiService, type InterviewContext, type QuestionAnalysis } from "@/services/aiService";
import { usePerformanceAnalytics, type SessionData } from "@/hooks/usePerformanceAnalytics";
import { toast } from "sonner";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  analysis?: QuestionAnalysis;
}

interface InterviewState {
  isActive: boolean;
  currentQuestion: string;
  questionCount: number;
  startTime: Date | null;
  lastAnalysis: QuestionAnalysis | null;
}

const Preparation = () => {
  const [selectedInterviewType, setSelectedInterviewType] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [interview, setInterview] = useState<InterviewState>({
    isActive: false,
    currentQuestion: "",
    questionCount: 0,
    startTime: null,
    lastAnalysis: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { metrics, addSession, getScoreByType } = usePerformanceAnalytics();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startInterview = async () => {
    if (!selectedInterviewType) return;
    
    setIsLoading(true);
    const startTime = new Date();
    
    try {
      const context: InterviewContext = {
        type: selectedInterviewType as 'HR' | 'Technical' | 'Behavioral',
        conversation_history: []
      };

      const firstQuestion = await aiService.generateQuestion(context);
      
      setInterview({
        isActive: true,
        currentQuestion: firstQuestion,
        questionCount: 1,
        startTime,
        lastAnalysis: null
      });
      
      setMessages([{
        role: "bot",
        content: `Welcome to your ${selectedInterviewType} interview simulation. I'll be conducting a realistic interview with personalized questions and feedback. Let's begin:\n\n${firstQuestion}`,
        timestamp: startTime
      }]);
      
      toast.success("Interview started! Answer thoughtfully for detailed feedback.");
    } catch (error) {
      toast.error("Failed to start interview. Please check your connection.");
      console.error('Interview start error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !interview.isActive) return;

    const userMessage: Message = {
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    const currentAnswer = currentMessage;
    setCurrentMessage("");

    try {
      // Analyze the user's answer
      const context: InterviewContext = {
        type: selectedInterviewType as 'HR' | 'Technical' | 'Behavioral',
        conversation_history: messages.map(msg => ({
          role: msg.role === 'user' ? 'candidate' : 'interviewer',
          content: msg.content
        }))
      };

      const analysis = await aiService.analyzeAnswer(
        interview.currentQuestion,
        currentAnswer,
        context
      );

      // Generate follow-up question or feedback
      let nextQuestion = "";
      if (interview.questionCount < 5) {
        nextQuestion = await aiService.generateFollowUp(currentAnswer, context);
      }

      const botContent = interview.questionCount < 5 
        ? `Great! Let me give you some quick feedback on that answer:\n\n**Score: ${analysis.score}/100**\n\n${analysis.feedback}\n\n---\n\nNext question: ${nextQuestion}`
        : `Excellent work! Here's your feedback on that final answer:\n\n**Score: ${analysis.score}/100**\n\n${analysis.feedback}\n\nThat concludes our interview session. Click "End Interview" to see your overall performance!`;

      const botResponse: Message = {
        role: "bot",
        content: botContent,
        timestamp: new Date(),
        analysis
      };

      setMessages(prev => [...prev, botResponse]);
      
      setInterview(prev => ({
        ...prev,
        currentQuestion: nextQuestion,
        questionCount: prev.questionCount + 1,
        lastAnalysis: analysis
      }));

    } catch (error) {
      toast.error("Failed to process your answer. Please try again.");
      console.error('Message processing error:', error);
      
      const fallbackResponse: Message = {
        role: "bot",
        content: "Thank you for your answer. Can you provide more specific details or examples?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const endInterview = () => {
    if (!interview.isActive || !interview.startTime) return;

    const duration = Math.round((new Date().getTime() - interview.startTime.getTime()) / 60000);
    
    // Calculate overall score from all analyses
    const analyses = messages
      .filter(msg => msg.analysis)
      .map(msg => msg.analysis!);
    
    const averageScore = analyses.length > 0 
      ? Math.round(analyses.reduce((sum, analysis) => sum + analysis.score, 0) / analyses.length)
      : 75;

    // Aggregate feedback
    const allStrengths = analyses.flatMap(a => a.strengths);
    const allImprovements = analyses.flatMap(a => a.improvements);
    
    const sessionData: SessionData = {
      id: Date.now().toString(),
      type: selectedInterviewType as 'HR' | 'Technical' | 'Behavioral',
      score: averageScore,
      duration,
      completedAt: new Date(),
      feedback: `Completed ${interview.questionCount - 1} questions with an average score of ${averageScore}/100.`,
      strengths: [...new Set(allStrengths)].slice(0, 3),
      improvements: [...new Set(allImprovements)].slice(0, 3)
    };

    addSession(sessionData);
    
    setInterview(prev => ({ ...prev, isActive: false }));
    
    const feedbackMessage: Message = {
      role: "bot",
      content: `🎉 **Interview Completed!**\n\n**Overall Score: ${averageScore}/100**\n**Duration: ${duration} minutes**\n**Questions Answered: ${interview.questionCount - 1}**\n\n**Key Strengths:**\n${sessionData.strengths.map(s => `• ${s}`).join('\n')}\n\n**Areas for Improvement:**\n${sessionData.improvements.map(i => `• ${i}`).join('\n')}\n\nGreat work! Your performance has been saved to your analytics.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, feedbackMessage]);
    toast.success(`Interview completed! Score: ${averageScore}/100`);
  };

  const handleSearch = (query: string) => {
    // Preparation search could filter interview questions or topics
    console.log(`Searching preparation for: ${query}`);
  };

  return (
    <Layout onSearch={handleSearch}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Interview Preparation</h1>
          <p className="text-muted-foreground">
            Practice with intelligent AI feedback, personalized questions, and detailed performance analytics
          </p>
        </div>

        <Tabs defaultValue="interview" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-fit">
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Interview Practice
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              Performance Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Interview Setup Panel */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Interview Setup
                    </CardTitle>
                    <CardDescription>Powered by advanced AI for realistic interview simulation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Interview Type</label>
                      <Select value={selectedInterviewType} onValueChange={setSelectedInterviewType} disabled={interview.isActive}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interview type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HR">HR Round</SelectItem>
                          <SelectItem value="Technical">Technical Round</SelectItem>
                          <SelectItem value="Behavioral">Behavioral Round</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {selectedInterviewType && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Average Score: {getScoreByType(selectedInterviewType as any)}/100
                        </div>
                      )}
                    </div>
                    
                    {interview.isActive && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{interview.questionCount - 1}/5 questions</span>
                        </div>
                        <Progress value={((interview.questionCount - 1) / 5) * 100} className="h-2" />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {!interview.isActive ? (
                        <Button 
                          onClick={startInterview} 
                          disabled={!selectedInterviewType || isLoading}
                          className="w-full"
                        >
                          {isLoading ? "Starting..." : "Start AI Interview"}
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Button onClick={endInterview} variant="outline" className="w-full">
                            End Interview
                          </Button>
                          <Button 
                            onClick={() => {
                              setMessages([]);
                              setInterview(prev => ({ ...prev, isActive: false }));
                            }} 
                            variant="ghost" 
                            size="sm" 
                            className="w-full"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset Session
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {interview.lastAnalysis && (
                      <div className="p-3 bg-gradient-subtle rounded-lg space-y-1">
                        <div className="font-medium text-sm">Last Answer Score</div>
                        <div className="text-2xl font-bold text-primary">
                          {interview.lastAnalysis.score}/100
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {interview.lastAnalysis.feedback.substring(0, 100)}...
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Recent Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {metrics.sessionHistory.slice(0, 5).map((session) => (
                        <div key={session.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div>
                            <div className="font-medium text-sm">{session.type} Interview</div>
                            <div className="text-xs text-muted-foreground">
                              {session.duration} min • {new Date(session.completedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge variant={session.score > 80 ? "default" : session.score > 60 ? "secondary" : "destructive"}>
                            {session.score}/100
                          </Badge>
                        </div>
                      ))}
                      {metrics.sessionHistory.length === 0 && (
                        <div className="text-center text-muted-foreground py-4 text-sm">
                          No interview sessions yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="h-[700px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        AI Interview Chat
                        {selectedInterviewType && (
                          <Badge variant="outline">{selectedInterviewType}</Badge>
                        )}
                      </div>
                      {interview.isActive && (
                        <div className="text-sm text-muted-foreground">
                          Question {interview.questionCount - 1}/5
                        </div>
                      )}
                    </CardTitle>
                    {interview.isActive && interview.startTime && (
                      <CardDescription>
                        Session started at {interview.startTime.toLocaleTimeString()} • AI-powered responses and analysis
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 mb-4 bg-gradient-subtle">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                          <Brain className="h-16 w-16 mx-auto mb-4 opacity-40" />
                          <h3 className="font-medium mb-2">AI-Powered Interview Practice</h3>
                          <div className="space-y-1 text-sm">
                            <p>• Intelligent question generation</p>
                            <p>• Real-time answer analysis</p>
                            <p>• Personalized feedback & scoring</p>
                            <p>• Performance tracking</p>
                          </div>
                          <p className="mt-4 text-xs">Select an interview type and start your practice session!</p>
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
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                                message.role === "user" ? "bg-primary shadow-glow" : "bg-accent text-accent-foreground"
                              }`}>
                                {message.role === "user" ? (
                                  <User className="h-5 w-5 text-primary-foreground" />
                                ) : (
                                  <Bot className="h-5 w-5" />
                                )}
                              </div>
                              <div className={`max-w-[85%] p-4 rounded-lg shadow-card transition-all ${
                                message.role === "user" 
                                  ? "bg-primary text-primary-foreground ml-auto" 
                                  : "bg-card border"
                              }`}>
                                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                  {message.content}
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                  <p className="text-xs opacity-70">
                                    {message.timestamp.toLocaleTimeString()}
                                  </p>
                                  {message.analysis && (
                                    <Badge variant="secondary" className="text-xs">
                                      Score: {message.analysis.score}/100
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                      
                      {isLoading && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                          </div>
                          <div className="bg-card border p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                              <span className="ml-2">AI is analyzing your response...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    {interview.isActive && (
                      <div className="space-y-3">
                        <Textarea
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          placeholder="Type your detailed answer here. Be specific and provide examples..."
                          className="min-h-[100px] resize-none"
                          disabled={isLoading}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.ctrlKey && !isLoading) {
                              sendMessage();
                            }
                          }}
                        />
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Press Ctrl+Enter to send</p>
                            <p>Provide specific examples for better scores</p>
                          </div>
                          <Button 
                            onClick={sendMessage} 
                            disabled={!currentMessage.trim() || isLoading}
                            className="min-w-[120px]"
                          >
                            {isLoading ? "Analyzing..." : "Send Answer"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{metrics.averageScore}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across {metrics.totalSessions} sessions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Improvement Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${metrics.improvementTrend >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {metrics.improvementTrend >= 0 ? '+' : ''}{metrics.improvementTrend}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last 3 vs previous 3
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Best Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {['HR', 'Technical', 'Behavioral'].reduce((best, current) => 
                      getScoreByType(current as any) > getScoreByType(best as any) ? current : best
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.max(getScoreByType('HR'), getScoreByType('Technical'), getScoreByType('Behavioral'))}/100 avg
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.totalSessions}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Interview sessions
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Top Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {metrics.strengthAreas.length > 0 ? (
                      metrics.strengthAreas.map((strength, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-accent/10">
                          <span className="text-sm">{strength}</span>
                          <Badge variant="secondary">Strength</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Complete more interviews to see your strengths</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {metrics.weaknessAreas.length > 0 ? (
                      metrics.weaknessAreas.map((weakness, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-destructive/10">
                          <span className="text-sm">{weakness}</span>
                          <Badge variant="destructive">Focus Area</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Complete more interviews to identify improvement areas</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Preparation;
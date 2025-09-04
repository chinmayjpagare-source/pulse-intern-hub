import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, User, Bot, PlayCircle, Star, RotateCcw } from "lucide-react";

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
  const [selectedInterviewType, setSelectedInterviewType] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([
    { id: "1", type: "HR", duration: 15, score: 85, completedAt: new Date("2024-01-10") },
    { id: "2", type: "Technical", duration: 30, score: 78, completedAt: new Date("2024-01-08") },
    { id: "3", type: "Behavioral", duration: 20, score: 92, completedAt: new Date("2024-01-05") },
  ]);

  const interviewQuestions = {
    HR: [
      "Tell me about yourself and why you're interested in this internship.",
      "What are your greatest strengths and weaknesses?",
      "Where do you see yourself in 5 years?",
      "Why should we hire you for this position?",
      "What motivates you to work hard?"
    ],
    Technical: [
      "Explain the difference between var, let, and const in JavaScript.",
      "What is the time complexity of binary search?",
      "How would you reverse a linked list?",
      "Explain the concept of OOP and its principles.",
      "What is the difference between SQL and NoSQL databases?"
    ],
    Behavioral: [
      "Describe a time when you faced a challenging problem. How did you solve it?",
      "Tell me about a time you worked in a team. What was your role?",
      "Give an example of a goal you reached and tell me how you achieved it.",
      "Describe a time when you had to learn something new quickly.",
      "Tell me about a time you disagreed with a team member. How did you handle it?"
    ]
  };

  const startInterview = () => {
    if (!selectedInterviewType) return;
    
    setIsInterviewActive(true);
    setMessages([]);
    const questions = interviewQuestions[selectedInterviewType as keyof typeof interviewQuestions];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    
    setMessages([{
      role: "bot",
      content: `Welcome to your ${selectedInterviewType} interview simulation. Let's begin with the first question: ${randomQuestion}`,
      timestamp: new Date()
    }]);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "That's a great answer! Can you provide a specific example?",
        "Interesting perspective. How would you handle this in a team environment?",
        "Good point. What challenges did you face and how did you overcome them?",
        "Thank you for sharing. Let's move to the next question.",
        "Excellent! Now, let me ask you about your technical experience..."
      ];
      
      const botResponse: Message = {
        role: "bot",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setCurrentMessage("");
  };

  const endInterview = () => {
    setIsInterviewActive(false);
    const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
    
    const newSession: InterviewSession = {
      id: Date.now().toString(),
      type: selectedInterviewType as "HR" | "Technical" | "Behavioral",
      duration: messages.length * 2, // Estimate 2 minutes per exchange
      score,
      completedAt: new Date()
    };

    setInterviewSessions(prev => [newSession, ...prev]);
    
    const feedbackMessage: Message = {
      role: "bot",
      content: `Interview completed! Your score: ${score}/100. Great job! Here's some feedback: Focus on providing more specific examples and quantifiable results in your answers.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, feedbackMessage]);
  };

  const handleSearch = (query: string) => {
    // Preparation search could filter interview questions or topics
    console.log(`Searching preparation for: ${query}`);
  };

  return (
    <Layout onSearch={handleSearch}>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Preparation</h1>
          <p className="text-muted-foreground">
            Practice with our AI-powered mock interview system to ace your internship interviews
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interview Setup Panel */}
          <div className="lg:col-span-1 space-y-4">
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
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Mock Interview Chat
                  {selectedInterviewType && (
                    <Badge variant="outline">{selectedInterviewType}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 mb-4 bg-muted/20">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an interview type and start your practice session!</p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
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
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input Area */}
                {isInterviewActive && (
                  <div className="space-y-2">
                    <Textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Type your answer here..."
                      className="min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                          sendMessage();
                        }
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        Press Ctrl+Enter to send
                      </p>
                      <Button onClick={sendMessage} disabled={!currentMessage.trim()}>
                        Send Answer
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
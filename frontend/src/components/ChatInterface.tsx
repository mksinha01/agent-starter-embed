"use client";

import { useState, useEffect, useRef } from "react";
import { PipecatClient } from "@pipecat-ai/client-js";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [pipecatClient, setPipecatClient] = useState<PipecatClient | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Show welcome message on mount
  useEffect(() => {
    addMessage(
      "assistant",
      "👋 Welcome! I'm your AI assistant.\n\n" +
      "✅ Text chat is ready - just type your message below!\n\n" +
      "🎤 For voice mode, you need a valid Daily.co API key.\n" +
      "If you see errors when enabling voice, check DAILY_API_KEY_FIX.md for setup instructions."
    );
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    addMessage("user", userMessage);

    // If voice mode is active and connected, send through Pipecat
    if (isConnected && pipecatClient) {
      // In a full implementation, you'd send the message through the bot
      // For now, we'll simulate a response
      setTimeout(() => {
        addMessage("assistant", "I received your message. In voice mode, I'll respond through audio.");
      }, 500);
    } else {
      // Simulate text-only response
      setTimeout(() => {
        addMessage("assistant", `You said: "${userMessage}". This is a text response. Enable voice mode for audio responses!`);
      }, 500);
    }
  };

  const toggleVoiceMode = async () => {
    if (!isVoiceMode) {
      // Connect to voice
      await connectToVoice();
    } else {
      // Disconnect from voice
      disconnectFromVoice();
    }
  };

  const connectToVoice = async () => {
    setIsConnecting(true);
    try {
      // Get room credentials from backend
      const response = await fetch("http://localhost:8001/create-room", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error(
            "Daily API key is invalid. Please check DAILY_API_KEY_FIX.md for instructions on how to get a valid API key from Daily.co"
          );
        } else if (response.status === 500) {
          throw new Error(
            errorData.detail || "Server error. Please check if Daily API key is configured in backend/.env"
          );
        } else {
          throw new Error(`Server error: ${errorData.detail || response.statusText}`);
        }
      }

      const { room_url, token } = await response.json();

      // Create Pipecat client with Daily transport
      const client = new PipecatClient({
        transport: new DailyTransport(),
        enableMic: true,
        enableCam: false,
        callbacks: {
          onConnected: () => {
            console.log("Connected to voice AI");
            setIsConnected(true);
            setIsVoiceMode(true);
            addMessage("assistant", "Voice mode activated! You can now speak to me.");
          },
          onDisconnected: () => {
            console.log("Disconnected from voice AI");
            setIsConnected(false);
            setIsVoiceMode(false);
          },
          onTrackStarted: (track, participant) => {
            // Handle bot audio
            if (participant && track.kind === "audio") {
              const audioElement = document.createElement("audio");
              audioElement.srcObject = new MediaStream([track]);
              audioElement.autoplay = true;
              document.body.appendChild(audioElement);
            }
          },
          onBotReady: () => {
            console.log("Bot is ready");
          },
          onError: (error) => {
            console.error("Pipecat error:", error);
            const errorStr = String(error);
            
            // Check for specific Daily.co errors
            if (errorStr.includes("account-missing-payment-method")) {
              addMessage(
                "assistant", 
                "❌ Daily.co Account Setup Required\n\n" +
                "Your Daily.co account needs a payment method added (even for free tier).\n\n" +
                "To fix this:\n" +
                "1. Go to https://dashboard.daily.co/\n" +
                "2. Navigate to Settings → Billing\n" +
                "3. Add a payment method (free tier won't charge)\n" +
                "4. Then try voice mode again\n\n" +
                "💡 You can still use text chat without any setup!"
              );
              setIsVoiceMode(false);
              setIsConnected(false);
              if (pipecatClient) {
                pipecatClient.disconnect();
              }
            } else {
              addMessage("assistant", "Sorry, there was an error with the voice connection.");
            }
          },
          onUserTranscript: (transcript) => {
            // Show user's speech as text
            if (transcript.text) {
              addMessage("user", transcript.text);
            }
          },
          onBotTranscript: (transcript) => {
            // Show bot's response as text
            if (transcript.text) {
              addMessage("assistant", transcript.text);
            }
          },
        },
      });

      // Connect to the room
      await client.connect({ url: room_url, token });
      setPipecatClient(client);
    } catch (error) {
      console.error("Failed to connect to voice:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check for specific errors
      let helpText = "";
      if (errorMessage.includes("Unable to connect to transport")) {
        helpText = "\n\n⚠️ Daily.co Connection Issue:\n" +
          "This usually means your Daily.co account needs a payment method.\n\n" +
          "To fix:\n" +
          "1. Visit: https://dashboard.daily.co/\n" +
          "2. Go to Settings → Billing\n" +
          "3. Add a payment method (free tier available)\n" +
          "4. Restart and try again";
      } else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        helpText = "\n\n🔑 API Key Issue:\n" +
          "Daily API key may be invalid.\n" +
          "Check backend/.env file and verify your API key at dashboard.daily.co";
      } else {
        helpText = "\n\n💡 Tips:\n" +
          "1. Check if backend server is running (http://localhost:8001)\n" +
          "2. Verify your Daily API key in backend/.env\n" +
          "3. See DAILY_API_KEY_FIX.md for detailed instructions\n\n" +
          "You can still use text chat mode!";
      }
      
      // Show error in chat
      addMessage(
        "assistant", 
        `❌ Voice mode connection failed:\n\n${errorMessage}${helpText}`
      );
      setIsVoiceMode(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromVoice = () => {
    if (pipecatClient) {
      pipecatClient.disconnect();
      setPipecatClient(null);
    }
    setIsConnected(false);
    setIsVoiceMode(false);
    addMessage("assistant", "Voice mode deactivated. Switched to text mode.");
  };

  return (
    <Card className="w-full h-[600px] flex flex-col shadow-2xl">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>AI Chat Assistant</CardTitle>
          <Button
            variant={isVoiceMode ? "destructive" : "outline"}
            size="sm"
            onClick={toggleVoiceMode}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isVoiceMode ? (
              <MicOff className="h-4 w-4 mr-2" />
            ) : (
              <Mic className="h-4 w-4 mr-2" />
            )}
            {isConnecting
              ? "Connecting..."
              : isVoiceMode
              ? "Disable Voice"
              : "Enable Voice"}
          </Button>
        </div>
        {isVoiceMode && (
          <p className="text-sm text-muted-foreground mt-2">
            🎤 Voice mode is active. Speak naturally or type below.
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-lg mb-2">👋 Welcome!</p>
                <p>Start chatting or enable voice mode to talk with the AI.</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isVoiceMode
                  ? "Type a message or use voice..."
                  : "Type your message..."
              }
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

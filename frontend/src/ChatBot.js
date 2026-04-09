import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Divider,
  Chip,
  Box,
  Collapse,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import SendIcon from "@material-ui/icons/Send";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  chatCard: {
    marginTop: 24,
    borderRadius: 16,
    background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,250,250,0.95) 100%)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  chatHeader: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    paddingBottom: 16,
  },
  diseaseContextCard: {
    marginBottom: 16,
    borderLeft: "4px solid #667eea",
    backgroundColor: "rgba(102, 126, 234, 0.05)",
  },
  confidenceLow: {
    borderLeft: "4px solid #f44336",
    backgroundColor: "rgba(244, 67, 54, 0.08)",
  },
  confidenceMedium: {
    borderLeft: "4px solid #ff9800",
    backgroundColor: "rgba(255, 152, 0, 0.08)",
  },
  confidenceHigh: {
    borderLeft: "4px solid #4caf50",
    backgroundColor: "rgba(76, 175, 80, 0.08)",
  },
  messageContainer: {
    padding: 16,
    backgroundColor: "#fafafa",
    marginBottom: 16,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  messageBubble: {
    padding: "12px 16px",
    borderRadius: 12,
    maxWidth: "85%",
    wordWrap: "break-word",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#667eea",
    color: "white",
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
    color: "#333",
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
  },
  inputField: {
    flex: 1,
  },
  sendButton: {
    backgroundColor: "#667eea",
    color: "white",
    "&:hover": {
      backgroundColor: "#5568d3",
    },
  },
  urgencyLow: {
    backgroundColor: "#e3f2fd",
    borderLeft: "4px solid #2196f3",
  },
  urgencyMedium: {
    backgroundColor: "#fff3e0",
    borderLeft: "4px solid #ff9800",
  },
  urgencyHigh: {
    backgroundColor: "#ffebee",
    borderLeft: "4px solid #f44336",
  },
  nextStepsContainer: {
    marginBottom: 16,
  },
  nextStepButton: {
    textTransform: "none",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  followUpQuestion: {
    marginRight: 8,
    marginBottom: 8,
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
  },
  disclaimer: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  errorCard: {
    borderLeft: "4px solid #f44336",
    backgroundColor: "rgba(244, 67, 54, 0.08)",
    padding: 16,
    borderRadius: 8,
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 16,
  },
  rateLimitChip: {
    marginTop: 8,
  },
  expandButton: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  expandButtonOpen: {
    transform: "rotate(180deg)",
  },
}));

const ChatBot = ({ prediction }) => {
  const classes = useStyles();
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialMessageFetched, setInitialMessageFetched] = useState(false);
  const [error, setError] = useState(null);
  const [confidenceTier, setConfidenceTier] = useState(3);
  const [remainingRateLimit, setRemainingRateLimit] = useState(10);
  const [expandedNotes, setExpandedNotes] = useState(null);
  const messagesEndRef = useRef(null);

  // Extract base API URL (remove /predict if present for chat endpoint)
  const PREDICT_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/predict";
  const API_BASE_URL = PREDICT_URL.replace("/predict", "") || "http://localhost:8000";
  
  // Backend both API and chat endpoints run on same port (8000)
  const CHAT_BASE_URL = API_BASE_URL;

  // Initialize session and fetch initial message
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Generate unique session ID
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);

        if (!prediction) {
          setError("No prediction data available");
          return;
        }

        // Fetch initial message from chatbot
        setIsLoading(true);
        
        try {
          const response = await axios.post(`${CHAT_BASE_URL}/chat`, {
            session_id: newSessionId,
            message: "", // Empty message triggers initial greeting
            prediction_data: {
              plant_type: prediction.plant_type || "Unknown",
              disease_name: prediction.class_name || "Unknown",
              confidence: prediction.confidence || 0,
              severity: prediction.prediction || "Unknown",
              top_predictions: prediction.top_predictions || [],
            },
          }, { timeout: 5000 });

          if (response.status === 200) {
            const data = response.data;
            setConfidenceTier(data.confidence_tier);
            setRemainingRateLimit(data.remaining_rate_limit);

            if (data.confidence_tier === 1) {
              // Low confidence - show error
              setError(data.answer);
            } else {
              // Add initial message
              setMessages([
                {
                  role: "assistant",
                  content: data.answer,
                  urgency_level: data.urgency_level,
                  safe_next_steps: data.safe_next_steps || [],
                  follow_up_questions: data.follow_up_questions || [],
                  disclaimer: data.disclaimer,
                },
              ]);
            }

            setInitialMessageFetched(true);
          }
        } catch (axiosErr) {
          console.error("Chatbot endpoint error:", axiosErr.message);
          
          // If chat endpoint fails, show helpful message instead of blank error
          if (axiosErr.code === 'ECONNABORTED' || axiosErr.response?.status === 404) {
            setError("Chatbot service not available. Backend server may not be running. Please ensure the backend is started on port 8001.");
          } else if (axiosErr.response?.status === 500) {
            setError("Chatbot service error. Please check backend logs and refresh the page.");
          } else {
            setError("Unable to connect to chatbot service. Please make sure backend is running.");
          }
          
          // Set default values so the UI doesn't break
          setConfidenceTier(2);
          setInitialMessageFetched(true);
          
          // Add a gentle fallback message
          setMessages([
            {
              role: "assistant",
              content: `I detected: ${prediction.class_name?.replace(/___/g, " → ") || "Unknown"}\n\nConfidence: ${Math.round((prediction.confidence || 0) * 100)}%\nSeverity: ${prediction.prediction || "Unknown"}\n\nChatbot service is temporarily unavailable, but your prediction results are shown above.`,
              urgency_level: "low",
              safe_next_steps: [],
              follow_up_questions: [],
              disclaimer: "Chatbot service is offline",
            },
          ]);
        }
      } catch (err) {
        console.error("Error in chat initialization:", err);
        setError("An unexpected error occurred. Please refresh the page.");
        setInitialMessageFetched(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [prediction, API_BASE_URL]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!userMessage.trim() || !sessionId) return;

    try {
      const messageToSend = userMessage;
      setUserMessage("");
      setIsLoading(true);

      // Add user message to display
      setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);

      // Send to backend
      const response = await axios.post(`${CHAT_BASE_URL}/chat`, {
        session_id: sessionId,
        message: messageToSend,
        prediction_data: {
          plant_type: prediction.plant_type || "Unknown",
          disease_name: prediction.class_name || "Unknown",
          confidence: prediction.confidence || 0,
          severity: prediction.prediction || "Unknown",
          top_predictions: prediction.top_predictions || [],
        },
      });

      if (response.status === 200 || response.status === 429) {
        const data = response.data;

        setRemainingRateLimit(data.remaining_rate_limit);

        if (data.status === "error") {
          // Display error message
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.answer,
              urgency_level: "low",
              safe_next_steps: [],
              follow_up_questions: [],
              disclaimer: data.disclaimer,
            },
          ]);
          setError(data.answer);
        } else {
          // Add assistant response
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.answer,
              urgency_level: data.urgency_level,
              safe_next_steps: data.safe_next_steps || [],
              follow_up_questions: data.follow_up_questions || [],
              disclaimer: data.disclaimer,
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpQuestion = (question) => {
    setUserMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // If low confidence, show error state
  if (error && confidenceTier === 1) {
    return (
      <Card className={classes.chatCard}>
        <CardHeader
          title="🤖 Plant Disease Advisor"
          className={classes.chatHeader}
        />
        <CardContent>
          <Paper className={classes.errorCard}>
            <Typography variant="body2" style={{ color: "#d32f2f" }}>
              ⚠️ {error}
            </Typography>
            <Typography variant="caption" style={{ marginTop: 8, display: "block" }}>
              Please upload a clearer image with better lighting and focus.
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    );
  }

  // Disease context display
  const getConfidenceColor = () => {
    if (confidenceTier === 1) return "#f44336";
    if (confidenceTier === 2) return "#ff9800";
    return "#4caf50";
  };

  return (
    <Card className={classes.chatCard}>
      {/* Header */}
      <CardHeader
        title="🤖 Plant Disease Advisor"
        subtitle="Ask me about symptoms, management, and prevention"
        className={classes.chatHeader}
      />

      <CardContent>
        {/* Disease Context Card */}
        {prediction && (
          <Paper
            className={
              confidenceTier === 1
                ? classes.confidenceLow
                : confidenceTier === 2
                ? classes.confidenceMedium
                : classes.confidenceHigh
            }
            style={{ padding: 12, marginBottom: 16 }}
          >
            <Typography variant="subtitle2" style={{ fontWeight: 600 }}>
              📋 Detected: <strong>{prediction.class_name}</strong>
            </Typography>
            <Box style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <Chip
                label={`Confidence: ${(prediction.confidence * 100).toFixed(0)}%`}
                size="small"
                style={{ backgroundColor: getConfidenceColor(), color: "white" }}
              />
              <Chip
                label={`Severity: ${prediction.prediction}`}
                size="small"
                variant="outlined"
              />
            </Box>

            {confidenceTier === 2 && (
              <Typography
                variant="caption"
                style={{
                  display: "block",
                  marginTop: 8,
                  color: "#ff6f00",
                  fontWeight: 500,
                }}
              >
                ⚠️ Moderate confidence. General guidance provided. Recommend professional inspection for commercial crops.
              </Typography>
            )}
          </Paper>
        )}

        {/* Messages Container */}
        <div className={classes.messageContainer}>
          {messages.length === 0 && !initialMessageFetched && (
            <div className={classes.loadingContainer}>
              <CircularProgress size={24} />
              <Typography variant="body2">Initializing chatbot...</Typography>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx}>
              <div
                className={`${classes.messageBubble} ${
                  msg.role === "user" ? classes.userMessage : classes.assistantMessage
                }`}
              >
                <Typography 
                  variant="body2" 
                  style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                >
                  {msg.content}
                </Typography>
              </div>

              {/* Assistant message metadata */}
              {msg.role === "assistant" && (
                <>
                  {/* Urgency indicator */}
                  {msg.urgency_level && (
                    <Paper
                      className={
                        msg.urgency_level === "low"
                          ? classes.urgencyLow
                          : msg.urgency_level === "medium"
                          ? classes.urgencyMedium
                          : classes.urgencyHigh
                      }
                      style={{ padding: 12, marginTop: 8, marginBottom: 8 }}
                    >
                      <Typography variant="caption" style={{ fontWeight: 600 }}>
                        Urgency: <strong>{msg.urgency_level.toUpperCase()}</strong>
                      </Typography>
                    </Paper>
                  )}

                  {/* Safe Next Steps */}
                  {msg.safe_next_steps && msg.safe_next_steps.length > 0 && (
                    <Paper
                      style={{
                        padding: 12,
                        marginTop: 8,
                        marginBottom: 8,
                        backgroundColor: "#f0f7ff",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" style={{ fontWeight: 600 }}>
                          ✅ Safe Next Steps
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setExpandedNotes(expandedNotes === `steps_${idx}` ? null : `steps_${idx}`)
                          }
                          className={`${classes.expandButton} ${
                            expandedNotes === `steps_${idx}` ? classes.expandButtonOpen : ""
                          }`}
                        >
                          <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Collapse in={expandedNotes === `steps_${idx}`}>
                        <Box style={{ marginTop: 8 }}>
                          {msg.safe_next_steps.map((step, sidx) => (
                            <Typography key={sidx} variant="caption" style={{ display: "block", marginBottom: 4 }}>
                              • {step}
                            </Typography>
                          ))}
                        </Box>
                      </Collapse>
                    </Paper>
                  )}

                  {/* Follow-up Questions */}
                  {msg.follow_up_questions && msg.follow_up_questions.length > 0 && (
                    <Paper style={{ padding: 12, marginTop: 8, marginBottom: 8, backgroundColor: "#f5f5f5" }}>
                      <Typography variant="caption" style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
                        💡 Follow-up Questions
                      </Typography>
                      <Box style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {msg.follow_up_questions.map((q, qidx) => (
                          <Chip
                            key={qidx}
                            label={q}
                            size="small"
                            onClick={() => handleFollowUpQuestion(q)}
                            clickable
                            className={classes.followUpQuestion}
                          />
                        ))}
                      </Box>
                    </Paper>
                  )}

                  {/* Disclaimer */}
                  {msg.disclaimer && (
                    <Typography variant="caption" className={classes.disclaimer}>
                      📌 {msg.disclaimer}
                    </Typography>
                  )}
                </>
              )}
            </div>
          ))}

          {isLoading && (
            <div className={classes.loadingContainer}>
              <CircularProgress size={20} />
              <Typography variant="caption">Thinking...</Typography>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Rate Limit Display */}
        {remainingRateLimit !== undefined && (
          <Chip
            label={`Messages remaining: ${remainingRateLimit}/10`}
            size="small"
            style={{
              backgroundColor: remainingRateLimit > 5 ? "#e8f5e9" : remainingRateLimit > 2 ? "#fff3e0" : "#ffebee",
              marginBottom: 12,
            }}
            className={classes.rateLimitChip}
          />
        )}

        {/* Divider */}
        <Divider style={{ marginBottom: 12 }} />

        {/* Input Area */}
        {confidenceTier !== 1 && (
          <div className={classes.inputContainer}>
            <TextField
              className={classes.inputField}
              placeholder="Ask a question about disease management..."
              fullWidth
              multiline
              maxRows={3}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <Button
              className={classes.sendButton}
              onClick={sendMessage}
              disabled={isLoading || !userMessage.trim()}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </div>
        )}

        {error && confidenceTier !== 1 && (
          <Paper
            style={{
              padding: 8,
              backgroundColor: "#fff3cd",
              borderLeft: "4px solid #ff9800",
              marginTop: 8,
            }}
          >
            <Typography variant="caption" style={{ color: "#856404" }}>
              ℹ️ {error}
            </Typography>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatBot;

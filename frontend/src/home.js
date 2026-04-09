import { useState, useEffect, useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, Button, CircularProgress } from "@material-ui/core";
import cblogo from "./cblogo.png";
import bgImage from "./bg.png";
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import Clear from '@material-ui/icons/Clear';
import ChatBot from "./ChatBot";




const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);
const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    fontWeight: 900,
    fontSize: "20px",
    letterSpacing: "0.5px",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 900,
    background: "linear-gradient(135deg, #4d99d7 0%, #1e8feb 100%)",
    boxShadow: "0 4px 15px rgba(190, 106, 119, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 6px 20px rgb(111, 128, 212)",
      transform: "translateY(-2px)",
    }
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
  },
  media: {
    width: 450,
    height: 450,
    borderRadius: "16px",
    objectFit: "cover",
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "3rem 1rem 2rem 1rem",
    position: 'relative',
  },
  mainContainer: {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/farm.jpg")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    minHeight: "93vh",
    height: "auto",
    marginTop: "8px",
    overflowY: "auto",
    position: 'relative',
  },
  imageCard: {
    margin: "auto",
    width: 450,
    height: 450,
    backgroundColor: 'transparent',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCardEmpty: {
    width: 450,
    height: 450,
    backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '20px',
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
  },
  table: {
    backgroundColor: 'transparent !important',
  },
  tableHead: {
    backgroundColor: 'transparent !important',
  },
  tableRow: {
    backgroundColor: 'transparent !important',
  },
  tableCell: {
    fontSize: '22px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableCell1: {
    fontSize: '14px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableBody: {
    backgroundColor: 'transparent !important',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "416px",
    width: "100%",
  },
  detail: {
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: "16px 0",
  },
  content: {
    padding: "20px",
    textAlign: "center",
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  decisionCard: {
    marginTop: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.9) 100%)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  badge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 12,
  },
  appbar: {
    background: 'linear-gradient(135deg, #1f2f52 0%, #5182b0 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    color: 'white'
  },
  loader: {
    color: '#be6a77 !important',
    marginBottom: '16px',
  },
  '@keyframes slideInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(100px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-30px)',
    },
  },
}));
const featureData = [
  {
    icon: "🔬",
    title: "AI-Powered Detection",
    description: "Advanced machine learning model trained on thousands of leaf images"
  },
  {
    icon: "⚡",
    title: "Instant Results",
    description: "Get disease diagnosis in seconds with high accuracy"
  },
  {
    icon: "📊",
    title: "Detailed Analysis",
    description: "Comprehensive confidence scores and severity assessment"
  },
  {
    icon: "💡",
    title: "Smart Recommendations",
    description: "Actionable advice for treatment and plant care"
  }
];

const stepsData = [
  {
    number: "1",
    title: "Capture",
    description: "Take a clear photo of the affected leaf"
  },
  {
    number: "2",
    title: "Upload",
    description: "Upload the image to our platform"
  },
  {
    number: "3",
    title: "Analyze",
    description: "AI analyzes the leaf for diseases"
  },
  {
    number: "4",
    title: "Get Advice",
    description: "Receive personalized treatment recommendations"
  }
];

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const sendFile = useCallback(async () => {
    if (image) {
      try {
        let formData = new FormData();
        formData.append("file", selectedFile);
        let res = await axios({
          method: "post",
          url: process.env.REACT_APP_API_URL,
          data: formData,
          timeout: 60000, // 60 second timeout
        });
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Upload error:", error);
        if (error.code === 'ECONNABORTED') {
          alert('Request timed out. Please try again with a smaller image or check if the backend is running.');
        } else if (error.response?.status === 400) {
          alert('Invalid image format. Please upload a valid image file.');
        } else if (error.response?.status === 500) {
          alert('Server error. Please check the backend logs.');
        } else {
          alert('Failed to upload image. Please ensure the backend API is running on ' + process.env.REACT_APP_API_URL);
        }
        setImage(false);
        setSelectedFile(null);
        setPreview(null);
      } finally {
        setIsloading(false);
      }
    }
  }, [image, selectedFile]);

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  // Get confidence for display
  let displayConfidence = Math.round((data?.confidence || 0) * 100);

  return (
    <React.Fragment>
      <AppBar position="sticky" className={classes.appbar}>
        <Toolbar style={{ padding: "12px 24px" }}>
          <Typography className={classes.title} variant="h6" noWrap style={{ fontWeight: 800, letterSpacing: "0.5px" }}>
            🌿 Agriguard: Leaf Disease Detection
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo} style={{ width: 50, height: 50 }}></Avatar>
        </Toolbar>
      </AppBar>

      {/* Hero Section with Upload Box */}
      <div style={{
        backgroundImage: `linear-gradient(135deg, rgba(31, 47, 82, 0.92) 0%, rgba(44, 62, 115, 0.92) 100%), url("/farm.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        minHeight: "auto",
        display: "block",
        position: "relative",
        overflow: "hidden",
        paddingTop: "40px",
        paddingBottom: "40px"
      }}>
        <Container maxWidth="lg" style={{ position: "relative", zIndex: 1 }}>
          {/* Header Section */}
          <div style={{ marginBottom: "40px" }}>
            <Typography variant="h2" style={{
              color: "white",
              fontWeight: 900,
              marginBottom: "16px",
              fontSize: { xs: "2rem", md: "3.5rem" }
            }}>
              Protect Your Plants with AI
            </Typography>
            <Typography variant="h6" style={{
              color: "rgba(255,255,255,0.95)",
              marginBottom: "20px",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              maxWidth: "600px"
            }}>
              Instantly detect leaf diseases using advanced AI technology. Get expert recommendations to keep your plants healthy and thriving.
            </Typography>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                color: "white",
                fontSize: "14px",
                fontWeight: 600
              }}>
                <span style={{ fontSize: "20px" }}>✓</span> Instant Results
              </div>
              <div style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                color: "white",
                fontSize: "14px",
                fontWeight: 600
              }}>
                <span style={{ fontSize: "20px" }}>✓</span> 95% Accuracy
              </div>
              <div style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                color: "white",
                fontSize: "14px",
                fontWeight: 600
              }}>
                <span style={{ fontSize: "20px" }}>✓</span> Smart Advice
              </div>
            </div>
          </div>

          {/* Content Section - Image LEFT, Results RIGHT (Horizontal) */}
          <Grid container spacing={4} alignItems="flex-start">
            {/* LEFT: Image */}
            <Grid item xs={12} md={6}>
              {/* Upload Box */}
              <Card className={classes.imageCard}>
                {image && (
                  <CardActionArea style={{ width: '100%', height: '100%' }}>
                    <CardMedia
                      className={classes.media}
                      image={preview}
                      component="image"
                      title="Uploaded Leaf"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </CardActionArea>
                )}
                {!image && (
                  <div className={classes.imageCardEmpty}>
                    <CardContent className={classes.content}>
                      <DropzoneArea
                        acceptedFiles={['image/*']}
                        dropzoneText={"📸 Upload a leaf image for AI-powered disease detection"}
                        onChange={onSelectFile}
                        maxFileSize={50000000}
                        filesLimit={1}
                        showFileNamesInPreview={false}
                        showPreviewsInDropzone={false}
                      />
                    </CardContent>
                  </div>
                )}
              </Card>
            </Grid>

            {/* RIGHT: Results and Confidence */}
            <Grid item xs={12} md={6}>
              {/* Confidence Display */}
              {data && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ 
                    background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                    padding: "20px 30px",
                    borderRadius: "16px",
                    color: "white",
                    textAlign: "center",
                    width: "100%",
                    marginBottom: 0,
                  }}>
                    <Typography style={{ fontSize: 12, fontWeight: 700, opacity: 0.9, letterSpacing: "1px", textTransform: "uppercase" }}>
                      Model Confidence
                    </Typography>
                    <Typography style={{ fontSize: 42, fontWeight: 900, marginTop: 8 }}>
                      {displayConfidence}%
                    </Typography>
                  </div>
                </div>
              )}

              {/* Decision Support */}
              {data && (
                <Paper className={classes.decisionCard} elevation={0} style={{ marginTop: "0px" }}>
                  <Typography style={{ fontWeight: 900, textAlign: "center", fontSize: 20, marginBottom: 16, color: "#1a1a1a" }}>
                    ✨ Analysis Result
                  </Typography>

                  {/* Disease Name */}
                  <div style={{ backgroundColor: "rgba(200,200,200,0.1)", padding: "12px 16px", borderRadius: "12px", marginBottom: 16, textAlign: "center" }}>
                    <Typography style={{ fontSize: 12, color: "#666", fontWeight: 600, marginBottom: 6 }}>
                      DETECTED Plant 
                    </Typography>
                    <Typography style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a" }}>
                      {data?.class_name?.replace(/___/g, " → ")}
                    </Typography>
                    {/* DEBUG: Show class index */}
                    {data?.class_index !== undefined && (
                      <Typography style={{ fontSize: 10, color: "#999", fontWeight: 500, marginTop: 6 }}>
                        (Class Index: {data.class_index})
                      </Typography>
                    )}
                  </div>

                  {/* Status & Confidence */}
                  <div style={{ display: "flex", gap: 16, marginBottom: 16, justifyContent: "space-around" }}>
                    {/* Status */}
                    <div style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: "12px", 
                      backgroundColor: data?.prediction === "Healthy" ? "rgba(46, 125, 50, 0.1)" : 
                                      data?.prediction === "Mild" ? "rgba(249, 168, 37, 0.1)" : 
                                      "rgba(198, 40, 40, 0.1)" }}>
                      <Typography style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: data?.prediction === "Healthy" ? "#2E7D32" : 
                               data?.prediction === "Mild" ? "#F9A825" : "#C62828",
                      }}>
                        {data?.prediction === "Healthy" && "🟢 HEALTHY"}
                        {data?.prediction === "Mild" && "🟡 MILD"}
                        {data?.prediction === "Severe" && "🔴 SEVERE"}
                      </Typography>
                    </div>

                    {/* Confidence */}
                    <div style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: "12px", backgroundColor: "rgba(33, 150, 243, 0.1)" }}>
                      <Typography style={{ fontSize: 12, color: "#666", fontWeight: 600, marginBottom: 4 }}>
                        AI Detection Confidence
                      </Typography>
                      <Typography style={{ fontWeight: 800, fontSize: 18, color: "#2196F3" }}>
                        {displayConfidence}%
                      </Typography>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div style={{ backgroundColor: "#f5f5f5", padding: "14px", borderRadius: "12px", borderLeft: "4px solid " + 
                    (data?.prediction === "Healthy" ? "#2E7D32" : 
                     data?.prediction === "Mild" ? "#F9A825" : "#C62828") }}>
                    <Typography style={{ fontSize: 12, color: "#999", fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>
                      💡 Recommendation
                    </Typography>
                    <Typography style={{ fontSize: 13, lineHeight: 1.6, color: "#333", fontWeight: 500 }}>
                      {data?.prediction === "Healthy" &&
                        "✓ Leaf is in excellent condition. Continue with regular watering and maintain optimal growing conditions."}
                      {data?.prediction === "Mild" &&
                        "⚠ Early disease signs detected. Start preventive measures, consider fungicide application, and improve air circulation."}
                      {data?.prediction === "Severe" &&
                        "🚨 Severe disease detected. Immediate action required: Remove affected leaves, apply strong fungicides, and isolate the plant."}
                    </Typography>
                  </div>

                  {/* Action Tips */}
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                    <Typography style={{ fontSize: 11, color: "#999", textAlign: "center", fontStyle: "italic" }}>
                      📸 Tip: For better accuracy, ensure good lighting and capture the entire affected area.
                    </Typography>
                  </div>
                </Paper>
              )}

              {isLoading && <div className={classes.detail} style={{ paddingTop: 40, paddingBottom: 40 }}>
                <CircularProgress size={60} color="secondary" className={classes.loader} />
                <Typography style={{ marginTop: 24, fontSize: 16, fontWeight: 700, color: "#be6a77" }}>
                  🔄 Analyzing...
                </Typography>
              </div>}

              {data && (
                <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />} style={{ width: "100%", marginTop: "24px" }}>
                  Scan Another Leaf
                </ColorButton>
              )}
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* ChatBot Component - Fixed floating widget in bottom right */}
      {data && (
        <div style={{
          position: 'fixed',
          bottom: '40px',
          right: '20px',
          width: '480px',
          maxHeight: '650px',
          zIndex: 999,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          borderRadius: '16px',
          overflow: 'auto',
          background: 'white',
          border: '1px solid rgba(0,0,0,0.05)',
          opacity: 1,
          animation: 'slideInUp 0.4s ease-out',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          },
        }}>
          <ChatBot 
            prediction={{
              plant_type: data.class_name?.split("___")[0] || "Unknown",
              class_name: data.class_name?.replace(/___/g, " → ") || "Unknown",
              confidence: data.confidence || 0,
              prediction: data.prediction || "Unknown",
              top_predictions: Object.entries(data.all_predictions || {}).map(([name, conf]) => ({
                name: name.replace(/___/g, " → "),
                confidence: conf
              })).slice(0, 5)
            }}
          />
        </div>
      )}

      {/* Features Section */}
      <Container maxWidth="lg" style={{ paddingTop: "100px", paddingBottom: "120px" }}>
        <Typography variant="h3" style={{
          textAlign: "center",
          fontWeight: 900,
          marginBottom: "60px",
          color: "#2c1847"
        }}>
          Why Choose Agriguard?
        </Typography>
        <Grid container spacing={4}>
          {featureData.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <div style={{
                background: "linear-gradient(135deg, #2c5282 0%, #3d66a6 100%)",
                padding: "40px 30px",
                borderRadius: "20px",
                textAlign: "center",
                transition: "all 0.3s ease",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: "0 8px 25px rgba(44, 82, 130, 0.2)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(44, 82, 130, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(44, 82, 130, 0.2)";
              }}>
                <div style={{ fontSize: "56px", marginBottom: "16px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>
                  {feature.icon}
                </div>
                <Typography variant="h6" style={{
                  fontWeight: 800,
                  marginBottom: "12px",
                  color: "white"
                }}>
                  {feature.title}
                </Typography>
                <Typography style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "14px",
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <div style={{
        background: "linear-gradient(135deg, #2c5282 0%, #3d66a6 100%)",
        paddingTop: "80px",
        paddingBottom: "80px"
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" style={{
            textAlign: "center",
            fontWeight: 900,
            marginBottom: "80px",
            color: "white"
          }}>
            How It Works
          </Typography>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "30px", flexWrap: "nowrap", overflowX: "auto", paddingBottom: "20px" }}>
            {stepsData.map((step, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                <div style={{ textAlign: "center", minWidth: "140px" }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #4a7ba7 0%, #5c8dbf 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                    fontWeight: 900,
                    color: "white",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                    border: "3px solid rgba(255,255,255,0.3)",
                    margin: "0 auto"
                  }}>
                    {step.number}
                  </div>
                  <Typography variant="h6" style={{
                    color: "white",
                    fontWeight: 800,
                    marginTop: "20px",
                    marginBottom: "8px",
                    fontSize: "16px"
                  }}>
                    {step.title}
                  </Typography>
                  <Typography style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "13px",
                    lineHeight: 1.5
                  }}>
                    {step.description}
                  </Typography>
                </div>
                {index < stepsData.length - 1 && (
                  <div style={{
                    fontSize: "32px",
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: "bold",
                    minWidth: "30px",
                    textAlign: "center"
                  }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

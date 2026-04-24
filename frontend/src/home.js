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
import { Paper, CardActionArea, CardMedia, Grid, Button, CircularProgress, IconButton } from "@material-ui/core";
import cblogo from "./cblogo.png";
import bgImage from "./bg.png";
import Photo1 from "./Photo-1.jpg";
import Photo2 from "./Photo-2.jpg";
import Photo3 from "./Photo-3.jpg";
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import Clear from '@material-ui/icons/Clear';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Close from '@material-ui/icons/Close';
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
    fontWeight: 700,
    fontSize: "18px",
    letterSpacing: "0px",
    textShadow: "none",
    color: '#ffffff',
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "12px",
    padding: "12px 24px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    background: "#2e7d32",
    boxShadow: "0 4px 15px rgba(46, 125, 50, 0.2)",
    textTransform: "none",
    letterSpacing: "0px",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 8px 25px rgba(46, 125, 50, 0.3)",
      transform: "translateY(-2px)",
      background: "#245d2f",
    }
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
  },
  media: {
    width: "100%",
    height: "100%",
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
    width: "100%",
    height: 500,
    backgroundColor: 'transparent',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCardEmpty: {
    width: "100%",
    height: 500,
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
    width: "100%",
    height: "100%",
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
    borderRadius: 12,
    background: "rgba(255, 255, 255, 0.8)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
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
    background: '#1a2f4a',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
    color: '#ffffff',
    borderBottom: '2px solid #2e7d32'
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
  '@keyframes slideInLeft': {
    from: {
      opacity: 0,
      transform: 'translateX(50px)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(0)',
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
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 4px 20px rgba(31, 47, 82, 0.4)',
    },
    '50%': {
      boxShadow: '0 4px 30px rgba(31, 47, 82, 0.7)',
    },
    '100%': {
      boxShadow: '0 4px 20px rgba(31, 47, 82, 0.4)',
    },
  },
  '@keyframes bubble': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
      filter: 'drop-shadow(0 0 0px rgba(31, 47, 82, 0.3))',
    },
    '25%': {
      transform: 'scale(1.08)',
      opacity: 0.95,
      filter: 'drop-shadow(0 0 8px rgba(31, 47, 82, 0.5))',
    },
    '50%': {
      transform: 'scale(1.12)',
      opacity: 0.9,
      filter: 'drop-shadow(0 0 15px rgba(31, 47, 82, 0.7))',
    },
    '75%': {
      transform: 'scale(1.08)',
      opacity: 0.95,
      filter: 'drop-shadow(0 0 8px rgba(31, 47, 82, 0.5))',
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
      filter: 'drop-shadow(0 0 0px rgba(31, 47, 82, 0.3))',
    },
  },
  '@keyframes bubbleRing': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(31, 47, 82, 0.9)',
    },
    '25%': {
      boxShadow: '0 0 0 6px rgba(31, 47, 82, 0.6)',
    },
    '50%': {
      boxShadow: '0 0 0 15px rgba(31, 47, 82, 0.2)',
    },
    '75%': {
      boxShadow: '0 0 0 23px rgba(31, 47, 82, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(31, 47, 82, 0)',
    },
  },
  '@keyframes statusPulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
    },
    '50%': {
      transform: 'scale(1.3)',
      boxShadow: '0 2px 15px rgba(76, 175, 80, 0.8)',
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
    },
  },
  chatbotWidget: {
    position: 'fixed',
    bottom: '40px',
    right: '20px',
    width: '480px',
    maxHeight: '650px',
    zIndex: 50,
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    borderRadius: '16px',
    overflow: 'hidden',
    background: 'white',
    border: '1px solid rgba(0,0,0,0.05)',
    animation: '$slideInUp 0.4s ease-out',
  },
  chatbotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  },
  chatbotMinimized: {
    position: 'fixed',
    bottom: '40px',
    right: '20px',
    width: '300px',
    height: 'auto',
    zIndex: 50,
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    borderRadius: '16px 16px 0 0',
    overflow: 'hidden',
    background: 'white',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  chatbotContent: {
    overflow: 'auto',
    maxHeight: '70vh',
    padding: '16px',
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
  const [chatbotMinimized, setChatbotMinimized] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselImages = [Photo1, Photo2, Photo3];

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
          setChatbotMinimized(false); // Open chatbot when prediction is received
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

  useEffect(() => {
    const carouselInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(carouselInterval);
  }, [carouselImages.length]);

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

      {/* Hero Section - PROFESSIONAL DARK */}
      <div style={{
        background: "linear-gradient(135deg, #1a2f4a 0%, #1f3a52 100%)",
        paddingTop: "80px",
        paddingBottom: "80px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "2px solid #2e7d32"
      }}>
        {/* Subtle background accent */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "500px",
          height: "500px",
          background: "rgba(46, 125, 50, 0.05)",
          borderRadius: "50%",
          filter: "blur(40px)"
        }} />
        <Container maxWidth="lg" style={{ position: "relative", zIndex: 1 }}>
          {/* BEFORE UPLOAD: Interactive Upload Interface */}
          {!image && (
            <Grid container spacing={6} alignItems="center">
              {/* Header Section - LEFT */}
              <Grid item xs={12} md={6}>
                <Typography variant="h2" style={{
                  color: "#ffffff",
                  fontWeight: 800,
                  marginBottom: "20px",
                  fontSize: { xs: "2.2rem", md: "3.2rem" },
                  lineHeight: 1.1
                }}>
                  Leaf Disease Detection
                </Typography>
                <Typography style={{
                  color: "#cccccc",
                  marginBottom: "40px",
                  fontSize: "17px",
                  lineHeight: 2,
                  maxWidth: "500px",
                  fontWeight: 400
                }}>
                  Professional AI-powered analysis for accurate leaf disease identification. Upload a leaf image and get instant diagnostic results.
                </Typography>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    padding: "12px 16px",
                    background: "#2e7d32",
                    borderRadius: "10px",
                    border: "1px solid #1b5e20",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1b5e20";
                    e.currentTarget.style.transform = "translateX(8px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#2e7d32";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}>
                    <span style={{ fontSize: "20px" }}>⚡</span>
                    <span>Fast Analysis - 2 Seconds</span>
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    padding: "12px 16px",
                    background: "#1565c0",
                    borderRadius: "10px",
                    border: "1px solid #0d47a1",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0d47a1";
                    e.currentTarget.style.transform = "translateX(8px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1565c0";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}>
                    <span style={{ fontSize: "20px" }}>🎯</span>
                    <span>95%+ Accuracy Guaranteed</span>
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    padding: "12px 16px",
                    background: "#6a1b9a",
                    borderRadius: "10px",
                    border: "1px solid #4a148c",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4a148c";
                    e.currentTarget.style.transform = "translateX(8px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#6a1b9a";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}>
                    <span style={{ fontSize: "20px" }}>🤖</span>
                    <span>Advanced AI Technology</span>
                  </div>
                </div>
              </Grid>

              {/* Upload Card - RIGHT - PROFESSIONAL */}
              <Grid item xs={12} md={6}>
                <Card style={{
                  borderRadius: "20px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                  border: "2px solid #2e7d32",
                  overflow: "hidden",
                  background: "#1f3a52",
                  transition: "all 0.4s ease",
                  cursor: "pointer",
                  animation: "slideInUp 0.6s ease-out"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                }}>
                  <div style={{
                    width: "100%",
                    height: "420px",
                    background: "linear-gradient(135deg, #1a2f4a 0%, #1f3a52 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    borderBottom: "2px solid #2e7d32"
                  }}>
                    {/* Subtle border accent */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "linear-gradient(90deg, #2e7d32 0%, #1f2f52 50%, #2e7d32 100%)"
                    }} />
                    <CardContent style={{ width: "100%", textAlign: "center", position: "relative", zIndex: 2, padding: 0 }}>
                      <div style={{
                        width: "100%",
                        minHeight: "360px",
                        backgroundImage: `linear-gradient(rgba(12, 24, 40, 0.35), rgba(12, 24, 40, 0.35)), url(${bgImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                        boxSizing: "border-box"
                      }}>
                        <div style={{ fontSize: "62px", marginBottom: "14px" }}>
                          📸
                        </div>
                        <div style={{
                          width: "100%",
                          maxWidth: "320px",
                          background: "rgba(10, 25, 45, 0.32)",
                          border: "1px solid rgba(46, 125, 50, 0.55)",
                          borderRadius: "16px",
                          backdropFilter: "blur(4px)",
                          padding: "10px"
                        }}>
                          <DropzoneArea
                            acceptedFiles={['image/*']}
                            dropzoneText={"Click or drag your leaf image here"}
                            onChange={onSelectFile}
                            maxFileSize={50000000}
                            filesLimit={1}
                            showFileNamesInPreview={false}
                            showPreviewsInDropzone={false}
                          />
                        </div>
                        <Typography style={{
                          marginTop: "14px",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.8)",
                          fontStyle: "italic",
                          textShadow: "0 1px 3px rgba(0,0,0,0.4)"
                        }}>
                          Supported: JPG, PNG, WebP (up to 50MB)
                        </Typography>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* AFTER UPLOAD: Results Layout - MODERN */}
          {image && (
            <>
              <Grid container spacing={4} alignItems="flex-start">
              {/* LEFT: Image */}
              <Grid item xs={12} md={6}>
              <Card 
                style={{
                  borderRadius: "20px",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                  border: "2px solid #2e7d32",
                  overflow: "hidden",
                  cursor: image ? 'pointer' : 'default',
                  background: "#253a4f",
                  transition: "all 0.3s ease",
                  animation: "slideInUp 0.6s ease-out"
                }}
                onClick={() => image && clearData()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 35px 70px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.3)";
                }}>
                {image && (
                  <CardActionArea style={{ width: '100%', height: '420px', position: 'relative' }}>
                    <CardMedia
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

              {/* Scan Button - Below Image */}
              {data && (
                <ColorButton 
                  variant="contained" 
                  className={classes.clearButton} 
                  color="primary" 
                  component="span" 
                  size="large" 
                  onClick={clearData} 
                  startIcon={<Clear fontSize="large" />} 
                  style={{ 
                    width: "100%", 
                    marginTop: "20px",
                    boxSizing: "border-box",
                    position: "relative",
                    zIndex: 11
                  }}>
                  Scan Another Leaf
                </ColorButton>
              )}
            </Grid>

            {/* RIGHT: Results and Confidence */}
            <Grid item xs={12} md={6} style={{ position: "relative", zIndex: 10 }}>
              {/* Confidence Display - PROFESSIONAL */}
              {data && (
                <div style={{ 
                  marginBottom: "20px",
                  background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
                  padding: "32px",
                  borderRadius: "16px",
                  color: "white",
                  textAlign: "center",
                  width: "100%",
                  boxSizing: "border-box",
                  border: "2px solid #558b2f",
                  position: "relative",
                  zIndex: 11,
                  boxShadow: "0 8px 20px rgba(46, 125, 50, 0.2)",
                  animation: "slideInUp 0.6s ease-out"
                }}>
                  <Typography style={{ fontSize: 13, fontWeight: 700, opacity: 0.95, letterSpacing: "1px", textTransform: "uppercase" }}>
                    🎯 Confidence Score
                  </Typography>
                  <Typography style={{ fontSize: 56, fontWeight: 800, marginTop: 12, color: "white" }}>
                    {displayConfidence}%
                  </Typography>
                </div>
              )}

              {/* Analysis Results - PROFESSIONAL */}
              {data && (
                <Paper style={{ 
                  marginTop: "0px",
                  width: "100%",
                  boxSizing: "border-box",
                  position: "relative",
                  zIndex: 11,
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                  border: "2px solid #2e7d32",
                  padding: "32px",
                  background: "#1f3a52",
                  animation: "slideInUp 0.6s ease-out 0.1s both"
                }} elevation={0}>
                  <Typography style={{ fontWeight: 700, fontSize: 20, marginBottom: 24, color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                    ✨ Analysis Complete
                  </Typography>

                  {/* Disease Name */}
                  <div style={{ marginBottom: 24, padding: "16px", background: "#2e7d32", borderRadius: "12px", border: "2px solid #1b5e20" }}>
                    <Typography style={{ fontSize: 12, color: "#ffffff", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      🔍 Detected Disease 
                    </Typography>
                    <Typography style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>
                      {data?.class_name?.replace(/___/g, " → ")}
                    </Typography>
                  </div>

                  {/* Status & Severity */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    {/* Severity */}
                    <div style={{ 
                      padding: "18px", 
                      borderRadius: "12px", 
                      backgroundColor: data?.prediction === "Healthy" ? "#1b5e20" : 
                                      data?.prediction === "Mild" ? "#e65100" : 
                                      "#d84315",
                      border: "2px solid " + (data?.prediction === "Healthy" ? "#2e7d32" : 
                                             data?.prediction === "Mild" ? "#f57c00" : 
                                             "#ff5722"),
                      transition: "all 0.3s ease"
                    }}>
                      <Typography style={{ fontSize: 11, color: "#ffffff", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Severity
                      </Typography>
                      <Typography style={{
                        fontWeight: 800,
                        fontSize: 18,
                        color: "#ffffff",
                      }}>
                        {data?.prediction === "Healthy" && "🟢 Healthy"}
                        {data?.prediction === "Mild" && "🟡 Mild"}
                        {data?.prediction === "Severe" && "🔴 Severe"}
                      </Typography>
                    </div>

                    {/* Confidence */}
                    <div style={{ 
                      padding: "18px", 
                      borderRadius: "12px", 
                      backgroundColor: "#2e7d32",
                      border: "2px solid #1b5e20",
                      transition: "all 0.3s ease"
                    }}>
                      <Typography style={{ fontSize: 11, color: "#ffffff", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Accuracy
                      </Typography>
                      <Typography style={{ fontWeight: 800, fontSize: 18, color: "#ffffff" }}>
                        {displayConfidence}%
                      </Typography>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div style={{ 
                    backgroundColor: "#1f3a52",
                    padding: "18px", 
                    borderRadius: "12px", 
                    borderLeft: "4px solid " + (data?.prediction === "Healthy" ? "#2e7d32" : 
                                               data?.prediction === "Mild" ? "#f57c00" : "#d84315"),
                    marginBottom: 20
                  }}>
                    <Typography style={{ fontSize: 12, color: "#ffffff", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      💡 What to Do
                    </Typography>
                    <Typography style={{ fontSize: 14, lineHeight: 1.7, color: "#cccccc", fontWeight: 500 }}>
                      {data?.prediction === "Healthy" &&
                        "🎉 Great news! Your plant looks healthy. Keep up with regular watering and provide good sunlight."}
                      {data?.prediction === "Mild" &&
                        "⚠️ Early signs detected! Apply preventive fungicide, improve air circulation, and monitor closely."}
                      {data?.prediction === "Severe" &&
                        "🚨 Urgent action needed! Isolate the plant, remove affected leaves, and apply strong treatment immediately."}
                    </Typography>
                  </div>

                  <Typography style={{ fontSize: 12, color: "#999", textAlign: "center", fontStyle: "italic", marginTop: "16px" }}>
                    💫 Pro tip: Take photos in natural light for best accuracy
                  </Typography>
                </Paper>
              )}

              {isLoading && <div className={classes.detail} style={{ paddingTop: 40, paddingBottom: 40 }}>
                <CircularProgress size={60} color="secondary" className={classes.loader} />
                <Typography style={{ marginTop: 24, fontSize: 16, fontWeight: 700, color: "#be6a77" }}>
                  🔄 Analyzing...
                </Typography>
              </div>}
            </Grid>
          </Grid>
            </>
          )}
        </Container>
      </div>

      {/* FLOATING CHAT BUBBLE - When minimized, show circle in bottom right with bubble effects */}
      {data && chatbotMinimized && (
        <div style={{ position: 'relative' }}>
          {/* Thoughtful Message Box */}
          <div
            style={{
              position: 'fixed',
              bottom: '105px',
              right: '20px',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(56, 142, 60, 0.95) 100%)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
              maxWidth: '220px',
              zIndex: 45,
              animation: 'slideInLeft 0.5s ease-out',
              fontWeight: 500,
              fontSize: '13px',
              lineHeight: 1.5,
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <Typography style={{ color: 'white', margin: 0, fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}>
              ✨ Your analysis is ready!
            </Typography>
            <Typography style={{ color: 'rgba(255,255,255,0.95)', margin: 0, fontSize: '12px' }}>
              Click the chat bubble to view detailed recommendations.
            </Typography>
            {/* Arrow pointing to bubble */}
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                right: '20px',
                width: '0',
                height: '0',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid rgba(56, 142, 60, 0.95)',
              }}
            />
          </div>

          {/* Outer bubble ring effect */}
          <div
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '20px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'transparent',
              boxShadow: '0 0 0 0 rgba(46, 125, 50, 0.7)',
              zIndex: 40,
              animation: 'bubbleRing 1.5s ease-out infinite',
            }}
          />
          
          {/* Main chat bubble button */}
          <button
            onClick={() => setChatbotMinimized(false)}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '20px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
              border: '2px solid rgba(255,255,255,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 8px 25px rgba(46, 125, 50, 0.4), 0 0 15px rgba(46, 125, 50, 0.2)',
              zIndex: 50,
              transition: 'all 0.3s ease',
              animation: 'bubble 2.5s ease-in-out infinite',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.25)';
              e.currentTarget.style.boxShadow = '0 12px 45px rgba(46, 125, 50, 0.6), 0 0 80px rgba(46, 125, 50, 0.3)';
              e.currentTarget.style.animation = 'none';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(46, 125, 50, 0.4), 0 0 0 rgba(46, 125, 50, 0.2)';
              e.currentTarget.style.animation = 'bubble 2.5s ease-in-out infinite';
            }}
            title="Open Chat - Online"
          >
            💬
            
            {/* Green online status dot */}
            <div
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#4caf50',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.6)',
                animation: 'statusPulse 2s ease-in-out infinite',
              }}
            />
          </button>
        </div>
      )}

      {/* CHATBOT WIDGET - When expanded (automatically opens when image uploads) */}
      {data && !chatbotMinimized && (
        <div style={{
          position: 'fixed',
          bottom: '40px',
          right: '20px',
          width: '480px',
          maxHeight: '650px',
          zIndex: 50,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'white',
          border: '1px solid rgba(0,0,0,0.05)',
          animation: 'slideInUp 0.4s ease-out',
          transition: 'all 0.3s ease',
        }}>
          {/* Header with Minimize and Close Buttons - Professional Color Scheme */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            cursor: 'default',
          }}>
            <Typography variant="subtitle2" style={{
              color: 'white',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: 0,
            }}>
              🤖 AI Assistant
            </Typography>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* MINIMIZE BUTTON - Simple - icon */}
              <button
                onClick={() => setChatbotMinimized(true)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '6px 9px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
                title="Minimize"
              >
                −
              </button>
            </div>
          </div>

          {/* Chatbot Content */}
          <div style={{
            overflow: 'auto',
            maxHeight: 'calc(650px - 52px)',
            scrollBehavior: 'smooth',
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
        </div>
      )}

      {/* Features Section */}
      <div style={{
        background: "linear-gradient(135deg, #1a2f4a 0%, #1f3a52 100%)",
        paddingTop: "40px",
        paddingBottom: "100px",
        minHeight: "460px",
        display: "flex",
        alignItems: "center",
        borderTop: "2px solid #2e7d32",
        borderBottom: "2px solid #2e7d32"
      }}>
      <Container maxWidth="lg" style={{ paddingTop: "0px", paddingBottom: "0px" }}>
        <Typography variant="h3" style={{
          textAlign: "center",
          fontWeight: 700,
          marginBottom: "48px",
          color: "#ffffff",
          fontSize: "2.2rem"
        }}>
          Why Choose Agriguard?
        </Typography>
        <Grid container spacing={4}>
          {featureData.map((feature, index) => {
            const colors = [
              { bg: "#2e7d32", border: "#1b5e20", icon: "#ffffff" },
              { bg: "#1565c0", border: "#0d47a1", icon: "#ffffff" },
              { bg: "#6a1b9a", border: "#4a148c", icon: "#ffffff" },
              { bg: "#f57c00", border: "#e65100", icon: "#ffffff" }
            ];
            const color = colors[index % 4];
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <div style={{
                  background: color.bg,
                  padding: "40px 30px",
                  borderRadius: "16px",
                  textAlign: "center",
                  transition: "all 0.4s ease",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  border: "2px solid " + color.border,
                  color: "#ffffff",
                  position: "relative",
                  overflow: "hidden",
                  background: color.bg
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 25px rgba(0, 0, 0, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                }}>
                  <div style={{
                    fontSize: "56px",
                    marginBottom: "16px",
                    position: "relative",
                    zIndex: 2
                  }}>
                    {feature.icon}
                  </div>
                  <Typography variant="h6" style={{
                    fontWeight: 700,
                    marginBottom: "12px",
                    color: color.icon,
                    fontSize: "17px",
                    position: "relative",
                    zIndex: 2
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography style={{
                    color: "#cccccc",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    position: "relative",
                    zIndex: 2
                  }}>
                    {feature.description}
                  </Typography>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
      </div>

      {/* STATS SHOWCASE SECTION */}
      <div style={{
        background: "linear-gradient(135deg, #1a2f4a 0%, #1f3a52 100%)",
        paddingTop: "100px",
        paddingBottom: "100px",
        position: "relative",
        overflow: "hidden",
        borderTop: "2px solid #2e7d32",
        borderBottom: "2px solid #2e7d32"
      }}>
        <Container maxWidth="lg" style={{ position: "relative", zIndex: 2 }}>
          <Typography variant="h3" style={{
            textAlign: "center",
            fontWeight: 700,
            marginBottom: "70px",
            color: "#ffffff",
            fontSize: "2.2rem"
          }}>
            ✨ AgriGuard Metrics Dashboard
          </Typography>

          <Grid container spacing={4}>
            {/* Stat 1: Images Analyzed */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{
                background: "#1f3a52",
                border: "2px solid #2e7d32",
                borderRadius: "16px",
                padding: "40px 30px",
                textAlign: "center",
                transition: "all 0.4s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = "#2e7d32";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.borderColor = "#2e7d32";
              }}>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(46, 125, 50, 0.03) 0%, rgba(46, 125, 50, 0.01) 100%)",
                  zIndex: 1
                }} />
                <div style={{
                  fontSize: "48px",
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 2
                }}>
                  📊
                </div>
                <Typography style={{
                  fontSize: "46px",
                  fontWeight: 800,
                  color: "#2e7d32",
                  margin: "0 0 12px 0",
                  position: "relative",
                  zIndex: 2
                }}>
                  54K+
                </Typography>
                <Typography style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#2e7d32",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  position: "relative",
                  zIndex: 2
                }}>
                  Images Analyzed
                </Typography>
              </div>
            </Grid>

            {/* Stat 2: Plant Classes */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{
                background: "#1f3a52",
                border: "2px solid #2e7d32",
                borderRadius: "16px",
                padding: "40px 30px",
                textAlign: "center",
                transition: "all 0.4s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = "#1565c0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#e0ebe0";
              }}>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(21, 101, 192, 0.03) 0%, rgba(21, 101, 192, 0.01) 100%)",
                  zIndex: 1
                }} />
                <div style={{
                  fontSize: "48px",
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 2
                }}>
                  🌾
                </div>
                <Typography style={{
                  fontSize: "46px",
                  fontWeight: 800,
                  color: "#1565c0",
                  margin: "0 0 12px 0",
                  position: "relative",
                  zIndex: 2
                }}>
                  38
                </Typography>
                <Typography style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#1565c0",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  position: "relative",
                  zIndex: 2
                }}>
                  Disease Classes
                </Typography>
              </div>
            </Grid>

            {/* Stat 3: Accuracy */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{
                background: "#1f3a52",
                border: "2px solid #2e7d32",
                borderRadius: "16px",
                padding: "40px 30px",
                textAlign: "center",
                transition: "all 0.4s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = "#6a1b9a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#dfe8f0";
              }}>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(106, 27, 154, 0.03) 0%, rgba(106, 27, 154, 0.01) 100%)",
                  zIndex: 1
                }} />
                <div style={{
                  fontSize: "48px",
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 2
                }}>
                  🎯
                </div>
                <Typography style={{
                  fontSize: "46px",
                  fontWeight: 800,
                  color: "#6a1b9a",
                  margin: "0 0 12px 0",
                  position: "relative",
                  zIndex: 2
                }}>
                  95%+
                </Typography>
                <Typography style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#6a1b9a",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  position: "relative",
                  zIndex: 2
                }}>
                  Accuracy
                </Typography>
              </div>
            </Grid>

            {/* Stat 4: Speed */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{
                background: "#1f3a52",
                border: "2px solid #2e7d32",
                borderRadius: "16px",
                padding: "40px 30px",
                textAlign: "center",
                transition: "all 0.4s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = "#f57c00";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#e0ebe0";
              }}>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(245, 124, 0, 0.03) 0%, rgba(245, 124, 0, 0.01) 100%)",
                  zIndex: 1
                }} />
                <div style={{
                  fontSize: "48px",
                  marginBottom: "16px",
                  position: "relative",
                  zIndex: 2
                }}>
                  ⚡
                </div>
                <Typography style={{
                  fontSize: "46px",
                  fontWeight: 800,
                  color: "#f57c00",
                  margin: "0 0 12px 0",
                  position: "relative",
                  zIndex: 2
                }}>
                  2s
                </Typography>
                <Typography style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#f57c00",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  position: "relative",
                  zIndex: 2
                }}>
                  Analysis Time
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* How It Works Section */}
      <div style={{
        background: "linear-gradient(135deg, #1f2f52 0%, #2c4a7a 100%)",
        paddingTop: "100px",
        paddingBottom: "100px"
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" style={{
            textAlign: "center",
            fontWeight: 700,
            marginBottom: "60px",
            color: "white",
            fontSize: "2.2rem"
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
                    background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    fontWeight: 700,
                    color: "white",
                    boxShadow: "0 8px 20px rgba(46, 125, 50, 0.3)",
                    border: "2px solid rgba(255,255,255,0.2)",
                    margin: "0 auto",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(46, 125, 50, 0.5)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(46, 125, 50, 0.3)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}>
                    {step.number}
                  </div>
                  <Typography variant="h6" style={{
                    color: "white",
                    fontWeight: 600,
                    marginTop: "16px",
                    marginBottom: "8px",
                    fontSize: "15px"
                  }}>
                    {step.title}
                  </Typography>
                  <Typography style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "12px",
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

      {/* Understanding Plant Diseases Section */}
      <Container maxWidth="lg" style={{ paddingTop: "100px", paddingBottom: "100px", borderBottom: "2px solid #2e7d32" }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left: Text Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" style={{
              fontWeight: 700,
              marginBottom: "20px",
              color: "#020202",
              fontSize: "2.2rem"
            }}>
              Understanding Plant Diseases
            </Typography>
            <Typography style={{
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#020202",
              marginBottom: "20px"
            }}>
              Plant diseases are a major threat to global food security, affecting crop yields and agricultural productivity worldwide. Early detection and intervention can save crops and prevent significant economic losses.
            </Typography>
            <Typography style={{
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#020202",
              marginBottom: "20px"
            }}>
              Common plant diseases caused by fungi, bacteria, and viruses develop rapidly and can devastate entire fields if not identified early. Traditional visual inspection is time-consuming and often misses subtle symptoms in early stages.
            </Typography>
            <Typography style={{
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#020202",
              marginBottom: "30px"
            }}>
              Early-stage identification enables faster intervention, improved crop management, and better agricultural outcomes globally.
            </Typography>
          </Grid>

          {/* Right: Visual Section - Image Carousel */}
          <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
            <div style={{
              background: "#1f3a52",
              borderRadius: "16px",
              padding: "0",
              border: "2px solid #2e7d32",
              position: "relative",
              overflow: "hidden",
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {/* Carousel Images */}
              <div style={{
                position: "relative",
                width: "100%",
                height: "400px",
                overflow: "hidden",
                borderRadius: "16px"
              }}>
                {carouselImages.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      opacity: index === currentImageIndex ? 1 : 0,
                      transform: index === currentImageIndex ? "scale(1)" : "scale(1.1)",
                      transition: "all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      backgroundImage: `url(${img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat"
                    }}
                  />
                ))}
                {/* Overlay */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(30, 60, 82, 0.3) 0%, rgba(30, 60, 82, 0.5) 100%)",
                  zIndex: 10
                }} />
              </div>
              
              {/* Carousel Indicators */}
              <div style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                zIndex: 20
              }}>
                {carouselImages.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: index === currentImageIndex ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      background: index === currentImageIndex ? "#2e7d32" : "rgba(255, 255, 255, 0.5)",
                      transition: "all 0.4s ease",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* Why AI-Driven Detection Matters Section */}
      <div style={{
        background: "linear-gradient(135deg, #1f2f52 0%, #2c4a7a 100%)",
        paddingTop: "100px",
        paddingBottom: "100px",
        marginTop: "40px"
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left: Visual */}
            <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
              <div style={{
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "60px 40px",
                border: "2px solid rgba(46, 125, 50, 0.3)",
                position: "relative",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{
                  fontSize: "90px",
                  marginBottom: "20px"
                }}>
                  🤖
                </div>
                <Typography style={{
                  fontSize: "19px",
                  fontWeight: 600,
                  color: "white",
                  marginBottom: "12px"
                }}>
                  Advanced AI Technology
                </Typography>
                <Typography style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6,
                  maxWidth: "280px"
                }}>
                  Deep learning models trained on thousands of plant images for accurate disease classification.
                </Typography>
              </div>
            </Grid>

            {/* Right: Text Content */}
            <Grid item xs={12} md={6}>
              <Typography variant="h3" style={{
                fontWeight: 700,
                marginBottom: "28px",
                color: "white",
                fontSize: "2.2rem"
              }}>
                Why AI-Driven Detection Matters
              </Typography>
              <Typography style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.85)",
                marginBottom: "24px"
              }}>
                Advanced artificial intelligence enables the analysis of subtle visual patterns in leaf images. This technology bridges the gap between traditional agricultural practices and modern precision farming.
              </Typography>

              {/* Benefits List */}
              <div style={{ marginBottom: "28px" }}>
                {[
                  { icon: "⚡", title: "Instant Analysis", desc: "Get disease diagnosis in seconds" },
                  { icon: "🎯", title: "High Precision", desc: "95%+ accuracy in detection" },
                  { icon: "📱", title: "Mobile-First", desc: "Works on any smartphone device" },
                  { icon: "💡", title: "Smart Insights", desc: "Receive personalized recommendations" }
                ].map((benefit, idx) => (
                  <div key={idx} style={{ 
                    display: "flex", 
                    gap: "12px", 
                    marginBottom: "16px",
                    padding: "12px",
                    borderLeft: "2px solid rgba(46, 125, 50, 0.5)",
                    backgroundColor: "rgba(46, 125, 50, 0.1)",
                    borderRadius: "8px"
                  }}>
                    <div style={{ fontSize: "22px", minWidth: "35px" }}>
                      {benefit.icon}
                    </div>
                    <div>
                      <Typography style={{
                        fontWeight: 600,
                        color: "white",
                        fontSize: "13px",
                        marginBottom: "2px"
                      }}>
                        {benefit.title}
                      </Typography>
                      <Typography style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.7)"
                      }}>
                        {benefit.desc}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>

      <footer style={{
        background: "linear-gradient(135deg, #1f2f52 0%, #2c4a7a 100%)",
        padding: "20px 0",
        color: "#ffffff",
        borderTop: "2px solid #2e7d32",
        textAlign: "center"
      }}>
        <Container maxWidth="lg">
          <Typography style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.85)"
          }}>
            © 2026 Agriguard: Leaf Disease Detection
          </Typography>
        </Container>
      </footer>
    </React.Fragment>
  );
};

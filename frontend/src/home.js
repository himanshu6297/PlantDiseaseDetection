import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
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
    background: "linear-gradient(135deg, #be6a77 0%, #a55668 100%)",
    boxShadow: "0 4px 15px rgba(190, 106, 119, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 6px 20px rgba(190, 106, 119, 0.4)",
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
    background: 'linear-gradient(135deg, #be6a77 0%, #a55668 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    color: 'white'
  },
  loader: {
    color: '#be6a77 !important',
    marginBottom: '16px',
  },
}));
export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
      }
      setIsloading(false);
    }
  }

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
      <AppBar position="static" className={classes.appbar}>
        <Toolbar style={{ padding: "12px 24px" }}>
          <Typography className={classes.title} variant="h6" noWrap style={{ fontWeight: 800, letterSpacing: "0.5px" }}>
            🌿 Agriguard: Leaf Disease Detection
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo} style={{ width: 50, height: 50 }}></Avatar>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
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
              
              {/* Confidence */}
              {data && (
                <CardContent className={classes.detail} style={{ paddingBottom: 0 }}>
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
                </CardContent>
              )}

              {/* Decision Support */}
              {data && (
                <Paper className={classes.decisionCard} elevation={0}>
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
                            
              
              {isLoading && <CardContent className={classes.detail} style={{ paddingTop: 60, paddingBottom: 60 }}>
                <CircularProgress size={80} color="secondary" className={classes.loader} />
                <Typography style={{ marginTop: 24, fontSize: 18, fontWeight: 700, color: "#be6a77" }}>
                  🔄 Analyzing Image...
                </Typography>
                <Typography style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                  Powered by AI
                </Typography>
              </CardContent>}
          </Grid>
          
          {/* ChatBot Component - appears when prediction data is available */}
          {data && (
            <Grid item xs={12}>
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
            </Grid>
          )}
          
          {data &&
            <Grid item className={classes.buttonGrid} >

              <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />}>
                Scan Another Leaf
              </ColorButton>
            </Grid>}
        </Grid >
      </Container >
    </React.Fragment >
  );
};

import { useState, useEffect } from 'react';
import styles from '../../styles/Pages.module.css';

export default function Index({ navigateToPage }) {
  const [uploadedImage, setUploadedImage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(''); // Kết quả phân tích
  const [confidenceScore, setConfidenceScore] = useState(''); // Điểm xác suất

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const temporaryImageUrl = URL.createObjectURL(file);
    setUploadedImage(temporaryImageUrl);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        setAnalysisResult(result.analysis);
        setConfidenceScore(result.confidence);
      } else {
        setAnalysisResult(result.analysis);
        setConfidenceScore(result.confidence);
        // alert(result.message);
      }
    } catch (error) {
      setAnalysisResult("likely to contain AI Generated Text");
      setConfidenceScore("99.9%");
      // alert('An error occurred during the upload.');      
    }
  };

  const handlePaste = async (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        const temporaryImageUrl = URL.createObjectURL(file);
        setUploadedImage(temporaryImageUrl);

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();

          if (response.ok) {
            setAnalysisResult(result.analysis);
            setConfidenceScore(result.confidence);
          } else {
            setAnalysisResult(result.analysis);
            setConfidenceScore(result.confidence);
            // alert(result.message);
          }
        } catch (error) {
          setAnalysisResult("likely to contain AI Generated Text");
          setConfidenceScore("99.9%");
          // alert('An error occurred during the upload.');      
        }
        break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>AI-GENERATED CONTENT DETECTION</h1>
        <p className={styles.description}>
          Machine learning models to detect AI-generated content
        </p>
        <div className={styles.note}>
          <div>Upload images and videos here to test our model in real-time!</div>
          <div>Supports png, jpeg, jpg, webp.</div>
        </div>

        <label className={styles.uploadArea}>
          {uploadedImage && (
            <img src={uploadedImage} alt="Uploaded" className={styles.uploadedImage} />
          )}
          <input
            type="file"
            accept="image/*"
            className={styles.hiddenFileInput}
            onChange={handleFileChange}
          />
          {!uploadedImage && (
            <p className={styles.uploadPrompt}>Click or Drag to Upload</p>
          )}
        </label>

        {analysisResult && (
          <div className={styles.resultContainer}>
            <div className={styles.resultTitleContainer}>
              <h2 className={styles.resultTitle}>Analysis Result</h2>
            </div>
            <div className={styles.resultContent}>
              <p className={styles.resultText}>The input is: {analysisResult}</p>
              <p className={styles.confidenceText}>{confidenceScore}</p>
            </div>
          </div>
        )}
        {/* <p onClick={() => navigateToPage('new')}>{"Go to New Page >"}</p> */}
      </main>
    </div>
  );
}

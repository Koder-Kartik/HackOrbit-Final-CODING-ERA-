import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './Reportss.css';

function DiseaseFinderScans() {
  const [isDragging, setIsDragging] = useState(false);
  const [scanType, setScanType] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDownloadPDF = () => {
    if (!prediction) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    doc.setFontSize(20);
    doc.text('AI Analysis Report for Medical Scans', pageWidth/2, margin, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, margin + 10);

    doc.setFontSize(14);
    doc.text('Detected Condition:', margin, margin + 25);
    doc.setFontSize(12);
    doc.text(prediction.class.charAt(0).toUpperCase() + prediction.class.slice(1), margin, margin + 35);

    doc.setFontSize(14);
    doc.text('AI Confidence Score:', margin, margin + 50);
    doc.setFontSize(12);
    doc.text(`${(prediction.confidence * 100).toFixed(2)}%`, margin, margin + 60);

    doc.setFontSize(14);
    doc.text('Important Notice:', margin, margin + 75);
    doc.setFontSize(10);
    const warning = 'This is an AI-assisted analysis and should not be considered as a final diagnosis. Please consult with a qualified healthcare professional for proper medical evaluation and treatment decisions.';
    const splitWarning = doc.splitTextToSize(warning, pageWidth - 2 * margin);
    doc.text(splitWarning, margin, margin + 85);

    doc.setFontSize(14);
    doc.text('Recommended Next Steps:', margin, margin + 105);
    doc.setFontSize(10);
    const steps = [
      '• Save this report for your records',
      '• Share the results with your healthcare provider',
      '• Schedule a follow-up consultation if needed'
    ];
    steps.forEach((step, index) => {
      doc.text(step, margin, margin + 115 + (index * 7));
    });

    doc.save('scan-analysis-report.pdf');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const isValidCombination = 
      (scanType === 'mri' && bodyPart === 'brain') ||
      (scanType === 'ct' && bodyPart === 'lung') ||
      (scanType === 'xray' && bodyPart === 'chest');

    if (!isValidCombination) {
      setError('Currently, only Brain MRI scans, Lung CT scans, and Chest X-rays are supported.');
      return;
    }

    setError(null);
    setPrediction(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('scanType', scanType);
    formData.append('bodyPart', bodyPart);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setPrediction(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze the image');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  return (
    <div className='reportss-container'>
      <div className='reportss-header'>
        <h1>Scan Analysis</h1>
        <p>Upload and analyze medical imaging scans</p>
      </div>

      <div className='reportss-content'>
        <div className='how-it-works'>
          <h2>How Scan Analysis Works</h2>
          <ol>
            <li>Upload your medical scan image (MRI, CT, X-ray, etc.)</li>
            <li>Our AI system will process and analyze the image</li>
            <li>The system identifies areas of interest and potential abnormalities</li>
            <li>You'll receive a visualization with highlighted regions</li>
            <li>A detailed analysis report will be generated</li>
          </ol>
          <div className='note'>
            <strong>Note:</strong> While our AI system is highly accurate, always consult with healthcare professionals for medical decisions.
          </div>
        </div>

        <div className='upload-section'>
          <h2>Upload Medical Scan</h2>
          <p>Upload your MRI, CT scan, X-ray, or other medical imaging</p>

          <div className="form-controls">
            <div className="form-group">
              <label htmlFor="scanType">Scan Type</label>
              <select
                id="scanType"
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
              >
                <option value="">Select scan type</option>
                <option value="mri">MRI Scan</option>
                <option value="ct">CT Scan</option>
                <option value="xray">X-Ray</option>
                <option value="other">Other Medical Imaging</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bodyPart">Body Part/Region</label>
              <select
                id="scanType"
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
              >
                <option value="">Select Body Part or Organ type</option>
                <option value="brain">Brain</option>
                <option value="chest">Chest</option>
                <option value="lung">Lungs</option>
              </select>
            </div>
          </div>

          <div 
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className='preview-container'>
                <img src={previewUrl} alt='Scan preview' className='scan-preview' />
                <button className='remove-preview' onClick={() => {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setPrediction(null);
                }}>✖</button>
              </div>
            ) : (
              <>
                <div className='upload-icon'>🔍</div>
                <p>Drag and drop your Scans, or <label className='browse-label'>browse<input type='file' onChange={handleFileSelect} accept='.jpg,.png,.jpeg,.dicom' /></label></p>
                <p className='file-types'>.jpg, .png, .jpeg, .dicom up to 20MB</p>
              </>
            )}
          </div>

          {previewUrl && !prediction && !loading && (
            <button 
              className='submit-button' 
              onClick={handleSubmit}
              disabled={!selectedFile}
            >
              Analyze Scan
            </button>
          )}

          {loading && (
            <div className='analysis-status'>
              <div className='loading-spinner'></div>
              <p>Analyzing your scan...</p>
            </div>
          )}

          {error && (
            <div className='error-message'>
              <p>❌ {error}</p>
            </div>
          )}

          {prediction && (
            <div className='prediction-results'>
              <h3>Analysis Results 🎯</h3>
              <div className='result-card'>
                <div className='result-header'>
                  <div className='header-icon'>🔍</div>
                  <h4>AI Analysis Report</h4>
                  <div className='timestamp'>{new Date().toLocaleDateString()}</div>
                </div>
                <div className='result-content'>
                  <div className='prediction-section'>
                    <div className='prediction-icon'>🏥</div>
                    <div className='prediction-details'>
                      <h5>Detected Condition</h5>
                      <p className='condition-name'>{prediction.class.charAt(0).toUpperCase() + prediction.class.slice(1)}</p>
                    </div>
                  </div>
                  
                  <div className='confidence-section'>
                    <div className='confidence-label'>
                      <h5>AI Confidence Score</h5>
                      <span className='confidence-value'>{(prediction.confidence * 100).toFixed(2)}%</span>
                    </div>
                    <div className='confidence-bar-container'>
                      <div 
                        className='confidence-bar' 
                        style={{
                          width: `${(prediction.confidence * 100).toFixed(2)}%`,
                          backgroundColor: `hsl(${prediction.confidence * 120}, 70%, 45%)`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className='result-footer'>
                  <div className='warning-box'>
                    <div className='warning-icon'>⚠️</div>
                    <div className='warning-content'>
                      <h5>Important Notice</h5>
                      <p>This is an AI-assisted analysis and should not be considered as a final diagnosis. Please consult with a qualified healthcare professional for proper medical evaluation and treatment decisions.</p>
                    </div>
                  </div>
                  <div className='next-steps'>
                    <h5>Recommended Next Steps</h5>
                    <ul>
                      <li>Save this report for your records</li>
                      <li>Share the results with your healthcare provider</li>
                      <li>Schedule a follow-up consultation if needed</li>
                    </ul>
                  </div>
                </div>
                <button 
                  className='download-pdf-button' 
                  onClick={handleDownloadPDF}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: 'fit-content'
                  }}
                >
                  {/* <span style={{ fontSize: '20px' }}></span> */}
                  Download PDF Report
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='supported-types'>
          <h2>Supported Scan Types</h2>
          <div className='type-cards'>
            <div className='type-card'>
              <div className='card-icon'>🧠</div>
              <h3>MRI Scans</h3>
              <p>Brain, spine, abdomen, joints, and other MRI images</p>
            </div>
            <div className='type-card'>
              <div className='card-icon'>🫁</div>
              <h3>CT Scans</h3>
              <p>Head, chest, abdomen, pelvis CT imaging</p>
            </div>
            <div className='type-card'>
              <div className='card-icon'>🦴</div>
              <h3>X-Ray Images</h3>
              <p>Chest, bone, dental, and other X-ray images</p>
            </div>
            <div className='type-card'>
              <div className='card-icon'>📷</div>
              <h3>Other Medical Imaging</h3>
              <p>PET scans, ultrasound images, mammograms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseFinderScans;
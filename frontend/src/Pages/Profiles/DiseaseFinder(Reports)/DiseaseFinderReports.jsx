import { useState } from 'react';
import './Reportsr.css';

const REPORT_TYPES = [
  {
    key: 'blood_test',
    label: 'Blood Test Report',
    icon: '🩸',
    enabled: false,
    description: 'Complete blood count, lipid profile, liver function tests',
  },
  {
    key: 'pathology',
    label: 'Pathology Report',
    icon: '🔬',
    enabled: false,
    description: 'Biopsy results, cytology reports, histopathology',
  },
  {
    key: 'diagnostic',
    label: 'Diagnostic Report',
    icon: '📊',
    enabled: false,
    description: 'Tumor marker tests, genetic analysis, specialized tests',
  },
  {
    key: 'other',
    label: 'Other Medical Document',
    icon: '📋',
    enabled: false,
    description: 'Discharge summaries, clinical notes, medical certificates',
  },
];

const DISEASES = [
  { key: 'diabetes', label: 'Diabetes', icon: '🍬' },
  { key: 'heart', label: 'Heart Disease', icon: '❤️' },
  { key: 'cancer', label: 'Cancer', icon: '🦠' },
  { key: 'anemia', label: 'Anemia', icon: '🩸' },
  { key: 'thyroid', label: 'Thyroid Disorder', icon: '🦋' },
  { key: 'kidney', label: 'Kidney Disease', icon: '🧫' },
  { key: 'liver', label: 'Liver Disease', icon: '🫀' },
  { key: 'other', label: 'Other', icon: '❓' },
];

function DiseaseFinderReports() {
  const [step, setStep] = useState(1); // 1: report type, 2: disease, 3: upload
  const [reportType, setReportType] = useState(null);
  const [targetDisease, setTargetDisease] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    console.log('Files dropped:', files);
  };
  const handleFileSelect = (e) => {
    const files = e.target.files;
    console.log('Files selected:', files);
  };
  const handleBackToReportType = () => {
    setReportType(null);
    setTargetDisease('');
    setError(null);
    setStep(1);
  };
  const handleBackToDisease = () => {
    setTargetDisease('');
    setError(null);
    setStep(2);
  };

  // Stepper labels
  const steps = [
    'Select Report Type',
    'Enter Disease/Condition',
    'Upload & Analyze',
  ];

  return (
    <div className='reports-container'>
      <div className='reports-header'>
        <h1>Report Analysis</h1>
        <p>Upload medical reports for AI analysis</p>
      </div>
      <div className='stepper'>
        {steps.map((label, idx) => (
          <div key={label} className={`stepper-step${step === idx + 1 ? ' active' : ''}${step > idx + 1 ? ' completed' : ''}`}> 
            <div className='stepper-circle'>{idx + 1}</div>
            <div className='stepper-label'>{label}</div>
            {idx < steps.length - 1 && <div className='stepper-line'></div>}
          </div>
        ))}
      </div>
      <div className='reports-content'>
        {step === 1 && (
          <div className='card-selection-section'>
            <h2>Choose Report Type</h2>
            <div className='type-cards interactive'>
              {REPORT_TYPES.map((type) => (
                <div
                  key={type.key}
                  className={`type-card big-card${reportType && reportType.key === type.key ? ' selected' : ''}`}
                  onClick={() => {
                    setReportType(type);
                    setStep(2);
                  }}
                >
                  <div className='card-icon'>{type.icon}</div>
                  <h3>{type.label}</h3>
                  <div className='bodypart-benefit'>{type.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 2 && reportType && (
          <div className='card-selection-section'>
            <button className='back-btn' onClick={handleBackToReportType}>← Back</button>
            <h2>Choose Target Disease/Condition</h2>
            <div className='type-cards interactive'>
              {DISEASES.map((disease) => (
                <div
                  key={disease.key}
                  className={`type-card big-card${targetDisease === disease.key ? ' selected' : ''}`}
                  onClick={() => setTargetDisease(disease.key)}
                >
                  <div className='card-icon'>{disease.icon}</div>
                  <h3>{disease.label}</h3>
                </div>
              ))}
            </div>
            <button
              className='submit-button'
              onClick={() => setStep(3)}
              disabled={!targetDisease}
              style={{marginTop: '1.2rem'}}
            >
              Next
            </button>
          </div>
        )}
        {step === 3 && reportType && (
          <div className='upload-section'>
            <button className='back-btn' onClick={handleBackToDisease}>← Back</button>
            <h2>Upload {reportType.label}</h2>
            <p>Upload your {reportType.label.toLowerCase()} for analysis</p>
            {reportType.enabled ? (
              <div 
                className={`upload-area ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className='upload-icon'>📄</div>
                <p>Drag and drop your document, or <label className='browse-label'>browse<input type='file' onChange={handleFileSelect} accept='.pdf,.jpg,.png,.jpeg' /></label></p>
                <p className='file-types'>.pdf, .jpg, .png, .jpeg up to 10MB</p>
              </div>
            ) : (
              <div className='not-available-msg'>
                <div style={{fontSize:'2.5rem'}}>🚧</div>
                <p>Sorry, this report type is not available yet. Please check back later!</p>
              </div>
            )}
          </div>
        )}
        <div className='supported-types'>
          <h2>What You Can Analyze with VitalCheck Reports</h2>
          <div className='type-cards'>
            <div className='type-card'>
              <div className='card-icon'>🩸</div>
              <h3 style={{marginBottom: '0.7rem'}}>Blood Test Report</h3>
              <div className='bodypart-benefit' style={{fontSize: '1.08rem'}}>Detect anemia, diabetes, and monitor organ health from your blood tests.</div>
            </div>
            <div className='type-card'>
              <div className='card-icon'>🔬</div>
              <h3 style={{marginBottom: '0.7rem'}}>Pathology Report</h3>
              <div className='bodypart-benefit' style={{fontSize: '1.08rem'}}>Get insights from biopsy and cytology reports for early disease detection.</div>
            </div>
            <div className='type-card'>
              <div className='card-icon'>📊</div>
              <h3 style={{marginBottom: '0.7rem'}}>Diagnostic Report</h3>
              <div className='bodypart-benefit' style={{fontSize: '1.08rem'}}>Analyze tumor markers, genetic tests, and specialized diagnostics.</div>
            </div>
            <div className='type-card'>
              <div className='card-icon'>📋</div>
              <h3 style={{marginBottom: '0.7rem'}}>Other Medical Document</h3>
              <div className='bodypart-benefit' style={{fontSize: '1.08rem'}}>Summarize discharge notes, clinical findings, and medical certificates.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseFinderReports;
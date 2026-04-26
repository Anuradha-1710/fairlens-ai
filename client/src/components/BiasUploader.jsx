import React, { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import '../styles/Components.css';

export default function BiasUploader({ domain, onDomainChange, onAnalyze, loading }) {
  const [datasetName, setDatasetName] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [jsonData, setJsonData] = useState('');
  const [csvText, setCsvText] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
        if (parsed.data.length === 0) {
          toast.error('CSV file is empty');
          return;
        }
        onAnalyze(parsed.data, file.name);
        setDatasetName('');
      } catch (error) {
        toast.error('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  };

  const handleJsonPaste = () => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!Array.isArray(parsed)) {
        toast.error('JSON must be an array of objects');
        return;
      }
      onAnalyze(parsed, datasetName || 'JSON Dataset');
      setJsonData('');
      setDatasetName('');
    } catch (error) {
      toast.error('Invalid JSON format');
    }
  };

  const handleCsvPaste = () => {
    try {
      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      if (parsed.data.length === 0) {
        toast.error('CSV data is empty');
        return;
      }
      onAnalyze(parsed.data, datasetName || 'CSV Dataset');
      setCsvText('');
      setDatasetName('');
    } catch (error) {
      toast.error('Failed to parse CSV data');
    }
  };

  const handleSampleDataset = async (sampleType) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/samples/${sampleType}`);
      const { data, description } = await response.json();
      onAnalyze(data, `${sampleType.charAt(0).toUpperCase() + sampleType.slice(1)} Sample`);
      toast.success(`Sample ${sampleType} dataset loaded!`);
    } catch (error) {
      toast.error('Failed to load sample dataset');
    }
  };

  return (
    <div className="uploader-container">
      <div className="domain-selector">
        <label>Domain:</label>
        <select value={domain} onChange={(e) => onDomainChange(e.target.value)}>
          <option value="hiring">Hiring</option>
          <option value="loan">Loan Approval</option>
          <option value="medical">Medical Care</option>
        </select>
      </div>

      <div className="upload-methods">
        <div className="method" style={{ display: uploadMethod === 'file' ? 'block' : 'none' }}>
          <label>Upload CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={loading}
          />
        </div>

        <div className="method" style={{ display: uploadMethod === 'json' ? 'block' : 'none' }}>
          <label>Paste JSON Data</label>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder='[{"field": "value"}, {"field": "value"}]'
            rows="6"
            disabled={loading}
          />
          <button onClick={handleJsonPaste} disabled={loading || !jsonData}>
            Analyze JSON
          </button>
        </div>

        <div className="method" style={{ display: uploadMethod === 'csv' ? 'block' : 'none' }}>
          <label>Paste CSV Data</label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="field1,field2,field3&#10;value1,value2,value3"
            rows="6"
            disabled={loading}
          />
          <button onClick={handleCsvPaste} disabled={loading || !csvText}>
            Analyze CSV
          </button>
        </div>
      </div>

      <div className="method-tabs">
        <button 
          className={uploadMethod === 'file' ? 'active' : ''}
          onClick={() => setUploadMethod('file')}
        >
          📁 Upload
        </button>
        <button 
          className={uploadMethod === 'json' ? 'active' : ''}
          onClick={() => setUploadMethod('json')}
        >
          📋 JSON
        </button>
        <button 
          className={uploadMethod === 'csv' ? 'active' : ''}
          onClick={() => setUploadMethod('csv')}
        >
          📊 CSV Text
        </button>
      </div>

      <div className="sample-datasets">
        <h3>Or try a sample dataset:</h3>
        <button onClick={() => handleSampleDataset('hiring')} disabled={loading}>
          Hiring Dataset
        </button>
        <button onClick={() => handleSampleDataset('loan')} disabled={loading}>
          Loan Dataset
        </button>
        <button onClick={() => handleSampleDataset('medical')} disabled={loading}>
          Medical Dataset
        </button>
      </div>
    </div>
  );
}

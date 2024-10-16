import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Send } from 'lucide-react';
import PDFViewer from './PDFViewer';
import { analyzePDF, pushToCloud } from '../utils/pdfUtils';

const Dashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [suggestedName, setSuggestedName] = useState<string>('');

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleAnalyze = async () => {
    if (file) {
      const result = await analyzePDF(file);
      setAnalysis(result.analysis);
      setSuggestedName(result.suggestedName);
    }
  };

  const handlePush = async () => {
    if (file) {
      await pushToCloud(file, suggestedName);
      alert('PDF pushed to cloud successfully!');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">PDF Analysis Dashboard</h1>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the PDF here ...</p>
        ) : (
          <p>Drag 'n' drop a PDF here, or click to select a file</p>
        )}
      </div>
      {file && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected File: {file.name}</h2>
          <PDFViewer file={file} />
          <button
            onClick={handleAnalyze}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 mt-2"
          >
            <FileText className="inline-block mr-2" />
            Analyze PDF
          </button>
          <button
            onClick={handlePush}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            <Send className="inline-block mr-2" />
            Push to Cloud
          </button>
        </div>
      )}
      {analysis && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Analysis Result:</h3>
          <p>{analysis}</p>
          <h3 className="text-lg font-semibold mt-2">Suggested Name:</h3>
          <p>{suggestedName}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
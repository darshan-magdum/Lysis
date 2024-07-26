
import React, { useEffect, useState } from "react";
import { jsPDF } from 'jspdf';
import "../../../Styles/UploadDocument.css";
 
const ViewDocumentation = () => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [projectSummary, setProjectSummary] = useState(null);
  const [output, setOutput] = useState(false);
 
  useEffect(() => {
    const data = localStorage.getItem("analyses");
    const summary = localStorage.getItem("projectSummary");
    if (data) {
      setAnalysisResults(JSON.parse(data));
      setOutput(true);
    }
    if (summary) {
      setProjectSummary(summary);
      setOutput(true);
    }
  }, []);
 
  const handleDownloadAllPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const textWidth = pageWidth - 2 * margin;
    let yOffset = margin; // Starting vertical position
 
    const addTextToPage = (text, startYOffset) => {
      let splitText = doc.splitTextToSize(text, textWidth);
      let currentYOffset = startYOffset;
 
      splitText.forEach((line, index) => {
        if (currentYOffset + 10 > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          currentYOffset = margin;
        }
        doc.text(line, margin, currentYOffset);
        currentYOffset += 10; // Line height
      });
 
      return currentYOffset; // Return the new Y offset
    };
 
    // Add the project summary
    if (projectSummary) {
      doc.setFontSize(14);
      doc.setFont('Helvetica', 'bold');
      doc.text("Project Summary", margin, yOffset);
      doc.setFont('Helvetica', 'normal');
      yOffset += 10; // Space after heading
      yOffset = addTextToPage(projectSummary, yOffset);
      doc.addPage(); // Add a new page for the analysis results
    }
 
    // Add each analysis result
    analysisResults.forEach((result, index) => {
      if (index !== 0) doc.addPage(); // Add a new page for each result
     
      doc.setFontSize(16);
      doc.setFont('Helvetica', 'bold');
      yOffset = margin; // Reset Y offset for new page
      doc.text(result.fileName, margin, yOffset);
      doc.setFont('Helvetica', 'normal');
      yOffset += 10; // Space after file name
      yOffset = addTextToPage(result.analysis, yOffset);
    });
 
    doc.save('analysis_results.pdf');
  };
 
  return (
    <div>
      <div className="container py-3">
        <div className='DownloadAll'>
          <div className="row align-items-center">
            <div className="col-8">
              <h5
                style={{
                  fontWeight: "bold",
                  marginBottom: "10px",
                  marginTop: "-10px",
                  color: "#20609c",
                }}
              >
                View Documentation
              </h5>
            </div>
            {output && (
              <div className="col-4">
                <button
                  className="btn btn-primary"
                  onClick={handleDownloadAllPDF}
                >
                  Download All as PDF
                </button>
              </div>
            )}
          </div>
        </div>
 
        {!projectSummary && analysisResults.length === 0 && (
          <div className="row d-flex justify-content-center" style={{ width: "1000px" }}>
            <div className="col-lg-11">
              <div className="card">
                <div className="card-body text-center">
                  <p style={{ color: "black" }}>No Documents</p>
                </div>
              </div>
            </div>
          </div>
        )}
 
        {projectSummary && (
          <div className="row d-flex justify-content-center" style={{ width: "1000px" }}>
            <div className="col-lg-11">
              <div className="card">
                <div className="card-header">Project Summary</div>
                <div className="card-body">
                  <pre>{projectSummary}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
 
        {analysisResults.length > 0 && (
          <div className="row d-flex justify-content-center" id="result" style={{ width: "1000px" }}>
            {analysisResults.map((result, index) => (
              <div key={index} className="col-lg-11">
                <div className="card">
                  <div className="card-header">{result.fileName}</div>
                  <div className="card-body">
                    <pre>{result.analysis}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
 
export default ViewDocumentation;
 
 
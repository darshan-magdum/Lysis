import React, { useEffect, useState } from "react";
import { jsPDF } from 'jspdf';
import "../../../Styles/UploadDocument.css";

const ViewDocumentation = () => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [projectSummary, setProjectSummary] = useState(null);
  const [output, setoutput] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("analyses");
    const summary = localStorage.getItem("projectSummary");
    if (data) {
      setAnalysisResults(JSON.parse(data));
      setoutput(true)
    }
    if (summary) {
      setProjectSummary(summary);
      setoutput(true)
    }
  }, []);
  const handleDownloadAllPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    // Add the project summary
    if (projectSummary) {
      doc.text("Project Summary", 10, 10);
      const summaryLines = doc.splitTextToSize(projectSummary, 180);
      doc.text(summaryLines, 10, 20);
      doc.addPage(); // Add a new page for the analysis results
    }

    // Add each analysis result
    analysisResults.forEach((result, index) => {
      if (index !== 0) doc.addPage(); // Add a new page for each result
      doc.text(result.fileName, 10, 10);
      const analysisLines = doc.splitTextToSize(result.analysis, 180);
      doc.text(analysisLines, 10, 20);
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
                </div>{output ? <div className="col-4">
                  <button
                    className="btn btn-primary"
                    onClick={handleDownloadAllPDF}
                  >
                    Download All as PDF
                  </button>
                </div> : ""}

              </div>
            </div>
        
        {!projectSummary && analysisResults.length === 0 && (
          <div className="row d-flex justify-content-center" style={{ width: "1000px" }}>
            <div className="col-lg-11">
              <div className="card">
                <div className="card-body text-center">
                  <p style={{color:"black"}}>No Documents</p>
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

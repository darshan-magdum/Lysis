import React, { useState } from "react";
import mermaid from 'mermaid';
import "../../../Styles/UploadDocument.css";
 
const UMLDiagram = () => {
    const [umlCode, setUmlCode] = useState('');
    const [error, setError] = useState('');
    const [diagramGenerated, setDiagramGenerated] = useState(false);
    const generateDiagram = () => {
        // Validate UML code
        if (!umlCode.trim()) {
            setError('UML code cannot be empty.');
            return;
        }
 
        // Clear error message if validation passes
        setError('');
 
        // Clear previous diagram
        const diagramContainer = document.getElementById('diagramContainer');
        diagramContainer.innerHTML = '';
 
        // Create a new Mermaid diagram element
        const diagramElement = document.createElement('div');
        diagramElement.className = 'mermaid';
        diagramElement.textContent = umlCode;
        diagramContainer.appendChild(diagramElement);
 
        // Initialize Mermaid and render the diagram
        try {
            mermaid.initialize({ startOnLoad: true });
            mermaid.contentLoaded();
        } catch (e) {
            setError('Error rendering diagram: ' + e.message);
        }
 
        // Set diagramGenerated to true after rendering
        setDiagramGenerated(true);
    };
 
    const downloadDiagram = () => {
        const diagramContainer = document.getElementById('diagramContainer');
        if (diagramContainer) {
            // Convert SVG to Blob
            const svgElement = diagramContainer.querySelector('svg');
            if (svgElement) {
                const svgBlob = new Blob([svgElement.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'uml-diagram.svg';
                a.click();
                URL.revokeObjectURL(url);
            } else {
                setError('No SVG found to download.');
            }
        }
    };
 
    return (
        <div>
            <div className="container py-3">
                <div className="row">
                    <div className="col-lg-9">
                        <h5
                            style={{
                                textAlign: "left",
                                fontWeight: "bold",
                                marginBottom: "10px",
                                marginTop: "-10px",
                                color: "#20609c",
                            }}
                        >
                            UML Diagram
                        </h5>
                        <div className="UML-Body">
                            <textarea
                                id="umlCode"
                                value={umlCode}
                                onChange={(e) => setUmlCode(e.target.value)}
                                placeholder="Enter your UML code here"
                            />
                             {error && <p className="UML-error-message">{error}</p>}
                             <br />
                            <button onClick={generateDiagram}>Generate Diagram</button>
                   
                           <br />
                     
                            {diagramGenerated && (
                                <>
                                    <hr />
                                    <button
                                        className="btn btn-primary"
                                        onClick={downloadDiagram}
                                        style={{marginTop: "0px", float: "right"}}
                                    >
                                        Download Diagram
                                    </button>
                                </>
                            )}
                            <div id="diagramContainer" style={{width: '100%'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default UMLDiagram;
 
 
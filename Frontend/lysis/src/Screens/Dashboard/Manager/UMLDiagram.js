import React, { useState } from "react";
import mermaid from 'mermaid';
import "../../../Styles/UploadDocument.css";

const UMLDiagram = () => {
    const [umlCode, setUmlCode] = useState('');
    const [error, setError] = useState('');

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

        // Render the Mermaid diagram
        mermaid.init(undefined, diagramElement);
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
                            <h1>UML Diagram Generator</h1>
                            <textarea
                                id="umlCode"
                                value={umlCode}
                                onChange={(e) => setUmlCode(e.target.value)}
                                placeholder="Enter your UML code here"
                            />
                             {error && <p className="UML-error-message">{error}</p>}
                             <br></br>
                            <button onClick={generateDiagram}>Generate Diagram</button>
                            <div id="diagramContainer"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UMLDiagram;

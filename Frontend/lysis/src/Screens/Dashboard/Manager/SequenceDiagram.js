import React, { useEffect, useState } from "react";
import mermaid from 'mermaid';
import "../../../Styles/UploadDocument.css";
import axios from "axios";

const SequenceDiagram = () => {
    const [umlCode, setUmlCode] = useState('');
    const [error, setError] = useState('');
    const [diagramGenerated, setDiagramGenerated] = useState(false);
    const [selectedProject, setSelectedProject] = useState("");
    const [projects, setProjects] = useState([]);
    const [allUMLData, setAllUMLData] = useState([]);
    const [managerId, setManagerId] = useState(null);
    useEffect(() => {
        const fetchProjects = async () => {
          try {
            const response = await axios.get('http://localhost:8080/NewProjects/GetAllprojects');
            setProjects(response.data.projects);
          } catch (error) {
            console.error("Error fetching projects:", error);
          }
        };
    
        fetchProjects();
      }, []);
      useEffect(() => {
        // Retrieve managerId from localStorage when component mounts
        const id = localStorage.getItem("userId");
        setManagerId(id);
      }, []);
      useEffect(() => {
        if (managerId) {
          axios.get(`http://localhost:8080/NewUMLData/AllUMLData/${managerId}`)
            .then(response => {
                setAllUMLData(response.data);  // Set all results
            })
            .catch(err => {
              console.error("Error fetching Project data:", err);
              setAllUMLData([]);
            });
        }
      }, [managerId]);
      useEffect(() => {
        if (selectedProject) {
          const UMLProjectData = allUMLData.find(
            (UML) => UML.projectName === selectedProject
          );
          if(UMLProjectData){
            setUmlCode(UMLProjectData.UMLData || []);
          }else{
            setUmlCode(null);
            setDiagramGenerated(false);
          }
                  
        }        
      }, [selectedProject]);
      useEffect(() => {
        if(umlCode){
            generateDiagram();
        }
      }, [umlCode]);
    const generateDiagram = () => {
        // Validate UML code
        if (!umlCode.trim() || umlCode =='') {
            alert("Please select a Project.");
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
                a.download = `${selectedProject?`${selectedProject}_Sequence.svg`:`AllProject_Sequence.svg`}`;
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
                    Sequence Diagram
                  </h5>
                </div>
                        <div className="col-lg-3">
                            <label htmlFor="projectDropdown">Select Project:</label>
                            <select
                                id="projectDropdown"
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="form-control"
                            >
                                <option value="">Select a project</option>
                                {projects.map((project) => (
                                    <option key={project._id} value={project.projectName}>
                                        {project.projectName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <br/>
                        <div className="UML-Body">
                            {diagramGenerated && selectedProject &&
                                (<>
                                    <hr />
                                    <button
                                        className="btn btn-primary"
                                        onClick={downloadDiagram}
                                        style={{ marginTop: "0px", float: "right" }}
                                    >
                                        Download Diagram
                                    </button>
                                </>)
                            }
                            {umlCode && selectedProject ? <div id="diagramContainer" style={{ width: '100%' }}></div> : `${selectedProject?`${selectedProject} Project UML is not found`: `Please Select Project`}`}
                            {/* <div id="diagramContainer" style={{ width: '100%' }}></div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SequenceDiagram;


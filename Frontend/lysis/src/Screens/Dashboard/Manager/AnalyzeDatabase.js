import React, { useEffect, useState } from 'react';
import "../../../Styles/UploadDocument.css";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { encode } from 'gpt-tokenizer';


const AnalyzeDatabase = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState("");
  const [managerData, setManagerData] = useState(null);
  const [managerId, setManagerId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
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
      const fetchManagerData = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/Manager/manager/${managerId}`);
          setManagerData(response.data);
        } catch (error) {
          console.error("Error fetching manager data:", error);
        }
      };

      fetchManagerData();
    }
  }, [managerId]);




  const azureApiKey = 'daf99a54e98144328812c4e1a1a4fea6';

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleAnalyze = async () => {
    if (!selectedProject) {
      alert("Please select a project first before starting analyzing.");
    } else {
      if (selectedFiles.length === 0) {
        alert('Please select a folder.');
        return;
      }
      setIsLoading(true);
      setLoaderStatus("Starting Analysis...");

      const fileEntries = getFileEntries(selectedFiles);
      const totalFiles = fileEntries.length;
      const analyses = [];
      let summary = "";
      for (let i = 0; i < totalFiles; i++) {
        const fileEntry = fileEntries[i];
        const text = await fileEntry.file.text();
        if (text) {
          try {
            const analysis = await analyzeCodeWithAzureAI(text);
            const ERScript = await UMLDataWithAzureAI(text);
            const dataStartIndex = ERScript.indexOf('sequenceDiagram');
        let UMLData = ERScript.substring(dataStartIndex);

        // Remove all instances of `Analyzed code (Part X):`
        UMLData = UMLData.replace(/Analyzed code \(Part \d+\):/g, '');

        // Remove all instances of `\`\`\``
        UMLData = UMLData.replace(/```/g, '');

        // Remove any repeated 'sequenceDiagram' by keeping only the first occurrence
        const firstSequenceDiagram = 'erDiagram';
        UMLData = firstSequenceDiagram + UMLData.split(firstSequenceDiagram).slice(1).join('');

        // Trim any extra spaces or newlines from the result
        UMLData = UMLData.trim();
            analyses.push({ FileName: fileEntry.path, Script: text, Analysis: analysis, ERScript: UMLData});            
            setLoaderStatus(`Analyzed ${i + 1} of ${totalFiles} files`);
          } catch (error) {
            console.error('Error analyzing file:', error);
            analyses.push({ fileName: fileEntry.path, analysis: 'Analysis failed' });
            setLoaderStatus(`Error analyzing file ${i + 1} of ${totalFiles}`);
          }
        }
      }
      try {
        const projectName = selectedProject;
        const files = analyses;
        const response = await axios.post('http://localhost:8080/NewDatabaseDetails/AddNewDatabaseDetails', {
          projectName,
          files,
          managerId
        });

        if (response.status === 201) {
          toast.success('Project Uploaded Successfully');
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
      //UML Data Store API
    //   try {
    //     const ProjectData = analyses.map(a => `${a.FileName}\n\n${a.Analysis}`).join('\n\n');
    //     const projectName = selectedProject;
    //     const data = await UMLDataWithAzureAI(ProjectData)
    //     const dataStartIndex = data.indexOf('sequenceDiagram');
    //     let UMLData = data.substring(dataStartIndex);

    //     // Remove all instances of `Analyzed code (Part X):`
    //     UMLData = UMLData.replace(/Analyzed code \(Part \d+\):/g, '');

    //     // Remove all instances of `\`\`\``
    //     UMLData = UMLData.replace(/```/g, '');

    //     // Remove any repeated 'sequenceDiagram' by keeping only the first occurrence
    //     const firstSequenceDiagram = 'sequenceDiagram';
    //     UMLData = firstSequenceDiagram + UMLData.split(firstSequenceDiagram).slice(1).join('');

    //     // Trim any extra spaces or newlines from the result
    //     UMLData = UMLData.trim();
    //     const response = await axios.post('http://localhost:8080/NewUMLData/UMLData', {
    //       UMLData,
    //       projectName,
    //       managerId
    //     });

    //     if (response.status === 201) {
    //       toast.success('UML Data Stored Successfully');
    //     }
    //   } catch (error) {
    //     if (error.response && error.response.data.message) {
    //       toast.error(error.response.data.message);
    //     } else {
    //       toast.error('An unexpected error occurred.');
    //     }
    //   }
      setIsLoading(false);
    }
  };

  const getFileEntries = (files) => {
    return files.map(file => {
      const path = file.webkitRelativePath || file.name;
      return { file, path };
    });
  };

  async function analyzeCodeWithAzureAI(codeText) {
    const maxTokens = 128000; // Safe limit to avoid exceeding the token limit
    const initialPrompt = `You are analyzing a large database Script File. Start by providing a high-level overview and then go into detailed explanations for the following aspects and avoiding repetition, don't give overall summary or any description or context at last or first:

        Table Information:

            Table Names: List all the table names in the script and describe what type of data each table contains (in real-time, what data they store).
                Columns in Table: For each table, list the columns with their names, data types, and descriptions of what data they store.
            Keys:
                Primary Key: Identify the primary key for each table and explain its significance in the table's structure.
                Foreign Key: Identify any foreign keys, explain their relationships with other tables, and describe how they enforce referential integrity.
            Other Keys: Mention any other keys (e.g., unique keys, composite keys) and their roles in the table structure.
            Nullable Columns: Specify which columns allow NULL values and which do not.
            Stored Procedures:

        Stored Procedure Names: List all stored procedures in the script.
            Detailed Explanation: For each stored procedure, provide:
            Conditions Explanation: Describe any conditions used in the stored procedure (e.g., IF statements, WHERE clauses).
            Overall Explanation: Summarize the purpose and logic of the stored procedure.
            Declaration Section: Identify and explain the variables declared in the stored procedure.
            Logic: Break down the logic of the stored procedure step by step.
            Description: Provide a high-level description of what the stored procedure does and its purpose in the overall database structure.
            
            Additional Notes: Highlight any important constraints, relationships, or triggers that are present in the script.
                Provide insights into how the data flows through the database and how different components interact.
 
  Script to analyze (Part 1):\n\n`;

    const followUpPrompt = `Continuing from the previous part, provide detailed explanations for the following aspects, focusing on new information and avoiding repetition, don't give overall summary or any description or context at last or first:
  
    Table Information:

            Table Names: List all the table names in the script and describe what type of data each table contains (in real-time, what data they store).
                Columns in Table: For each table, list the columns with their names, data types, and descriptions of what data they store.
            Keys:
                Primary Key: Identify the primary key for each table and explain its significance in the table's structure.
                Foreign Key: Identify any foreign keys, explain their relationships with other tables, and describe how they enforce referential integrity.
            Other Keys: Mention any other keys (e.g., unique keys, composite keys) and their roles in the table structure.
            Nullable Columns: Specify which columns allow NULL values and which do not.
            Stored Procedures:

        Stored Procedure Names: List all stored procedures in the script.
            Detailed Explanation: For each stored procedure, provide:
            Conditions Explanation: Describe any conditions used in the stored procedure (e.g., IF statements, WHERE clauses).
            Overall Explanation: Summarize the purpose and logic of the stored procedure.
            Declaration Section: Identify and explain the variables declared in the stored procedure.
            Logic: Break down the logic of the stored procedure step by step.
            Description: Provide a high-level description of what the stored procedure does and its purpose in the overall database structure.
            
            Additional Notes: Highlight any important constraints, relationships, or triggers that are present in the script.
                Provide insights into how the data flows through the database and how different components interact.

  Script to analyze (Part {partNumber}):\n\n`;

    const initialPromptTokenCount = encode(initialPrompt).length;
    const codeTextToken = encode(codeText).length;
    let codeChunks = [codeText];;
    if (initialPromptTokenCount + codeTextToken > maxTokens) {
      codeChunks = splitIntoChunks(codeText, maxTokens - initialPromptTokenCount);
    }
    let fullAnalysis = '';
    let prompt;

    for (let i = 0; i < codeChunks.length; i++) {
      if (i === 0) {
        prompt = initialPrompt + codeChunks[i];
      } else {
        prompt = followUpPrompt.replace('{partNumber}', i + 1) + codeChunks[i];
      }

      let attempt = 0;
      let success = false;

      while (attempt < 3 && !success) { // Retry up to 3 times
        try {
          const response = await fetch('https://tesaooenai-service.openai.azure.com/openai/deployments/code-reverse-engineering-deployment/chat/completions?api-version=2023-03-15-preview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': `${azureApiKey}`
            },
            body: JSON.stringify({
              messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt }
              ]
            })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch from Azure AI API');
          }

          const data = await response.json();
          fullAnalysis += data.choices[0].message.content + '\n\n';
          success = true; // Mark as success on valid response
        } catch (error) {
          console.error('Error during API request:', error);
          attempt++; // Retry on error
        }
      }

      if (!success) {
        throw new Error('Max retries exceeded'); // Handle max retries exceeded
      }
    }

    return fullAnalysis;
  }

//   async function AzureAIAPIForTitleQuery(combinedAnalysis) {
//     const maxTokens = 128000; // Safe limit to avoid exceeding the token limit
//     const initialPrompt = `Provide the following information for the analyzed code of a single project:
//                          - Project Name
//                          - Project Use Case
//                          - Technology Used
//                          - Total Number of Functions (If I provide you multiple analyzed code then also that all code is for single project but also give names of functions in bracket. Remember I want only count Custom Functions count not anything)
//                          - Total Number of Classes (If I provide you multiple analyzed code then also that all code is for single project but also give names of classes in bracket. Remember I want only classes count not anything)
//                          Just provide only above points and their respective information, don't give any context. Remember that the analyzed code is for only one project, so give me this for the whole project, not for separate files. Give me only once.
//                          Analyzed code:\n\n`;

//     const followUpPrompt = `Combine all project information which is inside the Project Information as this information is of a single project:
//                          - Project Name  (Give appropriate)
//                          - Project Use Case  (Combine all use cases as provided you in project information and give me two to three line use case description for all)
//                          - Technology Used   (Don't Give same technology again give duplicate once)
//                          - Total Number of Functions (Calculate the total number of Functions and give me only count means give me only number. Do not list function names, only provide the count(Remember: Don't give the description of what types of functions are just give me only Number. Don't give anything other than number))
//                          - Total Number of Classes (Calculate the total number of Classes and give me only count means give me only number. Do not list class names, only provide the count(Remember: Don't give the description of what types of classes are just give me only Number. Don't give anything other than number))
//                          Just provide only above points and their respective information, don't give any context. Remember that the analyzed code is for only one project, so give me this for the whole project, not for separate files. Give me only once.
//                          Project Information:\n\n`;

//     const initialPromptTokenCount = encode(initialPrompt).length;
//     const codeTextToken = encode(combinedAnalysis).length;
//     let analysisChunks = [combinedAnalysis];
//     if (initialPromptTokenCount + codeTextToken > maxTokens) {
//       analysisChunks = splitIntoChunks(combinedAnalysis, maxTokens - initialPromptTokenCount);
//     }
//     let fullResponse = '';

//     for (let i = 0; i < analysisChunks.length; i++) {
//       let prompt;
//       if (i === 0) {
//         prompt = initialPrompt + analysisChunks[i];
//       } else {
//         prompt = followUpPrompt.replace('{partNumber}', i + 1) + analysisChunks[i];
//       }
//       let attempt = 0;
//       let success = false;

//       while (attempt < 3 && !success) { // Retry up to 3 times
//         try {
//           const response = await fetch('https://tesaooenai-service.openai.azure.com/openai/deployments/code-reverse-engineering-deployment/chat/completions?api-version=2023-03-15-preview', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'api-key': `${azureApiKey}`
//             },
//             body: JSON.stringify({
//               messages: [
//                 { role: 'system', content: 'You are a helpful assistant.' },
//                 { role: 'user', content: prompt }
//               ]
//             })
//           });

//           if (!response.ok) {
//             throw new Error('Failed to fetch from Azure AI API');
//           }

//           const data = await response.json();
//           fullResponse += data.choices[0].message.content + '\n\n';
//           success = true; // Mark as success on valid response
//         } catch (error) {
//           console.error('Error during API request:', error);
//           attempt++; // Retry on error
//         }
//       }

//       if (!success) {
//         throw new Error('Max retries exceeded'); // Handle max retries exceeded
//       }
//     }

//     return fullResponse;
//   }
  async function UMLDataWithAzureAI(combinedAnalysis) {
    const maxTokens = 128000; // Safe limit to avoid exceeding the token limit
    const initialPrompt = `From this below data Generate meramid script for ER Diagram wihout any syntax error. Give me only Mermaid Script to generate ER Diagram for this above data wihout any syntax error. Don't give any explanation.
    Script code (Part 1):\n\n`;
    const followUpPrompt = `From the previous result Generate meramid script for ER Diagram wihout any syntax error. Give me only Mermaid Script to generate ER Diagram for this above data wihout any syntax error. Don't give any explanation.
    Script code (Part {partNumber}):\n\n`;

    const initialPromptTokenCount = encode(initialPrompt).length;
    const codeTextToken = encode(combinedAnalysis).length;
    let analysisChunks = [combinedAnalysis];
    if (initialPromptTokenCount + codeTextToken > maxTokens) {
      analysisChunks = splitIntoChunks(combinedAnalysis, maxTokens - initialPromptTokenCount);
    } let fullResponse = '';
    let prompt;

    for (let i = 0; i < analysisChunks.length; i++) {
      if (i === 0) {
        prompt = analysisChunks[i] + initialPrompt;
      } else {
        prompt = analysisChunks[i] + followUpPrompt.replace('{partNumber}', i + 1);
      }

      let attempt = 0;
      let success = false;

      while (attempt < 3 && !success) { // Retry up to 3 times
        try {
          const response = await fetch('https://tesaooenai-service.openai.azure.com/openai/deployments/code-reverse-engineering-deployment/chat/completions?api-version=2023-03-15-preview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': `${azureApiKey}`
            },
            body: JSON.stringify({
              messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt }
              ]
            })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch from Azure AI API');
          }

          const data = await response.json();
          fullResponse += data.choices[0].message.content + '\n\n';
          success = true; // Mark as success on valid response
        } catch (error) {
          console.error('Error during API request:', error);
          attempt++; // Retry on error
        }
      }

      if (!success) {
        throw new Error('Max retries exceeded'); // Handle max retries exceeded
      }
    }

    return fullResponse;
  }
  const estimateAverageTokenSize = (text) => {
    const sample = text.slice(0, Math.min(text.length, 100000));
    const tokens = encode(sample);
    return sample.length / tokens.length;
  };

  // Function to split text into chunks using estimated token size
  const splitIntoChunks = (text, maxTokenCount) => {
    const chunks = [];
    const averageTokenSize = estimateAverageTokenSize(text);

    let start = 0;
    let end = 0;
    let estimatedTokenCount = 0;

    while (end < text.length) {
      estimatedTokenCount = Math.ceil((end - start) / averageTokenSize);

      if (estimatedTokenCount >= maxTokenCount) {
        chunks.push(text.slice(start, end));
        start = end;
        estimatedTokenCount = 0;
      }

      end++;
    }

    if (start < end) {
      chunks.push(text.slice(start, end));
    }

    return chunks;
  };


  return (

    <div>
      <ToastContainer />
      <div className="container py-3">
        <div className="row">
          <div className="col-lg-9">
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
                    Upload Database File
                  </h5>


                </div>
              </div>
            </div>


            <div className='uploadContainer'>

              <div className="card">
                <div className="form-group">
                  <div className="col-lg-4">
                    <label htmlFor="projectDropdown">Select Project:</label>
                    <select
                      id="projectDropdown"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="form-control"
                    >
                      <option value="">Select Project</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project.projectName}>
                          {project.projectName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <input
                  id="folderInput"
                  type="file"
                  webkitdirectory="true"
                  multiple
                  onChange={handleFileChange}
                />
                <button onClick={handleAnalyze} className="primary-button">Analyze</button>
              </div>

              <div id="loader" className="loading" style={{ display: "none" }}>
                <div className="icons">
                  <i className="ri-arrow-left-s-line"></i>
                  <i className="ri-arrow-right-s-line"></i>
                </div>
                <div id="loaderStatusMessage" className="loader-status-message">Analyzing...</div>
              </div>
              {isLoading && <><p style={{ color: "Black", textAlign: "center", marginTop: "5px" }}>{loaderStatus}</p>
                <div className='LoaderBody'>
                  <div className="loader">
                    <div>
                      <ul>
                        {[...Array(6)].map((_, index) => (
                          <li key={index}>
                            <svg fill="currentColor" viewBox="0 0 90 120">
                              <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                            </svg>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span>Loading</span>
                  </div>
                </div>
              </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeDatabase;



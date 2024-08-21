import React, { useEffect, useState } from 'react';
import "../../../Styles/UploadDocument.css";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Analyze = () => {
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
    const fileData = [];

    for (let i = 0; i < totalFiles; i++) {
      const fileEntry = fileEntries[i];
      const text = await fileEntry.file.text();
      fileData.push({ fileName: fileEntry.path, text });
    }
    for (let i = 0; i < totalFiles; i++) {
      const fileEntry = fileEntries[i];
      const text = await fileEntry.file.text();
      try {
        const { analysis, summary: fileSummary } = await analyzeCodeWithAzureAI(text);
        analyses.push({ FileName: fileEntry.path, Code: text, Analysis: analysis});
        if (i === 0) {
          summary = fileSummary; // Store the project summary from the first file
        }
        setLoaderStatus(`Analyzed ${i + 1} of ${totalFiles} files`);
      } catch (error) {
        console.error('Error analyzing file:', error);
        analyses.push({ fileName: fileEntry.path, analysis: 'Analysis failed' });
        setLoaderStatus(`Error analyzing file ${i + 1} of ${totalFiles}`);
      }
    }
    

    const combinedAnalysis = analyses.map(a => `FileName: ${a.FileName}\n\nAnalysis:\n${a.Analysis}`).join('\n\n');


    const queryResult1 = await AzureAIAPIForTitleQuery(combinedAnalysis);
    // const queryResult = await FinalAzureAIAPIForTitleQuery(queryResult1);
    try {
      const projectName = selectedProject;
      const files = analyses;
      const projectSummary = queryResult1;
      const response = await axios.post('http://localhost:8080/NewProjectDetails/AddNewProjectsDetails', {
        projectName,
        files,
        projectSummary,
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
    setIsLoading(false);
  };

  const getFileEntries = (files) => {
    return files.map(file => {
      const path = file.webkitRelativePath || file.name;
      return { file, path };
    });
  };

  async function analyzeCodeWithAzureAI(codeText) {
    const maxTokens = 15000; // Safe limit to avoid exceeding the token limit
    const initialPrompt = `You are analyzing a large codebase in parts. Start by providing a high-level overview and then go into detailed explanations for the following aspects and avoiding repetition, don't give overall summary or any description or context at last or first:
  - Overall structure of the code.
  - Class names, objects, and their interactions.
  - Function names and explanations.
  - Database connections.
  - API details including keys and endpoints.
  - Significant aspects.
 
  Code to analyze (Part 1):\n\n`;

    const followUpPrompt = `Continuing from the previous part, provide detailed explanations for the following aspects, focusing on new information and avoiding repetition, don't give overall summary or any description or context at last or first:
  - Class names, objects, and their interactions.
  - Function names and explanations.
  - Database connections.
  - API details including keys and endpoints.
  - Significant aspects.
  Do not repeat any previous introductory statements or overviews.
  Code to analyze (Part {partNumber}):\n\n`;

    const codeChunks = splitIntoChunks(codeText, maxTokens - initialPrompt.length);
    let fullAnalysis = '';
    let projectSummary = '';
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

          if (!projectSummary && i === 0) {
            projectSummary = extractProjectSummary(data.choices[0].message.content); // Extract project summary from the first chunk
          }
        } catch (error) {
          console.error('Error during API request:', error);
          attempt++; // Retry on error
        }
      }

      if (!success) {
        throw new Error('Max retries exceeded'); // Handle max retries exceeded
      }
    }

    return { analysis: fullAnalysis, summary: projectSummary };
  }

  async function AzureAIAPIForTitleQuery(combinedAnalysis) {
    const maxTokens = 15000; // Safe limit to avoid exceeding the token limit
    const promptTemplate = `Provide the following information for the analyzed code of a single project:
                             - Project Name
                             - Project Use Case
                             - Technology Used
                             - Total Number of Functions (If I provide you multiple analyzed code then also that all code is for single project but also give names of functions in bracket. Remember I want only count Custom Functions count not anything)
                             - Total Number of Classes (If I provide you multiple analyzed code then also that all code is for single project but also give names of classes in bracket. Remember I want only classes count not anything)
                             Just provide only above points and their respective information, don't give any context. Remember that the analyzed code is for only one project, so give me this for the whole project, not for separate files. Give me only once.
                             Analyzed code:\n\n`;

    const analysisChunks = splitIntoChunks(combinedAnalysis, maxTokens - promptTemplate.length);
    let fullResponse = '';

    for (const chunk of analysisChunks) {
      const prompt = promptTemplate + chunk;
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
  async function FinalAzureAIAPIForTitleQuery(combinedAnalysis) {
    const maxTokens = 15000; // Safe limit to avoid exceeding the token limit
    const promptTemplate = `Combine all project information which is inside the Project Information as this information is of a single project:
                           - Project Name  (Give apprope)
                           - Project Use Case  (Combine all use cases as provided you in project information and give me two to three line use case description for all)
                           - Technology Used   (Don't Give same technology again give duplicate once)
                           - Total Number of Functions (Calculate the total number of Funtions and give me only count means give me only number. Do not list function names, only provide the count(Remember: Don't give the discription of what types of function are just give me only Number. Don't give anything other than number))
                           - Total Number of Classes (Calculate the total number of Classes and give me only count means give me only number. Do not list class names, only provide the count(Remember: Don't give the discription of what types of classes are just give me only Number.Don't give anything other than number))
                           Just provide only above points and their respective information, don't give any context. Remember that the analyzed code is for only one project, so give me this for the whole project, not for separate files. Give me only once.
                           Project Information:\n\n`;

    const analysisChunks = splitIntoChunks(combinedAnalysis, maxTokens - promptTemplate.length);
    let fullResponse = '';

    for (const chunk of analysisChunks) {
      const prompt = promptTemplate + chunk;
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


  const extractProjectSummary = (analysis) => {
    const summaryLines = analysis.split('\n').slice(0, 5); // Extract first 5 lines as summary
    return summaryLines.join('\n');
  };

  const splitIntoChunks = (text, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
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
                    Upload Folder
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
        <option value="">Select a project</option>
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

export default Analyze;



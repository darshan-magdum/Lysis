import React, { useState, useRef, useEffect } from 'react';
import "../../../Styles/UploadDocument.css";
import { encode } from 'gpt-tokenizer';
import axios from 'axios';
const CustomPrompt = () => {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [userQueryData, setUserQueryData] = useState([]);
  const [isUserQuery, setIsUserQuery] = useState(false);
  const [managerId, setManagerId] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [selectedProjectData, setSelectedProjectData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const textareaRef = useRef(null);

  const azureApiKey = 'daf99a54e98144328812c4e1a1a4fea6';
  useEffect(() => {
    // Retrieve managerId from localStorage when component mounts
    const id = localStorage.getItem("userId");
    setManagerId(id);
  }, []);
  useEffect(() => {
    if (selectedProject) {
      const projectData = allResults.find(
        (project) => project.projectName === selectedProject
      );
      setSelectedProjectData(projectData || []);
    }
  }, [selectedProject, allResults]);
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
    if (managerId) {
      axios.get(`http://localhost:8080/NewProjectDetails/ProjectsDetails/${managerId}`)
        .then(response => {
          setAllResults(response.data);  // Set all results
        })
        .catch(err => {
          console.error("Error fetching Project data:", err);
          setAllResults([]);
        });
    }
  }, [managerId]);
  // Calculate the height of 5 lines
  const getLineHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const style = window.getComputedStyle(textarea);
      return parseInt(style.lineHeight, 10);
    }
    return 24; // Default line height if unable to compute
  };

  const maxLines = 5;
  const maxHeight = getLineHeight() * maxLines; // Height for 5 lines

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to recalculate scrollHeight
      textarea.style.height = 'auto';
      // Set the height to scrollHeight but not exceed maxHeight
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
      // Apply overflow style conditionally
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [prompt]);

  const handleUserQuery = async () => {
    if (!selectedProject) {
      alert("Please select a project first before submitting your query.");
    }else{
    if (!userQuery.trim()) {
      alert('Please enter a query.');
      return;
    }

    const analyses = selectedProjectData;
    if (analyses.length === 0) {
      alert('Please analyze the file to answer your query.');
      return;
    }


    const combinedAnalysis = analyses.files.map(({ FileName, Analysis }) => `${FileName}\n${Analysis}`).join('\n\n');
    setIsUserQuery(true);
    setIsLoading(true);
    setLoaderStatus('Processing user query...');

    try {
      const queryResult = await analyzeUserQueryWithAzureAI(userQuery, combinedAnalysis);
      // Prepend new query result to the top
      const updatedResults = [{ title: `Query Result: ${userQuery}`, content: queryResult }, ...userQueryData];
      setUserQueryData(updatedResults);
    } catch (error) {
      console.error('Error handling user query:', error);
      alert('Error handling user query. Please try again.');
    }

    setIsLoading(false);
    setUserQuery("");
  }
  };


  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = () => {
    if (prompt.trim()) {
      setResponses([...responses, prompt]);
      setPrompt('');
      console.log('Submitted prompt:', prompt);
    }
  };
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

  async function analyzeUserQueryWithAzureAI(query, combinedAnalysis) {
    const maxTokens = 128000; // Safe limit to avoid exceeding the token limit
    const initialPrompt = `${query}
    Analyzed code (Part 1):\n\n`;
//     const initialPrompt = `Please provide detailed information about the following query based on the analyzed code. Start by addressing the query directly and then go into detailed explanations, avoiding repetition and introductory statements:
 
// Query: ${query}
// Don't give me Query in response again.
// Analyzed code (Part 1):\n\n`;

    const followUpPrompt = `Continuing from the previous part, provide detailed information about the query based on the analyzed code, focusing on new information and avoiding repetition and introductory statements:
 
Query: ${query}
Don't give me Query in response again.
Analyzed code (Part {partNumber}):\n\n`;

    const initialPromptTokenCount = encode(initialPrompt).length;
    const codeTextToken = encode(combinedAnalysis).length;
    let analysisChunks = [combinedAnalysis];;
    if (initialPromptTokenCount + codeTextToken > maxTokens) {
      analysisChunks = splitIntoChunks(combinedAnalysis, maxTokens - initialPromptTokenCount);
    } let fullResponse = '';
    let prompt;

    for (let i = 0; i < analysisChunks.length; i++) {
      if (i === 0) {
        prompt =  analysisChunks[i] + initialPrompt;
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

  return (
    <div>
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
                    Custom Prompt
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
            </div>
            <div className='uploadContainer'>
              {<div className='card'>
                <input
                  id='searchQuery'
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Enter your query"
                />
                <button onClick={handleUserQuery} className="primary-button">Submit Query</button>
              </div>}
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
              <div id="result">
                {isUserQuery && userQueryData.map((result, index) => (
                  <div key={index} className="card">
                    <div className="card-header">{result.title}</div>
                    <div className="card-body">
                      <pre>{result.content}</pre>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPrompt;

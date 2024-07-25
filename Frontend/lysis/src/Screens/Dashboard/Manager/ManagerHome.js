import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "../../../Styles/UploadDocument.css"
const azureApiKey = 'daf99a54e98144328812c4e1a1a4fea6';


const ManagerHome = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [analyses, setAnalyses] = useState([]);
  const [summary, setSummary] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [fileEntries, setFileEntries] = useState([]);

  const handleFolderUpload = async (event) => {
    const items = event.target.files;
    const totalFiles = items.length;
    const fileEntries = [];

    for (let i = 0; i < totalFiles; i++) {
      const file = items[i];
      const path = file.webkitRelativePath || file.name;
      fileEntries.push({ file, path });
    }

    setLoading(true);
    setResult('');
    setAnalyses([]);
    setProjectSummary('');
    setFileEntries(fileEntries);
    setLoading(false);
  };

  const analyzeFiles = async () => {
    if (fileEntries.length === 0) {
      alert('No files uploaded.');
      return;
    }
  
    setLoading(true);
    setResult('');
    setAnalyses([]);
    setProjectSummary('');
  
    const totalFileCount = fileEntries.length;
    const analyses = [];
    let projectSummary = '';
  
    for (let i = 0; i < totalFileCount; i++) {
      const fileEntry = fileEntries[i];
      const text = await fileEntry.file.text();
      try {
        const { analysis, summary } = await analyzeCodeWithAzureAI(text);
        analyses.push({ fileName: fileEntry.path, analysis });
        if (i === 0) projectSummary = summary;
        setResult(prev => prev + `Analyzed ${i + 1} of ${totalFileCount} files\n`);
      } catch (error) {
        console.error('Error analyzing file:', error);
        analyses.push({ fileName: fileEntry.path, analysis: 'Analysis failed' });
        setResult(prev => prev + `Error analyzing file ${i + 1} of ${totalFileCount}\n`);
      }
    }
  
    localStorage.setItem('analyses', JSON.stringify(analyses));
  
    const combinedAnalysis = analyses.map(a => a.analysis).join('\n\n');
    const queryResult1 = await AzureAIAPIForTitleQuery(combinedAnalysis);
    const queryResult = await FinalAzureAIAPIForTitleQuery(queryResult1);
    localStorage.setItem('projectSummary', queryResult);
    setSummary(queryResult);
    setAnalyses(analyses);
    setProjectSummary(projectSummary);
    setLoading(false);
  };
  

  const extractProjectSummary = (text) => {
    const summaryLines = text.split('\n').filter(line => 
        line.includes('Project Name') || 
        line.includes('Project use case') || 
        line.includes('Technology used')
    );
    return summaryLines.join('\n');
  };

  const analyzeUserQueryWithAzureAI = async (query, combinedAnalysis) => {
    const maxTokens = 15000;
    const initialPrompt = `Please provide detailed information about the following query based on the analyzed code. Start by addressing the query directly and then go into detailed explanations, avoiding repetition and introductory statements:

    Query: ${query}
    Don't give me Query in response again.
    Analyzed code (Part 1):\n\n`;

    const followUpPrompt = `Continuing from the previous part, provide detailed information about the query based on the analyzed code, focusing on new information and avoiding repetition and introductory statements:

    Query: ${query}
    Don't give me Query in response again.
    Analyzed code (Part {partNumber}):\n\n`;

    const analysisChunks = splitIntoChunks(combinedAnalysis, maxTokens - initialPrompt.length);
    let fullResponse = '';
    let prompt;

    for (let i = 0; i < analysisChunks.length; i++) {
      prompt = (i === 0 ? initialPrompt : followUpPrompt.replace('{partNumber}', i + 1)) + analysisChunks[i];
      let attempt = 0;
      let success = false;

      while (attempt < 3 && !success) {
        try {
          const response = await fetch('https://tesaooenai-service.openai.azure.com/openai/deployments/TesaDeployment/chat/completions?api-version=2023-03-15-preview', {
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

          if (!response.ok) throw new Error('Failed to fetch from Azure AI API');
          const data = await response.json();
          fullResponse += data.choices[0].message.content + '\n\n';
          success = true;
        } catch (error) {
          console.error('Error during API request:', error);
          attempt++;
        }
      }

      if (!success) throw new Error('Max retries exceeded');
    }

    return fullResponse;
  };

  const analyzeCodeWithAzureAI = async (codeText) => {
    const maxTokens = 15000;
    const initialPrompt = `You are analyzing a large codebase in parts. Start by providing a high-level overview and then go into detailed explanations for the following aspects and avoiding repetition:
- Overall structure of the code.
- Class names, objects, and their interactions.
- Function names and explanations.
- Database connections.
- API details including keys and endpoints.
- Significant aspects.
 
Code to analyze (Part 1):\n\n`;

    const followUpPrompt = `Continuing from the previous part, provide detailed explanations for the following aspects, focusing on new information and avoiding repetition:
- Class names, objects, and their interactions.
- Function names and explanations.
- Database connections.
- API details including keys and endpoints.
- Significant aspects.
 
Code to analyze (Part {partNumber}):\n\n`;

    const codeChunks = splitIntoChunks(codeText, maxTokens - initialPrompt.length);
    let fullAnalysis = '';
    let projectSummary = '';
    let prompt;

    for (let i = 0; i < codeChunks.length; i++) {
      prompt = (i === 0 ? initialPrompt : followUpPrompt.replace('{partNumber}', i + 1)) + codeChunks[i];
      let attempt = 0;
      let success = false;

      while (attempt < 3 && !success) {
        try {
          const response = await fetch('https://tesaooenai-service.openai.azure.com/openai/deployments/TesaDeployment/chat/completions?api-version=2023-03-15-preview', {
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

          if (!response.ok) throw new Error('Failed to fetch from Azure AI API');
          const data = await response.json();
          fullAnalysis += data.choices[0].message.content + '\n\n';
          success = true;

          if (!projectSummary && i === 0) {
            projectSummary = extractProjectSummary(data.choices[0].message.content);
          }
        } catch (error) {
          console.error('Error during API request:', error);
          attempt++;
        }
      }

      if (!success) throw new Error('Max retries exceeded');
    }

    return { analysis: fullAnalysis, summary: projectSummary };
  };

  async function AzureAIAPIForTitleQuery(combinedAnalysis) {
    const maxTokens = 15000;
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

      while (attempt < 3 && !success) {
        try {
          const response = await fetch('https://tesaooenai-service.openai.azure.com/openai/deployments/TesaDeployment/chat/completions?api-version=2023-03-15-preview', {
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

          if (!response.ok) throw new Error('Failed to fetch from Azure AI API');
          const data = await response.json();
          fullResponse += data.choices[0].message.content + '\n\n';
          success = true;
        } catch (error) {
          console.error('Error during API request:', error);
          attempt++;
        }
      }

      if (!success) throw new Error('Max retries exceeded');
    }

    return fullResponse;
  }

  async function FinalAzureAIAPIForTitleQuery(query) {
    const maxTokens = 15000;
    const promptTemplate = `Combine all project information under the following categories:
                            Project Name: (Provide a suitable name for the project)
                            Project Use Case: (Combine all use cases and provide a two to three line use case description)
                            Technology Used: (List the technologies used without duplications)
                            Total Number of Functions: (Provide the total count of functions().(Remember I want only count(number) other than nothing any discription or context or name of funstions.))
                            Total Number of Classes: (Provide the total count of classes().(Remember I want only count(number) other than nothing any discription or context or name of Classes.))
                            Ensure that the information pertains to the entire project, not separate files. And the below project information is all for only one single project. Only provide the requested information and nothing else.
                            Project Information:\n\n`;

    const prompt = promptTemplate + query;
    let fullResponse = '';

    let attempt = 0;
    let success = false;

    while (attempt < 3 && !success) {
      try {
        const response = await fetch('https://tesaooenai-service.openai.azure.com/openai/deployments/TesaDeployment/chat/completions?api-version=2023-03-15-preview', {
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

        if (!response.ok) throw new Error('Failed to fetch from Azure AI API');
        const data = await response.json();
        fullResponse += data.choices[0].message.content + '\n\n';
        success = true;
      } catch (error) {
        console.error('Error during API request:', error);
        attempt++;
      }
    }

    if (!success) throw new Error('Max retries exceeded');

    return fullResponse;
  }

  const splitIntoChunks = (text, maxSize) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += maxSize) {
      chunks.push(text.slice(i, i + maxSize));
    }
    return chunks;
  };

  const downloadAllPDF = () => {
    const pdf = new jsPDF();
    const resultElement = document.getElementById('result');
    
    html2canvas(resultElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; 
      const pageHeight = 295;  
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('all_results.pdf');
    });
  };

  const downloadFilePDF = (fileName, analysis) => {
    const pdf = new jsPDF();
    pdf.text(`Analysis for ${fileName}`, 10, 10);
    pdf.text(analysis, 10, 20);
    pdf.save(`${fileName.replace(/\.txt$/, '')}_analysis.pdf`);
  };

  const handleUserQuery = async () => {
    if (!userQuery) return;

    setLoading(true);
    setResult('');

    const combinedAnalysis = analyses.map(a => a.analysis).join('\n\n');
    const response = await analyzeUserQueryWithAzureAI(userQuery, combinedAnalysis);

    setResult(response);
    setLoading(false);
  };

  return (
    <div className="manager-home">
      <input
        type="file"
        id="folderInput"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleFolderUpload}
        style={{ display: 'none' }}
      />
      <label htmlFor="folderInput">
        <button onClick={() => document.getElementById('folderInput').click()}>Upload Code Folder</button>
      </label>
      {
        <button onClick={analyzeFiles}>Analyze Files</button>
      }
      <button onClick={downloadAllPDF}>Download All as PDF</button>

      {loading && <p>Loading...</p>}
      <div id="result">
        <div className="project-summary">
          <h3>Project Summary</h3>
          <p>{summary}</p>
        </div>
        {analyses.map((fileAnalysis, index) => (
          <div key={index} className="file-analysis">
            <h4>{fileAnalysis.fileName}</h4>
            <pre>{fileAnalysis.analysis}</pre>
            <button onClick={() => downloadFilePDF(fileAnalysis.fileName, fileAnalysis.analysis)}>Download PDF</button>
          </div>
        ))}
        <div className="user-query">
          <h3>Ask a Query</h3>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Enter your query here"
          />
          <button onClick={handleUserQuery}>Submit Query</button>
          <div>
            <h4>Query Results:</h4>
            <pre>{result}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;

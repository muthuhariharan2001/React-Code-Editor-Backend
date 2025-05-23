import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import executeCode from "../api/CodeExecution";
import "./CodeEditor.css";

const CodeEditor = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");
  const [version, setVersion] = useState("18.15.0");
  const [userInput, setUserInput] = useState(""); // User input state
  const [isRunning, setIsRunning] = useState(false); // Code running state

  const languageVersions = {
    javascript: "18.15.0",
    python: "3.10.0",
    cpp: "10.2.0",
    java: "15.0.2",
    // go: "1.19.0",
    c: "10.2.0",
    // sqlite3: "3.36.0",
  };

  const languages = Object.keys(languageVersions);

  // Load code from local storage on component mount
  useEffect(() => {
    const savedCode = localStorage.getItem(language);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [language]);

  const handleLanguageChange = (selectedLang) => {
    // Save current code to local storage
    localStorage.setItem(language, code);

    setLanguage(selectedLang);
    setVersion(languageVersions[selectedLang]);
    setCode(""); // Clear code when changing languages
  };

  const handleExecute = async () => {
    setIsRunning(true);
    if (!version) {
      setOutput("Error: Version is not set");
      return;
    }

    const response = await executeCode(language, version, code, userInput);
    if (response.success) {
      setOutput(response.output);
    } else {
      setOutput(response.error);
    }

    // Save the code to local storage every time it's executed
    localStorage.setItem(language, code);
    setIsRunning(false);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem(language, newCode); // Save code to local storage whenever it changes
  };

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value); // Update user input
  };

  return (
    // <div className="container p-4 max-w-screen-xl mx-auto">
    //   <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
    //     Online Code Editor
    //   </h2>

    //   {/* Language Selector and Monaco Editor Version */}
    //   <div className="flex justify-between items-end gap-4 mb-4">
    //     {/* Language Selector */}
    //     <div className="flex-1">
    //       <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
    //         Language
    //       </label>
    //       <select
    //         value={language}
    //         onChange={(e) => handleLanguageChange(e.target.value)}
    //         className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
    //       >
    //         {languages.map((lang) => (
    //           <option key={lang} value={lang}>
    //             {lang}
    //           </option>
    //         ))}
    //       </select>
    //     </div>

    //     {/* Monaco Editor Version */}
    //     <div className="flex-1">
    //       <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
    //         Monaco Editor Version
    //       </label>
    //       <input
    //         type="text"
    //         readOnly
    //         value={version}
    //         className="w-full px-4 py-2 border rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-white"
    //       />
    //     </div>

    //     {/* Run Code Button */}
    //     <div className="flex items-end">
    //       <button
    //         onClick={handleExecute}
    //         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-32 h-10 flex items-center justify-center rounded-lg transition-shadow shadow-md relative"
    //         disabled={isRunning}
    //         style={{
    //           cursor: isRunning ? "not-allowed" : "pointer",
    //         }}
    //       >
    //         {isRunning ? (
    //           <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
    //         ) : (
    //           "Run"
    //         )}
    //       </button>
    //     </div>
    //   </div>

    //   {/* Monaco Editor */}
    //   <div className="div1 flex flex-row">
    //     <div className="mb-2 w-1/2 inline-block">
    //       <MonacoEditor
    //         height="400px"
    //         language={language}
    //         theme="vs-dark"
    //         value={code}
    //         onChange={handleCodeChange}
    //       />
    //     </div>

    //     {/* User Input Section */}
    //     <div className="mb-2 w-1/2 inline">
    //       <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
    //         Input for Your Code
    //       </label>
    //       <textarea
    //         value={userInput}
    //         onChange={handleUserInputChange}
    //         placeholder="Enter input for your program"
    //         className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
    //       ></textarea>
    //     </div>
    //   </div>

    //   {/* Output Section */}
    //   <div className="mb-2">
    //     <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
    //       Output:
    //     </h3>
    //     <pre className="bg-gray-100 dark:bg-gray-700 text-sm rounded-lg p-4">
    //       {output}
    //     </pre>
    //   </div>
    // </div>
    <div className="container p-6 max-w-screen-xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Hariharan's Editor
      </h2>

      {/* Top Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Language Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Version */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Version
          </label>
          <input
            type="text"
            readOnly
            value={version}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border shadow-sm dark:text-white"
          />
        </div>

        {/* Run Button */}
        <div className="flex items-end">
          <button
            onClick={handleExecute}
            disabled={isRunning}
            className={`w-full py-2 rounded-lg font-semibold shadow-md text-white transition 
        ${
          isRunning
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
          >
            {isRunning ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></span>
            ) : (
              "▶ Run Code"
            )}
          </button>
        </div>
      </div>

      {/* Code + Input Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="rounded-xl overflow-hidden shadow-md border dark:border-gray-700">
          <MonacoEditor
            height="400px"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Input */}
        <div className="rounded-xl shadow-md border dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input to your program
          </label>
          <textarea
            value={userInput}
            onChange={handleUserInputChange}
            rows="12"
            className="w-full resize-none px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter custom input"
          ></textarea>
        </div>
      </div>

      {/* Output */}
      <div className="rounded-xl shadow-md border dark:border-gray-700 p-4 bg-gray-100 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Output:
        </h3>
        <pre className="text-sm whitespace-pre-wrap break-words text-gray-800 dark:text-white">
          {output}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;

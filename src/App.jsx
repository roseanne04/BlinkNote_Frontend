"use client"

import { useState } from "react"
import axios from "axios"
import "./App.css"

function App() {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState("transcript") // 'transcript' or 'video'
  const [summary, setSummary] = useState("")
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleTypeChange = (e) => {
    setFileType(e.target.value)
    setFile(null) // Reset file input when type changes
  }

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file!")

    setLoading(true)
    setSummary("")
    setTasks([])

    const formData = new FormData()
    formData.append("file", file)

    try {
      let response
      if (fileType === "transcript") {
        response = await axios.post("http://127.0.0.1:5000/summarize", formData)
      } else {
        response = await axios.post("http://127.0.0.1:5000/upload_video", formData)
      }

      setSummary(response.data.summary || "")
      setTasks(response.data.tasks || [])
    } catch (error) {
      console.error("Error:", error)
      alert("Something went wrong!")
    }

    setLoading(false)
  }

  const getPriorityClass = (priority) => {
    if (priority?.toLowerCase() === "high") return "priority-high"
    if (priority?.toLowerCase() === "medium") return "priority-medium"
    return "priority-low"
  }

  return (
    <div className="app-container">
      <div className="left-section">
        <h1 className="app-title">BlinkNote</h1>
        <p className="app-description">
          Your intelligent assistant for meeting summaries and task extraction. Upload your transcripts or videos and
          let AI do the work.
        </p>

        <label className="form-label">Select Input Type:</label>
        <select value={fileType} onChange={handleTypeChange} className="form-select">
          <option value="transcript">Transcript (.txt)</option>
          <option value="video">Meeting Video (.mp4 or .wav)</option>
        </select>

        <input
          type="file"
          accept={fileType === "transcript" ? ".txt" : "video/*"}
          onChange={handleFileChange}
          className="file-input"
        />

        <button onClick={handleSubmit} className="submit-button" disabled={loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? "Processing..." : "Upload & Summarize"}
        </button>

        {summary && (
          <div className="result-section">
            <h2 className="result-title">📄 Summary:</h2>
            <div className="summary-content">{summary}</div>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="result-section">
            <h2 className="result-title">✅ Extracted Tasks:</h2>
            <ul className="tasks-list">
              {tasks.map((task, index) => (
                <li key={index} className={`task-item ${getPriorityClass(task.priority)}`}>
                  <div className="task-detail">
                    <strong>Task:</strong> {task.task}
                  </div>
                  <div className="task-detail">
                    <strong>Assignee:</strong> {task.assignee}
                  </div>
                  <div className="task-detail">
                    <strong>Deadline:</strong> {task.deadline}
                  </div>
                  <div className="task-detail">
                    <strong>Priority:</strong> {task.priority}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="right-section">
        <video className="robot-video" autoPlay loop muted playsInline preload="auto">
          <source src="public/Recording 2025-07-28 010607.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

export default App

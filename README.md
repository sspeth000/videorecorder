# 🎥 Private Video Recorder

A simple, modern browser-based video recorder that lets you record video directly from your camera and save it to your device.

**No account. No backend. No upload system. Just your browser and your camera.**

## ✨ Features

- 📹 Record video directly in your browser
- 🎙️ Capture microphone audio
- 👀 Live camera preview
- ⏱️ Built-in recording timer
- ▶️ Preview recordings before saving
- 💾 Download recordings directly to your device
- 📱 Responsive design for phones, tablets, and computers
- 🌙 Modern dark/glass-style interface
- 🔒 Local browser-based recording
- 🚫 No video upload functionality

## 🔐 Privacy

Privacy is the main point of this project.

The recording is created locally in your browser using the Web MediaRecorder API. This project does not use a backend or provide an upload endpoint for your recordings.

The basic flow is:

Camera + Microphone
        ↓
     Browser
        ↓
   MediaRecorder
        ↓
   Local video Blob
        ↓
   Your device

Your recording is not uploaded by the recorder itself.

> Your browser will still ask for permission to access your camera and microphone. You can deny either permission if you don't want to use it.

## 🛠️ Built With

- HTML
- CSS
- JavaScript
- `navigator.mediaDevices.getUserMedia()`
- `MediaRecorder`
- Browser Blob URLs

There is no server-side code required.

## 🚀 Running It

You can run the project using GitHub Pages or another HTTPS web host.

The project consists of:

- `index.html`
- `style.css`
- `script.js`

Open the website and select **Start Camera**.

Your browser will request camera and microphone permissions. Once permission is granted, you can start recording.

## 🌐 GitHub Pages

This project is designed to work particularly well with GitHub Pages because it doesn't require a server.

If your repository is:

https://github.com/sspeth000/videorecorder

your GitHub Pages site can be accessed at:

https://sspeth000.github.io/videorecorder/

## 📁 Project Structure

```text
videorecorder/
│
├── index.html      # Main webpage
├── style.css       # Website styling
├── script.js       # Camera and recording functionality
└── README.md       # Project documentation

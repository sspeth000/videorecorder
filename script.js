const preview = document.getElementById("preview");
const recording = document.getElementById("recording");

const startCamera = document.getElementById("startCamera");
const switchCamera = document.getElementById("switchCamera");
const startRecording = document.getElementById("startRecording");
const stopRecording = document.getElementById("stopRecording");

const status = document.getElementById("status");
const timer = document.getElementById("timer");

const result = document.getElementById("result");
const download = document.getElementById("download");

let stream = null;
let recorder = null;
let chunks = [];

let timerInterval = null;
let startTime = null;
let videoURL = null;

let facingMode = "user";

function getMimeType() {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4"
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return "";
}

async function getCameraStream() {
  const attempts = [
    {
      video: {
        facingMode: facingMode,
        width: { ideal: 3840 },
        height: { ideal: 2160 },
        frameRate: { ideal: 60 }
      },
      audio: true
    },
    {
      video: {
        facingMode: facingMode,
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 60 }
      },
      audio: true
    },
    {
      video: {
        facingMode: facingMode,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: true
    },
    {
      video: {
        facingMode: facingMode
      },
      audio: true
    }
  ];

  let lastError = null;

  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function startCameraStream() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  status.textContent = "Starting camera...";

  try {
    stream = await getCameraStream();

    preview.srcObject = stream;

    const videoTrack = stream.getVideoTracks()[0];

    if (videoTrack) {
      console.log(
        "Camera settings:",
        videoTrack.getSettings()
      );
    }

    status.textContent =
      facingMode === "user"
        ? "Front camera ready"
        : "Back camera ready";

    startCamera.disabled = true;
    switchCamera.disabled = false;
    startRecording.disabled = false;

  } catch (error) {
    console.error("Camera error:", error);

    status.textContent =
      "Unable to access the camera.";
  }
}

startCamera.addEventListener("click", async () => {
  await startCameraStream();
});

switchCamera.addEventListener("click", async () => {
  if (recorder && recorder.state !== "inactive") {
    status.textContent =
      "Stop the recording before switching cameras.";
    return;
  }

  switchCamera.disabled = true;
  startRecording.disabled = true;

  facingMode =
    facingMode === "user"
      ? "environment"
      : "user";

  await startCameraStream();
});

startRecording.addEventListener("click", () => {
  if (!stream) return;

  chunks = [];

  const mimeType = getMimeType();

  const options = {
    videoBitsPerSecond: 50000000,
    audioBitsPerSecond: 320000
  };

  if (mimeType) {
    options.mimeType = mimeType;
  }

  try {
    recorder = new MediaRecorder(stream, options);
  } catch (error) {
    console.error("Recorder error:", error);

    try {
      recorder = new MediaRecorder(stream);
    } catch (fallbackError) {
      console.error(
        "Fallback recorder error:",
        fallbackError
      );

      status.textContent =
        "This browser cannot record video.";

      return;
    }
  }

  recorder.ondataavailable = event => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.onerror = event => {
    console.error(
      "Recording error:",
      event.error
    );

    status.textContent =
      "An error occurred while recording.";
  };

  recorder.onstop = saveRecording;

  recorder.start();

  startTime = Date.now();

  timerInterval = setInterval(
    updateTimer,
    1000
  );

  status.textContent = "🔴 Recording";

  startRecording.disabled = true;
  switchCamera.disabled = true;
  stopRecording.disabled = false;
});

stopRecording.addEventListener("click", () => {
  if (!recorder || recorder.state === "inactive") {
    return;
  }

  recorder.stop();

  clearInterval(timerInterval);
  timerInterval = null;

  status.textContent =
    "Recording stopped";

  startRecording.disabled = false;
  switchCamera.disabled = false;
  stopRecording.disabled = true;
});

function saveRecording() {
  if (!recorder || chunks.length === 0) {
    status.textContent =
      "No recording data was created.";

    return;
  }

  const mimeType =
    recorder.mimeType || "video/webm";

  const blob = new Blob(chunks, {
    type: mimeType
  });

  if (videoURL) {
    URL.revokeObjectURL(videoURL);
  }

  videoURL = URL.createObjectURL(blob);

  recording.src = videoURL;

  download.href = videoURL;

  const extension =
    mimeType.includes("mp4")
      ? "mp4"
      : "webm";

  download.download =
    `recording-${Date.now()}.${extension}`;

  result.classList.remove("hidden");

  status.textContent =
    "Recording ready — it has not been uploaded.";
}

function updateTimer() {
  if (!startTime) {
    return;
  }

  const elapsed = Math.floor(
    (Date.now() - startTime) / 1000
  );

  const minutes =
    Math.floor(elapsed / 60);

  const seconds =
    elapsed % 60;

  timer.textContent =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;
}

timer.textContent = "00:00";

window.addEventListener("beforeunload", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  if (videoURL) {
    URL.revokeObjectURL(videoURL);
  }
});

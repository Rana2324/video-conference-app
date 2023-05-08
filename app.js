//select
const video = document.getElementById("video");
const muteBtn = document.getElementById("muteBtn");
const cameraOff = document.getElementById("cameraoff");
const selectCam = document.getElementById("selectCam");
const selectMic = document.getElementById("selectMic");
const screenShare = document.getElementById("screenShare");

//

let mediaStream;
let mute = false;
let camera = true;
let currentCam;

//mute button
muteBtn.addEventListener("click", (e) => {
  if (mute) {
    mute = false;
    muteBtn.textContent = "Mute";
    mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
  } else {
    mute = true;
    muteBtn.textContent = "Unmute";
    mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
  }
});

//camera turn function

cameraOff.addEventListener("click", () => {
  if (camera) {
    cameraOff.textContent = "Turn on camera";
    camera = false;
    mediaStream.getVideoTracks().forEach((track) => {
      track.enabled = false;
    });
  } else {
    cameraOff.textContent = "Turn off camera";
    camera = true;
    mediaStream.getVideoTracks().forEach((track) => {
      track.enabled = true;
    });
  }
});

//get media
async function getUserMedia(cameraId, micId) {
  currentCam = cameraId === null ? currentCam : cameraId;

  currentCam = cameraId;

  const initialConfiguration = {
    video: true,
    audio: true,
  };
  const userPreferredCameraConfiguration = {
    audio: true,
    video: {
      deviceId: cameraId,
    },
  };
  const videoOption = currentCam ? { deviceId: currentCam } : true;
  const userPreferredMicConfiguration = {
    video: videoOption,
    audio: {
      deviceId: micId,
    },
  };

  console.log(currentCam, videoOption);
  try {
    mediaStream = await window.navigator.mediaDevices.getUserMedia(
      cameraId || micId
        ? cameraId
          ? userPreferredCameraConfiguration
          : userPreferredMicConfiguration
        : initialConfiguration
    );

    displayMedia();
    getAllCameras();
    getAllMic();

    console.log(mediaStream.getAudioTracks());
  } catch (error) {
    console.log(error);
  }
}

getUserMedia();

//share screen

async function getShareScreen() {
  try {
    mediaStream = await window.navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
    displayMedia();
  } catch (error) {
    console.log(error);
  }
}

screenShare.addEventListener("click", getShareScreen);

//display media

function displayMedia() {
  video.srcObject = mediaStream;

  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
}

//get all camera access

async function getAllCameras() {
  const currentCamera = mediaStream.getVideoTracks()[0];
  const allDevices = await window.navigator.mediaDevices.enumerateDevices();
  selectCam.innerHTML = "";
  allDevices.forEach((device) => {
    if (device.kind === "videoinput") {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label;
      option.selected = device.label === currentCamera.label ? true : false;
      selectCam.appendChild(option);
    }
  });
}
//get all microphone access

async function getAllMic() {
  const currentMic = mediaStream.getVideoTracks()[0];
  const allDevices = await window.navigator.mediaDevices.enumerateDevices();
  selectMic.innerHTML = "";
  allDevices.forEach((device) => {
    if (device.kind === "audioinput") {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label;
      option.selected = device.label === currentMic.label ? true : false;
      selectMic.appendChild(option);
    }
  });
}

//select a specific camera

selectCam.addEventListener("input", (e) => {
  const micId = e.target.value;
  getUserMedia(micId);
});
//select a specific micro phone

selectCam.addEventListener("input", (e) => {
  const cameraId = e.target.value;
  getUserMedia(currentCam, cameraId);
});

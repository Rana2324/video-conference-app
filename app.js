//select
const video = document.getElementById("video");
const muteBtn = document.getElementById("muteBtn");
const cameraOff = document.getElementById("cameraoff");
const selectCam = document.getElementById("selectCam");
const selectMic = document.getElementById("selectMic");

//

let mediaStream;
let mute = false;
let camera = true;

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
async function getUserMedia() {
  try {
    mediaStream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    displayMedia();
  } catch (error) {
    console.log(error);
  }
}

getUserMedia();

//display media

function displayMedia() {
  video.srcObject = mediaStream;

  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
}

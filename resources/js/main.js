let startTime;
let elapsedTime = 0;
let timerInterval;
let zerocheckInterval;
let PPbtn = document.getElementById("playpauseButton");
let RstBtn = document.getElementById("resetButton");
let StpBtn = document.getElementById("stopButton");
let SttBtn = document.getElementById("OptionBtn");
let backbtn = document.getElementById("backbtn");
let mainscreen = document.getElementById("mainsc");
let setscreen = document.getElementById("setsc");
let timerscreen = document.getElementById("timerscreen");
let mstoggle = document.getElementById("mstoggle");
let starttext = document.getElementById("starttext");
let timerbtn = document.getElementById("timerbtn");
let display = document.getElementById("display");
let efftgl = document.getElementById("efftgl");
let oc = document.getElementById("oc");
let timerinputelmnt = document.getElementById("timermin");
let timerval;
let PREFDATA;
let MODE;
let runninstatus;
let updateinterval;
async function updater() {
  runninstatus = "off";
  MODE = "CHRONO";
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  printbig("Starting...", 1000);
  await checkfirstrun();
  await getprefs();
  if (PREFDATA.showms == false) {
    display.innerText = "0:00:00";
  }
  if (PREFDATA.useeff == false) {
    oc.firstElementChild.style.display = "none";
  }
  PPbtn.addEventListener("click", togglerunnin);
  RstBtn.addEventListener("click", reset);
  StpBtn.addEventListener("click", stop);
  SttBtn.addEventListener("click", showsettings);
  timerbtn.addEventListener("click", settimer);
  document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
      togglerunnin();
    }
  });
  if (PREFDATA.showms == false) {
    updateinterval = 100;
  }
  if (PREFDATA.showms == true) {
    updateinterval = 10;
  }
}

async function readdata() {
  let response = await Neutralino.storage.getData({
    bucket: "prefs",
  });
  return JSON.parse(response.data);
}

async function getprefs() {
  PREFDATA = await readdata();
}

async function firstdetected() {
  await Neutralino.filesystem.createDirectory({
    path: "./.storage",
  });
  await Neutralino.filesystem.writeFile({
    fileName: "./.storage/prefs.neustorage",
    data: '{"showms":true , "useeff":true}',
  });
  printbig("GenConfig..", 500);
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

async function checkfirstrun() {
  try {
    let response = await Neutralino.filesystem.readFile({
      fileName: "./.storage/prefs.neustorage",
    });
    var res = response.data;
  } catch (error) {
    if (error.includes("Unable to open ./.storage/prefs.neustorage")) {
      console.log(error);
      console.log("firstrun");
      firstdetected();
    }
  }
}

function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);
  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);
  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);
  let diffInMs = (diffInSec - ss) * 100;
  let ms = Math.floor(diffInMs);
  let formattedHH = hh.toString().padStart(1, "0");
  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  let formattedMS = ms.toString().padStart(2, "0");

  if (PREFDATA.showms == true) {
    return `${formattedHH}:${formattedMM}:${formattedSS}:${formattedMS}`;
  }
  if (PREFDATA.showms == false) {
    return `${formattedHH}:${formattedMM}:${formattedSS}`;
  } 
}

function print(txt) {
  display.innerHTML = txt;
}

function start() {
  startTime = Date.now() - elapsedTime;
  if (runninstatus == "timerpaused") {
    timerInterval = setInterval(function printTime() {
      elapsedTime = Date.now() - startTime;
      print(timeToString(timerval-elapsedTime));
    }, updateinterval);
    runninstatus = "timerrunning";
  }
  else {
    timerInterval = setInterval(function printTime() {
      elapsedTime = Date.now() - startTime;
      print(timeToString(elapsedTime));
    }, updateinterval);
    runninstatus = "crn";

  }
  document.getElementById("oc").style.opacity = "1";
  PPbtn.innerText = "Pause";
  zerocheckInterval = setInterval(function checkforzero() {
    if (timerval-1000 <= elapsedTime) {
      timeEnded();
    }
  }, 1000);
}

function pause() {
  if (runninstatus == "crn") {
    runninstatus = "crnpaused";
  }
  if (runninstatus == "timerrunning") {
    runninstatus = "timerpaused";
  }
  if (PREFDATA.useeff == false) {
    oc.firstElementChild.style.display = "none";
  }
  if (PREFDATA.useeff == true) {
    document.getElementById("oc").style.opacity = "0.5";
  }
  clearInterval(timerInterval);
  clearInterval(zerocheckInterval);
  PPbtn.innerText = "Resume";
}

function c(d) {
  console.log(d);
  //dEbUG XD
}

function showsettings() {
  pause();
  mainscreen.style.display = "none";
  backbtn.removeAttribute("style");
  setscreen.style.display = "grid";
}

async function mainscreenshow() {
  await getprefs();
  setscreen.style.display = "none";
  timerscreen.style.display = "none";
  backbtn.style.display = "none";
  mainscreen.style.display = "grid";
  if (runninstatus == "timerpaused") {
    print(timeToString(timerval-elapsedTime));
  }
  if (runninstatus == "crn") {
    print(timeToString(elapsedTime));
  }

  if (PREFDATA.useeff == false) {
    oc.firstElementChild.style.display = "none";
  }
  if (PREFDATA.useeff == true) {
    oc.firstElementChild.removeAttribute("style");
  }
}

function printbig(text, time) {
  document.getElementById("bigprint").removeAttribute("style");
  document.getElementById("starttext").innerHTML = text;
  setTimeout(() => {
    document.getElementById("bigprint").style.display = "none";
  }, time);
}

function reset() {
  clearInterval(timerInterval);
  print("reset");
  document.getElementById("timeended").pause();
  document.getElementById("timeended").currentTime = 0;
  display.removeAttribute("style");
  elapsedTime = 0;
  runninstatus = "off";
  setTimeout(() => {
    print(timeToString(elapsedTime));
    RstBtn.removeAttribute("style");
    PPbtn.removeAttribute("style");
    PPbtn.innerText = "Start";
    StpBtn.removeAttribute("style");
  }, 80);
}

function settimer() {
  mainscreen.style.display = "none";
  setscreen.style.display = "none";
  timerscreen.style.display = "grid";
}

function togglerunnin() {
  if (
    runninstatus == "timerpaused" ||
    runninstatus == "crnpaused" ||
    runninstatus == "off"
  ) {
    start();
  } else {
    pause();
  }
}

function getformdata() {
  reset();
  setTimeout(() => {
    timerval = timerinputelmnt.value * 1000 * 60;
  runninstatus = "timerpaused";
  c(timerval);
  print(timeToString(timerval));
  mainscreenshow();
  }, 100);
}

function timeEnded() {
  stop();
  document.getElementById("timeended").loop = true;
  display.style.color = "#fc2149";
  display.innerText = "END";
  display.style.textShadow = "none";
  document.getElementById("timeended").play();
}

function stop() {
  pause();
  document.getElementById("oc").style.opacity = "0";
  RstBtn.style.transitionDuration = "300ms";
  RstBtn.style.width = "50%";
  PPbtn.style.display = "none";
  StpBtn.style.display = "none";
}

efftgl.onclick = async function () {
  console.log("hello");
  await getprefs();
  if (PREFDATA.useeff == false) {
    await Neutralino.storage.putData({
      bucket: "prefs",
      data: JSON.stringify({
        showms: PREFDATA.showms,
        useeff: true,
      }),
    });
    printbig("Applying", 500);
    setTimeout(() => {
      getprefs();
    }, 300);
  }
  if (PREFDATA.useeff == true) {
    await Neutralino.storage.putData({
      bucket: "prefs",
      data: JSON.stringify({
        showms: PREFDATA.showms,
        useeff: false,
      }),
    });
    printbig("Applying", 500);
    setTimeout(() => {
      getprefs();
    }, 300);
  }
};

mstoggle.onclick = async function () {
  await getprefs();
  if (PREFDATA.showms == false) {
    await Neutralino.storage.putData({
      bucket: "prefs",
      data: JSON.stringify({
        showms: true,
        useeff: PREFDATA.useeff,
      }),
    });
    printbig("Applying", 600);
    setTimeout(() => {
      getprefs();
    updateinterval = 10;
    }, 500);
  }
  if (PREFDATA.showms == true) {
    await Neutralino.storage.putData({
      bucket: "prefs",
      data: JSON.stringify({
        showms: false,
        useeff: PREFDATA.useeff,
      }),
    });
    printbig("Applying", 600);
    setTimeout(() => {
      getprefs();
    updateinterval = 1000;

    }, 500);
  }
};

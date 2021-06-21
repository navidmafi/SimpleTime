let startTime;
let elapsedTime = 0;
let timerInterval;
let PPbtn = document.getElementById("playpauseButton");
let RstBtn = document.getElementById("resetButton");
let StpBtn = document.getElementById("stopButton");
let SttBtn = document.getElementById("OptionBtn");
let backbtn = document.getElementById("backbtn");
let mainscreen = document.getElementById("mainsc");
let setscreen = document.getElementById("setsc");
let mstoggle = document.getElementById("mstoggle");
let starttext = document.getElementById("starttext");
let efftgl = document.getElementById("efftgl");
let oc = document.getElementById("oc");
let PREFDATA;
let MODE;
let runninstatus;

function updater() {
  runninstatus = false;
  MODE = "CHRONO";
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  printbig("Starting...", 2000);
  checkfirstrun();
  setTimeout(() => {
    if (PREFDATA.showms == false) {
      document.getElementById("display").innerText = "0:00:00";
    }
    if (PREFDATA.useeff == false) {
      oc.firstElementChild.style.display="none";
    }
  }, 500);
  PPbtn.addEventListener("click", togglerunnin);
  RstBtn.addEventListener("click", reset);
  StpBtn.addEventListener("click",stop)
  SttBtn.addEventListener("click", showsettings)
  document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
      togglerunnin();
    }
  });
  getprefs();
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
  printbig("GenConfig..",500)
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
  else {
    return `err`;
  }
}

function print(txt) {
  document.getElementById("display").innerHTML = txt;
}

function start() {
  runninstatus = true;
  document.getElementById("oc").style.opacity = "1";
  PPbtn.innerText="Pause";
  var x;
  if (PREFDATA.showms == false){
    console.log("runin in 1s mode");
    x=1000;
  }
  if (PREFDATA.showms == true){
    x=10;
  }
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(function printTime() {
    elapsedTime = Date.now() - startTime;
    print(timeToString(elapsedTime));
  }, x);
}

function pause() {
  runninstatus = false;
  document.getElementById("oc").style.opacity = "0.5";
  clearInterval(timerInterval);
  PPbtn.innerText="Resume";
}



function showsettings() {
  mainscreen.style.display = "none";
  backbtn.removeAttribute("style");
  setscreen.style.display = "grid";
}

async function mainscreenshow() {
  await getprefs();
  setscreen.style.display = "none";
  backbtn.style.display = "none";
  mainscreen.style.display = "grid";
  print(timeToString(elapsedTime));
  console.log(PREFDATA.useeff);
  if (PREFDATA.useeff == false) {
    oc.firstElementChild.style.display="none";
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
  elapsedTime = 0;
  runninstatus= false;
  setTimeout(() => {
    print(timeToString(elapsedTime));
    RstBtn.removeAttribute("style");
    PPbtn.removeAttribute("style");
    PPbtn.innerText="Start";
    StpBtn.removeAttribute("style");
  }, 80);
}

function togglerunnin() {
  if (runninstatus == true) {
    pause();
  } else {
    start();
  }
}


function stop() {
  pause();
  document.getElementById("oc").style.opacity = "0";
  RstBtn.style.transitionDuration = "300ms";
  RstBtn.style.width = "50%";
  PPbtn.style.display = "none";
  StpBtn.style.display = "none";
};

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
    }, 500);
  }
};

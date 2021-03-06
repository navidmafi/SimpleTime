/* Copyright (c) 2021 Navid Mafi <navidmafi2006@gmail.com>
 Licensed under the GPLv3 Licence.
See the LICENCE file in the repository root for full licence text.
*/

window.simpletime = {
  setTray: () => {
    let tray = {
      icon: "/favicon.ico",
      menuItems: [
        { id: "SHOW", text: "Show" },
        { id: "SEP", text: "-" },
        { id: "QUIT", text: "Exit" },
      ],
    };
    Neutralino.os.setTray(tray);
  },
  onTrayMenuItemClicked: (event) => {
    switch (event.detail.id) {
      case "SHOW":
        Neutralino.os.showMessageBox({
          type: "INFO",
          title: "Version information",
          content: `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`,
        });
        break;
      case "QUIT":
        Neutralino.app.exit();
        break;
    }
  },
  openGitHub: () => {
    Neutralino.app.open({
      url: "https://github.com/navidmafi/SimpleTime",
    });
  },
  onWindowClose: () => {
    Neutralino.app.exit();
  },
};
let startTime;
let elapsedTime = 0;
let timerInterval;
let zerocheckInterval;
const PlayPauseButton = document.getElementById("playpauseButton");
const ResetButton = document.getElementById("resetButton");
const StopButton = document.getElementById("stopButton");
const OptionButton = document.getElementById("OptionBtn");
const BackButton = document.getElementById("backbtn");
const MainScreen = document.getElementById("MainScreen");
const SettingsScreen = document.getElementById("SettingsScreen");
const TimerScreen = document.getElementById("TimerScreen");
const AboutScreen = document.getElementById("AboutScreen");
const DetailsScreen = document.getElementById("DetailsScreen");
const CreditsScreen = document.getElementById("CreditsScreen");
const mstoggle = document.getElementById("mstoggle");
const starttext = document.getElementById("starttext");
const timerbtn = document.getElementById("timerbtn");
const display = document.getElementById("display");
const timerinputelmnt = document.getElementById("timermin");
const notif = document.getElementById("notif");
const root = document.documentElement;
let timerval;
let PREFDATA;
let MODE;
let runninstatus;
let updateinterval;

async function loadData() {
  try {
    let response = await Neutralino.storage.getData({
      bucket: "prefs",
    });
    PREFDATA = JSON.parse(response.data);
  }
  catch {
    console.log("catched");
    MainScreen.classList.add("hidden");
    root.style.setProperty("--GPrim", "#50c878");
    document.getElementById("firstuse").classList.remove("hidden");
    await Neutralino.filesystem.createDirectory({
      path: "./.storage",
    });
    await Neutralino.filesystem.writeFile({
      fileName: "./.storage/prefs.neustorage",
      data: '{"showms":true,\n"primcolor":"#50c878"}',
    });
  }
  
}

function setConfig(){
  if (!PREFDATA.showms) {
    print("0:00:00");
  }
  root.style.setProperty("--GPrim", PREFDATA.primcolor);

  if (!PREFDATA.showms) {
    updateinterval = 100;
  }
  if (PREFDATA.showms) {
    updateinterval = 10;
  }
  document.getElementById(
    "appDetails"
  ).innerText = `Neutralinojs server: v${NL_VERSION} \n Neutralinojs client: v${NL_CVERSION} \n App Version : 0.4 Pre-release`;
}

function printbig(text, time) {
  document.getElementById("bigprint").classList.remove("hidden");
  document.getElementById("starttext").innerHTML = text;
  setTimeout(() => {
    document.getElementById("bigprint").classList.add("hidden");
  }, time);
}

async function updater() {
  runninstatus = "READY";
  MODE = "CHRONO";
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  printbig("Starting...", 1000);
  await loadData();
  setConfig();
  
}





function Hide(element) {
  element.classList.add("hidden");
}
function UnHide(element) {
  element.classList.remove("hidden");
}

function navigateToSection(sectionID) {
  var bodychilds = document.querySelectorAll("body > div");
  bodychilds.forEach(function (divs) {
    Hide(divs);
  });
  UnHide(document.getElementById(sectionID));
  if (sectionID != "MainScreen") {
    UnHide(BackButton);
  }
  if (sectionID == "MainScreen") {
    Hide(BackButton);
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

async function SendNotif(text){
   UnHide(notif);
  notif.querySelector("p").innerText=text;
  setTimeout(() => {
    notif.classList.toggle('hiddennotif');
  }, 100);
  setTimeout(() => {
    notif.classList.toggle('hiddennotif');

  }, 2100);
  setTimeout(() => {
  Hide(notif);
  }, 2650);

}

function start() {
  startTime = Date.now() - elapsedTime;
  if (runninstatus == "timerpaused") {
    timerInterval = setInterval(function printTime() {
      elapsedTime = Date.now() - startTime;
      print(timeToString(timerval - elapsedTime));
    }, updateinterval);
    runninstatus = "timerrunning";
  } else {
    timerInterval = setInterval(function printTime() {
      elapsedTime = Date.now() - startTime;
      print(timeToString(elapsedTime));
    }, updateinterval);
    runninstatus = "crn";
  }

  PlayPauseButton.innerText = "Pause";
  zerocheckInterval = setInterval(function checkforzero() {
    if (timerval - 1000 <= elapsedTime) {
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
  clearInterval(timerInterval);
  clearInterval(zerocheckInterval);
  if (runninstatus != "READY") {
    PlayPauseButton.innerText = "Resume";
  }
}


function showsettings() {
  pause();
  MainScreen.classList.add("hidden");
  BackButton.classList.remove("hidden");
  SettingsScreen.classList.remove("hidden");
}

function reset() {
  clearInterval(timerInterval);
  print("reset");
  document.getElementById("timeended").pause();
  document.getElementById("timeended").currentTime = 0;
  display.removeAttribute("style");
  elapsedTime = 0;
  runninstatus = "off";
    print(timeToString(elapsedTime));
    ResetButton.removeAttribute("style");
    PlayPauseButton.innerText = "Start";
    UnHide(PlayPauseButton);
    UnHide(StopButton);
}

function togglerunnin() {
  if (
    runninstatus == "timerpaused" ||
    runninstatus == "crnpaused" ||
    runninstatus == "off" ||
    runninstatus == "READY"
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
    print(timeToString(timerval));
    navigateToSection("MainScreen");
  }, 100);
}

function timeEnded() {
  stoptimer();
  document.getElementById("timeended").loop = true;
  display.style.color = "#fc2149";
  display.innerText = "END";
  display.style.textShadow = "none";
  document.getElementById("timeended").play();
}

function stoptimer() {
  pause();
  ResetButton.style.transitionDuration = "300ms";
  ResetButton.style.width = "50%";
  Hide(PlayPauseButton);
  Hide(StopButton);
}

mstoggle.onclick = async function () {
  await loadData();
  if (PREFDATA.showms == false) {
    await Neutralino.storage.putData({
      bucket: "prefs",
      data: JSON.stringify({
        showms: true,
        primcolor: PREFDATA.primcolor,
      }),
    });
    SendNotif("Applied");
  }
  else if (PREFDATA.showms == true) {
    await Neutralino.storage.putData({
      bucket: "prefs",
      data: JSON.stringify({
        showms: false,
        primcolor: PREFDATA.primcolor,
      }),
    });
    SendNotif("Applied");
  

  }
  await loadData();
  if (PREFDATA.showms == true) {
    updateinterval = 10;
  }
  else if (PREFDATA.showms == false) {
    updateinterval = 1000;
  }
  if (runninstatus == "timerpaused") {
      elapsedTime = Date.now() - startTime;
      print(timeToString(timerval - elapsedTime));
  } else {
      elapsedTime = Date.now() - startTime;
      print(timeToString(elapsedTime));
  }
};

Neutralino.events.on("trayMenuItemClicked", simpletime.onTrayMenuItemClicked);
Neutralino.events.on("windowClose", simpletime.onWindowClose);
Neutralino.init();
window.simpletime.setTray();

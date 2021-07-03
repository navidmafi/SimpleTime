## SimpleTime
A simple cross-platform timer and stopwatch app with modern design in mind. Using Neutralino JS. heavily in development, bugs are expected.

## Available for
- Windows 

**Note : You need to have WebView2 or Latest Microsoft Edge Installed for app to function correctly, check "Apps and features" in Windows settings. If you don't have it installed, download it from [here](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section).**

**Note: if you are getting a white screen after opening app, run this command as admin**

```CheckNetIsolation.exe LoopbackExempt -a -n="Microsoft.Win32WebViewHost_cw5n1h2txyewy"```
> The reason is that accessing localhost from a UWP context is disabled by default. Run the following command with administrative privileges on the command prompt. 

Unfortunately it is a problem with Neutralino JS.

- Linux

- Mac

## Note:
Check Known Bugs before opening new ones, this project is in development.

## Build
```bash
npm i -g @neutralinojs/neu
git clone https://github.com/meiaihara06/SimpleTime
cd SimpleTime
neu build -r
```

## Contributions

SimpleTime is open to contributions, but I recommend creating an issue or replying in a comment to let me know what you are working on first that way we don't overwrite each other.

## Future of the project
this project may be a part of a bigger parent project. But for now, I don't have any plans.

## Thanks
to [@SinisterStalker](https://github.com/sinisterstalker) and [@Al1382](https://github.com/Al1382) for Testing and ideas.

## License and Copyright
- Neutralinojs core: MIT. Copyright © 2021 Neutralinojs and contributors.
- SimpleTime :  GNU GPLv3. Copyright © 2021 Navid Mafi Ranji and contributors.
- DSEG Font Family : OFL-1.1. Copyright © 2021 DSEG Font Family and contributors.
- Sound Effects By [Zapsplat](https://www.zapsplat.com) , [License](https://www.zapsplat.com/license-type/standard-license/).
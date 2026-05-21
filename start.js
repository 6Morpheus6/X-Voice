const path = require('path')
module.exports = async (kernel) => {
  let env = {
      PYTHONUTF8: 1,
      LOW_MEMORY: 1
  }
  if (kernel.platform === "win32") {
    env = {
      ...env,
      PHONEMIZER_ESPEAK_PATH: "C:\\Program Files\\eSpeak NG",
      PHONEMIZER_ESPEAK_LIBRARY: "C:\\Program Files\\eSpeak NG\\libespeak-ng.dll",
      ESPEAK_DATA_PATH: "C:\\Program Files\\eSpeak NG\\espeak-ng-data",
      HF_HUB_DISABLE_SYMLINKS_WARNING: "1",
      HF_HUB_DISABLE_SYMLINKS: "1",
    }
  } else if (kernel.platform === 'darwin') {
    const bin = kernel.path("bin/homebrew/Cellar")
    env.ESPEAK_DATA_PATH = `${bin}/espeak-ng/1.52.0/share/espeak-ng-data`
    env.PHONEMIZER_ESPEAK_LIBRARY = `${bin}/espeak-ng/1.52.0/lib/libespeak-ng.dylib`
  }
  return {
    requires: {
      bundle: "ai",
    },
    daemon: true,
    run: [
      {
        method: "shell.run",
        params: {
          conda: "conda_env",
          env,
          path: "app",
          input: true,
          message: [
            "x-voice_infer-gradio --host 127.0.0.1 --port 7860",
          ],
          on: [{
            "event": "/http:\/\/\\S+/",
            "done": true
          }]
        }
      },
      {
        method: "local.set",
        params: {
          url: "{{input.event[0]}}"
        }
      }
    ]
  }
}
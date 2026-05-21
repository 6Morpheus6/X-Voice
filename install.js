module.exports = {
  requires: {
    bundle: "ai",
  },
  run: [
    {
      when: "{{!exists('app')}}",
      method: "shell.run",
      params: {
        message: [
          "git clone --recursive https://github.com/6Morpheus6/XVoice app",
        ]
      }
    },
    {
      method: "shell.run",
      params: {
      conda: {
        path: "conda_env",
        python: "python=3.10.16"
        },
        path: "app",
        message: [
          "conda install -y -c conda-forge pynini openjdk ffmpeg"
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        conda: "conda_env",
        path: "app",
        message: [
          "uv pip install nemo_text_processing --no-deps",
          "uv pip install -e .",
          "uv pip install sacremoses cdifflib"
        ]
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          conda: "conda_env",
          path: "app"
        }
      }
    },
    {
      when: "{{which('apt')}}",
      method: "shell.run",
      params: {
        sudo: true,
        message: "apt install libaio-dev espeak-ng"
      },
        next: "all"
    },
    {
      when: "{{which('yum')}}",
      method: "shell.run",
      params: {
        sudo: true,
        message: "yum install libaio-devel espeak-ng"
      },
        next: "all"
    },
    {
      when: "{{which('brew')}}",
      method: "shell.run",
      params: {
        message: "brew install espeak-ng"
      },
        next: "all"
    },
    {
      when: "{{which('winget')}}",
      method: "shell.run",
      params: {
        sudo: true,
        message: "winget install --id=eSpeak-NG.eSpeak-NG -e --silent --accept-source-agreements --accept-package-agreements"
      }
    },
    {
      method: "hf.download",
      params: {
        "path":"app",
        "_": [ "XRXRX/X-Voice" ],
        "local-dir": "ckpts"
      }
    }
  ]
}

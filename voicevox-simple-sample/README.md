# VoiceVox Simple Sample

## 始め方
### イメージのビルド

```
docker compose up
```

利用しているパソコンのメモリが足りない場合は、deploy.replicasを1や2に設定してください。

```
services:
  voicevox:
    image: voicevox/voicevox_engine:cpu-ubuntu20.04-latest
    expose:
      - "50021"
    deploy:
      replicas: 5
```

### アプリの起動

```
yarn
yarn dev
```

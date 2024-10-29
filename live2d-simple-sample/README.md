# Live2D Simple Sample
## 始め方
### live2dcubismcore.min.js
Live2DのSDKページからCoreライブラリをインストールしてください。

[https://www.live2d.com/sdk/download/web/](https://www.live2d.com/sdk/download/web/)

ダウンロードしたファイルを本コードのpublic/live2dcubismcore.min.jsに追加してください。

### アプリの起動
```
yarn

yarn start
```

## フォルダ構成
```
.
├── README.md
├── index.html
├── package.json
├── public
│   ├── Resources
│   │   ├── Hiyori
│   │   │   ├── Hiyori.2048
│   │   │   │   ├── texture_00.png
│   │   │   │   └── texture_01.png
│   │   │   ├── Hiyori.cdi3.json
│   │   │   ├── Hiyori.moc3
│   │   │   ├── Hiyori.model3.json
│   │   │   ├── Hiyori.physics3.json
│   │   │   ├── Hiyori.pose3.json
│   │   │   ├── Hiyori.userdata3.json
│   │   │   └── motions
│   │   │       ├── Hiyori_m01.motion3.json
│   │   │       └── Hiyori_m04.motion3.json
│   │   ├── back_class_normal.png
│   │   └── icon_gear.png
│   └── live2dcubismcore.min.js
├── src
│   ├── libs
│   │   └── live2d
│   │       ├── CHANGELOG.md
│   │       ├── LICENSE.md
│   │       ├── README.ja.md
│   │       ├── README.md
│   │       ├── package-lock.json
│   │       ├── package.json
│   │       ├── src
│   │       │   ├── cubismdefaultparameterid.ts
│   │       │   ├── cubismframeworkconfig.ts
│   │       │   ├── cubismmodelsettingjson.ts
│   │       │   ├── effect
│   │       │   │   ├── cubismbreath.ts
│   │       │   │   ├── cubismeyeblink.ts
│   │       │   │   └── cubismpose.ts
│   │       │   ├── icubismallcator.ts
│   │       │   ├── icubismmodelsetting.ts
│   │       │   ├── id
│   │       │   │   ├── cubismid.ts
│   │       │   │   └── cubismidmanager.ts
│   │       │   ├── live2dcubismframework.ts
│   │       │   ├── math
│   │       │   │   ├── cubismmath.ts
│   │       │   │   ├── cubismmatrix44.ts
│   │       │   │   ├── cubismmodelmatrix.ts
│   │       │   │   ├── cubismtargetpoint.ts
│   │       │   │   ├── cubismvector2.ts
│   │       │   │   └── cubismviewmatrix.ts
│   │       │   ├── model
│   │       │   │   ├── cubismmoc.ts
│   │       │   │   ├── cubismmodel.ts
│   │       │   │   ├── cubismmodeluserdata.ts
│   │       │   │   ├── cubismmodeluserdatajson.ts
│   │       │   │   └── cubismusermodel.ts
│   │       │   ├── motion
│   │       │   │   ├── acubismmotion.ts
│   │       │   │   ├── cubismexpressionmotion.ts
│   │       │   │   ├── cubismexpressionmotionmanager.ts
│   │       │   │   ├── cubismmotion.ts
│   │       │   │   ├── cubismmotioninternal.ts
│   │       │   │   ├── cubismmotionjson.ts
│   │       │   │   ├── cubismmotionmanager.ts
│   │       │   │   ├── cubismmotionqueueentry.ts
│   │       │   │   └── cubismmotionqueuemanager.ts
│   │       │   ├── physics
│   │       │   │   ├── cubismphysics.ts
│   │       │   │   ├── cubismphysicsinternal.ts
│   │       │   │   └── cubismphysicsjson.ts
│   │       │   ├── rendering
│   │       │   │   ├── cubismclippingmanager.ts
│   │       │   │   ├── cubismrenderer.ts
│   │       │   │   ├── cubismrenderer_webgl.ts
│   │       │   │   └── cubismshader_webgl.ts
│   │       │   ├── type
│   │       │   │   ├── csmmap.ts
│   │       │   │   ├── csmrectf.ts
│   │       │   │   ├── csmstring.ts
│   │       │   │   └── csmvector.ts
│   │       │   └── utils
│   │       │       ├── cubismdebug.ts
│   │       │       ├── cubismjson.ts
│   │       │       ├── cubismjsonextension.ts
│   │       │       └── cubismstring.ts
│   │       └── tsconfig.json
│   ├── main.ts
│   └── utils
│       └── live2d
│           ├── lappdefine.ts
│           ├── lappdelegate.ts
│           ├── lappglmanager.ts
│           ├── lapplive2dmanager.ts
│           ├── lappmodel.ts
│           ├── lapppal.ts
│           ├── lappsprite.ts
│           ├── lapptexturemanager.ts
│           ├── lappview.ts
│           ├── lappwavfilehandler.ts
│           └── touchmanager.ts
├── tree.txt
├── tsconfig.json
├── vite.config.mts
└── yarn.lock
```

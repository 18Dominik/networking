# networking
## purpose
a networking app in react native running standalone (without necessity for backend) on android smartphone.
The app uses react native expo instead of react native CLI for Developer Experience purposes. 
You can initialize a react native app with expo by.
```npx create-expo-app --template ```

## prepare
- go to the app directory and run `npm i`
- install expo cli if not there yet: `npm install -g expo-cli`
- install eas cli: `npm install -g eas-cli`
## run app in IDE
start app in app directory: 
- ```npx expo --web``` or
- for using Gitpod and testing app on smartphone (different network) via QR code and Expo Go app: ```npx expo --tunnel``` (enables connecting device/smartphone by using Expo Go App and Scannign QR Code)
-  if you encounter problems with babel config, make sure to put it in json format: babel.config.json with content
   ```
   {
   "presets": ["babel-preset-expo"]
   }
   ```
## Install app on smartphone
this todo app can be installed on a smartphone. It stores data only in frontend (fe) and does not require a dedicated backend.

1. Build the App as Stand-alone app: Production Release to be independet on Metro Bundler/ Server: ```eas build --platform android --profile production```
2. Output is aab file that needs to be converted to apks file with `bundletool`
3. install bundletool [Java Program from Android Studio](https://github.com/google/bundletool/releases)
   - install java sdk e.g. by using `chocolatey`: ```choco install jdk8```
   - prepare your keystore to sign .apks files: ```keytool -genkeypair -v -keystore your-keystore-name.keystore -alias your-key-alias -keyalg RSA -keysize 2048 -validity 10000```
4. Sign .apks with bundletool: ```java -jar bundletool-all-x.x.x.jar build-apks --bundle=/path/to/your/app.aab --output=/path/to/your/output.apks --mode=universal --ks=your-keystore-name.keystore --ks-pass=pass:your-keystore-password --ks-key-alias=your-key-alias --key-pass=pass:your-key-alias-password```
5. Connect Android Smartphone and enable developer tools
6. Install ADB (Android Developer Brdige, for connecting computer with smartphone)
   - installing Android Studio
   - Adding adb to PATH environment variable. Verify with ```adb version```
7. Install app: ```java -jar bundletool-all-x.x.x.jar install-apks --apks=path/to/your/file.apks```


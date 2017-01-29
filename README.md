# NBCUNow "Directory" App

Hybrid employee directory lookup/search mobile app build with Cordova, Ionic and AngularJS

# Install IDE's, tools and libraries

* Install Xcode
* Install Xcode Command Line Tools
* Install Andriod Studio
* Install JDK 1.8


* `sudo npm install -g cordova ionic`
* `sudo npm install -g ios-sim`
* `sudo npm install --global --unsafe-perm ios-deploy`

# Server the app for local testing

* `ionic serve` (to test in browser, does it's own live reload)

# Build

## iOS

* `ionic build ios`

## Android

* `ionic build android`

# Run in emulator

## iOS

* `ionic emulate ios`

## Android

* `ionic emulate andriod`

# Running on a device

## iOS

* `ionic build ios` (OR just build/run in Xcode)
* `ionic run ios --device`

## Android

* `ionic build andriod` (OR just build/run in Andriod Studio)
* `ionic run android --device`

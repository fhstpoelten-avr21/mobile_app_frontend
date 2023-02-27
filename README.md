<p align="center">
  <a href="https://ionicframework.com/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Ionic_Logo.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ionic Frontend

## Description
A simple Ionic App with JWT Authentication, using RxJs Observable Pattern


## Tech Stack

| Technologie                                                        | Version | Description                                    |
|--------------------------------------------------------------------|---------|------------------------------------------------|
| [Angular](https://angular.io/docs)                                 | 15      | Frontend Web Development Framework             |
| [Yarn](https://yarnpkg.com/)                                       | 1.22    | Package manager                                |
| [Capacitor](https://capacitorjs.com/)                              | 4.1.1   | Cross Device support                           |


## Run

Move in the root directory and execute ```yarn && yarn start```

## Publish to Android
We will use [Android Studio](https://developer.android.com/studio) as build tool. That installs all necessary SDKs to your machine. 

1. ```ionic config set -g npmClient yarn``` (optional | Switching ionic package manager to yarn)
2. ```ionic capacitor add android``` (creates /android and builds /www directories)
3. ```ionic capacitor copy android``` (copies /www/ source into /android)
4. ```ionic capacitor run android``` (you have to [add a virtual or real device](https://developer.android.com/studio/run/managing-avds) first in android studio)

## License
[MIT licensed](LICENSE)

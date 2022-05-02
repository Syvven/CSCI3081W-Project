# CSCI 3081 Project Extension

**Team members:**

-  Jasper Bellefeuille (belle172)
-  Noah Hendrickson (hend0800)
-  Dan Runnignen (runni028)
-  Kevin Zheng (zhen0312)

<!-- Edit this? -->

This repository contains the support code needed to visualize the CSCI 3081W project and run tests.

## In This File

-  Quick Start Guide
-  Files Changed
-  Retrospective

## Quick Start Guide

There are two recommended ways to run this project, either through a Docker image or through the CSE labs machines.

First, clone this repo onto your local device. If `git` is installed, use the following:

```bash
git clone https://github.umn.edu/umn-csci-3081-s22/CSCI3081W-Project.git
```

_A zip file is also available through the repo page under the `Code` dropdown._

Make sure to navigate into the repository before continuing.

```bash
cd CSCI3081W-Project
```

### Building and Running the Docker Image

_Note: You will need to have some version of Docker available on your system. [Docker Desktop](https://www.docker.com/products/docker-desktop/) is available for a variety of OS distributions._

Build the project using the `docker` command in the base of the repository. This will take several minutes.

```bash
docker build -t project .
```

_You may give the new image a name other than `project`._

Once the project is built, the image can be run by connecting to port `80`. The code below shows connecting to the IP address for localhost on port `8080`.

```bash
docker run -p 127.0.0.1:8080:80 project
```

The server is now up and running and accessible through http://127.0.0.1:8080/ on your local device.

### Building and Running Locally on a CSE Lab Machine

Run the following commands in the base of the repository to ensure a fresh, clean build.

```bash
make clean && make -j
```

_The `-j` flag is used to build on multiple threads. If it is causing problems on your device, you may omit it._

As long as the build was successful, the server will start with the following command.

```bash
./build/bin/transit_service 8080 apps/transit_service/web/
```

The server is now up and running and accessible through http://127.0.0.1:8080/ on your lab machine.

-  Notes
   -  Always have sim open if you want sim to run, as update calls don't activate if sim is closed or asleep

## Files Changed or Added

-  `apps/transit_service`
   -  `src/transit_service.cc`
   -  `web`
      -  `assets`
         -  `texture/drone.gif` (added)
         -  `model`
            -  `drone.json` (added)
            -  `robot.json` (added)
      -  `js`
         -  `dispatch.js` (added)
         -  `main.js`
         -  `schedule.js` (added)
      -  `scenes/umn.json`
      -  `dispatch.html`
      -  `index.html`
      -  `schedule.html`
-  `libs`
   -  `routing/include/distance_function.h`
   -  `transit`
      -  `include/simulation_model.h`
      -  `src/simulation_model.cc`
-  `CODEOWNERS` (added)
-  `Dockerfile`
-  `README.md`

## Retrospective

### What went well?

-  The technical aspects of the project were complete well before the due date.
-  PRs were completed in a reasonable amount of time so that none of the work was blocked.
-  Communication about what was needed to be done was strong.
-  Discord was great for efficient communication.

### What didn't go well?

-  Connecting to VOLE was a pain but was the most reliable way to work on the project.
-  VS Code LiveShare wouldn't connect through VOLE and was otherwise still choppy.
-  Breaking bugs still slipped through PRs. PRs not always checked thoroughly, mostly wanted to get new code into main branch.
-  Waited until close to the due date to do non-technical aspects of the project.

### What can we do to do better next time?

-  Have a more complete plan to start with.
-  Be more thorough when reviewing PRs.
-  Create a test suite to help catch silly mistakes.

<!-- ## What is in this repo?

-  `README.md` (you are reading this!) which contains files and sprint retrospective.
-  `.gitignore`
-  `src` folder, which contains:
   -  `main.cc`
   -  `web_app.h` and `web_app.cc`
-  `test` folder, which contains:
   -  `example_test.cc` to get you started
-  `web` folder, which contains:
   -  The javascript visualization code -->

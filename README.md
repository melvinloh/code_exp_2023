# DSTA Brainhack CODE_EXP 2023

## About the Competition

Organized by DSTA, CODE EXP is a hackathon where participants can get to leverage cloud technologies to code and develop mobile applications.
Participants are to innovate and develop an app to solve real-world problems! The theme for the competition is: **Hack for Public Good**. 
Participants are to work on an application for the benefit/well-being of the public. 

## Deliverables for Qualifiers

- [Wireframe](https://www.figma.com/file/ok2RZYXx9M2uyqusGX7DpM/code_exp-wireframe?type=whiteboard&t=nBycGwRcrWux6BB7-1) made on Figma
- [System Architecture](https://www.figma.com/file/pq6yJLABmHrupsthdZ9HSf/code_exp-architecture?type=whiteboard&t=MSHPrPCd5MGqDtt3-6) also on Figma
- [Elevator Pitch](https://www.youtube.com/watch?v=jPgynG7qG3Y) on YouTube *(1 minute)*
- [Value Proposition Powerpoint presentation](./code_exp%20qualifiers%20ppt.pdf) *(10 - 15 slides)*

## About the App (App Features)

Gustoso is an innovative food marketplace mobile app that revolutionizes the way users can participate in sustainable food practices. 
With Gustoso, individuals can conveniently buy, sell, or donate their surplus or rejected food items at home. 
Our mission is to address the pressings concern of food inflation in Singapore while simultaneously combating food wastage generated locally. 
By connecting people and fostering a culture of resourcefulness, Gustoso aims to create a positive impact on both the environment and the economy.

This application is created using [**Django**](https://docs.djangoproject.com/en/4.1/) for the backend,
and [**React Native**](https://reactnative.dev/) for the frontend. 
Geolocation processing is done via [**OSM API**](https://nominatim.openstreetmap.org/ui/search.html).


The mobile app includes a variety of features including, but not limited to:
- custom user registration and sign-in
- view food listings near you and recommended for you
- create, read and delete food listings (with upload image functionality)
- search bar (by querying database using ajax search)
- location search (by querying OSM API)
- sort food listing by expiration date, price and pick up location

## Getting Started

To get started, follow the steps below:

1. Install the following dependencies
- python 3.7.0, django 3.2
- packages in `requirements.txt` file (using `pip install`)
- change directory to `frontend` (where the `package.json` file is located) and run `npm install` to install dependencies for the frontend app

## Running the App
Once all dependencies are installed, run the app and you are all set! 

# Getting Started with BTC Guessing Game

This game is a BTC price guessing game. You can guess whether BTC is going up or down in the next minute, then if your prediction is correct, you get a poin. If you don't get the preduction correct, then a point will be deducted from you. The heighest scorers will be put on a leaderboard for everyone to compete.

## Requirements

node version >=18

## Setup

In order to set this up on your machine, follow the following steps.

### Run the backend service

Make sure you have the [backend service](https://github.com/hseifu/btc-backend) running on your machine.

### Set the .env file

Copy the `.env.example` file and rename it to just `.env`. Set the `VITE_API_URL` value in your `.env` file to where you have your backend deployed. This is by default: http://localhost:3009.

### Install the dependencies

`npm install`

### Start the app

`npm run dev`

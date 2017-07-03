## Installation
```
git clone https://github.com/bflemi3/acr-configurator.git
npm install
```

## Staring the server
Before starting, set the following environment variables
* `DATABASE_HOST` - The url of the aql database
* `DATABASE_PORT` - The port of the aql database
* `CONFIGURATOR_PORT` - [Optional] The port to use to start the server. Defaults to `8081`

Then from the root of the server...
```
node index.js
```

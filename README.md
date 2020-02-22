# FixMyKml

## What is this? 
This [node](https://nodejs.org/en/)-based application 
* loads a given [kml](file)
* extracts placemarks having an address but no coordinates
* takes the address and tries to resolve it to geo-coordinates using the [HERE Geocoder API](https://developer.here.com/documentation/geocoder/dev_guide/topics/resource-geocode.html)
* attaches the address back to the parsed entry and
* outputs the augmented kml file

# Cool, how can I run it?

## Get a HERE key

* Get a [HERE Developer Account](https://developer.here.com/pricing), e.g. by picking a free plan.
* Provide this app with authentication to the Geocoder API. **You have two options:**

Either get an [API Key](https://developer.here.com/documentation/authentication/dev_guide/topics/api-key-credentials.html), then
add the following entry to [.env](.env) ([what is this?](https://medium.com/@thejasonfile/using-dotenv-package-to-create-environment-variables-33da4ac4ea8f)):
```
API_KEY={here-goes-your-key}
```

Alternatively, get [App ID and App Code for Here Maps](https://developer.here.com/documentation/geocoder/dev_guide/topics/resource-geocode.html)).
Add them to the `.env` file like so:
```
APP_ID={your-app-id}
APP_CODE={your-app-code
```

## Install it
* Install [node](https://nodejs.org/en/)
* clone this repo, install dependencies using [npm](https://www.npmjs.com)
* Get a kml file that needs a coordinates lookup. Currently not more than 1 input file is supported
* Put it under `/data/input/`

## Run it
* run `npm start` in the project root folder
* check the logs for errors and success messages. You can get more detailed logs by setting `DEBUG=true` in [config.js](config.js)

# Context 

Developed during a data integration task while working for [FixMyCity](https://fixmyberlin.de/). 

# Open Tasks

Not sure if I find the time, but if this is useful to some one and if this gets picked up
* support more than one file
* provide example data

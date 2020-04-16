## To Run Locally

`git clone git@github.com:stazrad/ol-kit-map.git`

cd into dir `cd ol-kit-map`

run `npm i`

start app `npm start`

### to run with local version of @bayer/ol-kit

(all steps above^)

step up a level `cd ../`

`git clone git@github.com:MonsantoCo/ol-kit.git`

cd into dir `cd ol-kit`

run `npm link` on local version of `ol-kit`

run `npm run dev` to keep the changes live

cd into app `ol-kit-map` dir `cd ../ol-kit-map`

run `npm link @bayer/ol-kit` in `ol-kit-map` dir

run `npm start` & you should see your changes

#!/bin/bash

echo "#####################"
echo "# RESET APPLICATION #"
echo "#####################"

APPLICATION_NAME=bucharest-venues

cd ~/meteor
# delete directory if it already exists
rm -rf $APPLICATION_NAME-meteor

# create meteor app
meteor create $APPLICATION_NAME-meteor
cd $APPLICATION_NAME-meteor

# remove auto-generated files
rm *.css *.js *.html

ln -s ~/Dropbox/meteor/$APPLICATION_NAME-src/client client
ln -s ~/Dropbox/meteor/$APPLICATION_NAME-src/lib lib
ln -s ~/Dropbox/meteor/$APPLICATION_NAME-src/private private
ln -s ~/Dropbox/meteor/$APPLICATION_NAME-src/public public
ln -s ~/Dropbox/meteor/$APPLICATION_NAME-src/server server

# remove base packages
meteor remove insecure
meteor remove autopublish

# add app specific packages
# STANDARD
meteor add service-configuration
meteor add accounts-google
meteor add http
# ATMOSPHERE
meteor add flemay:less-autoprefixer
meteor add iron:router
meteor add semantic:ui
# CUSTOM
meteor add csv
meteor add google-maps-view
meteor add moment-with-locales

# test launching using meteor
cd ~/meteor/$APPLICATION_NAME-meteor
meteor --settings private/settings.json

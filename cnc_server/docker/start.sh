#!/bin/sh


yarn run start > output.log &
yarn run schedule > schedule.log &
java -Djava.security.egd=file:/dev/./urandom -jar /node-sidecar.jar

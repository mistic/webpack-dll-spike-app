# webpack-dll-spike-app
A simple spike using webpack and dll plugin to power a core app 
and a plugin architecture based on static bundles (DLLs).

## App

Just a simple web app to demonstrates the concept and also loads some 
heavy dependencies like `react` and `highcharts`.

## Bundler

This is the key software part of the main concept. The component is 
still **under development**. Check the [Todo Roadmap](TODO.md) to know what will 
be done here.

### Run 

The bundler can be run with `node ./bundler`. There are some `run options`
you can pass to it:

##### **--type=**

###### **compiler**
Run the bundler compiler component.

###### **loader**
Run the bundler loader component.


##### **--mode=**

###### **production**
Run the chosen `type` with the production configurations.

###### **development**
Run the chosen `type` with the development configurations.


##### **--export-config**
If set returns the default configuration for a chosen `mode` and `type` in order
to be able to run the bundler configurations for example 
directly with `webpack-dev-server`.

##### **Defaults: type=production, mode=loader, export-config=false**

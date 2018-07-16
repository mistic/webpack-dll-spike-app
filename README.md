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


##### **--target=**

###### **internal**
Use `type` and `mode` with the default bundler runtime.

###### **external**
Use `type` and `mode` and export the config in order to be 
used somewhere else.

###### **webpack-dev-server**
When the target is `webpack-dev-server`, the options `type` and `mode`
are always `type=loader` and `mode=development` and they run 
on `webpack-dev-server`.

##### **Defaults: type=production, mode=loader, target=internal**

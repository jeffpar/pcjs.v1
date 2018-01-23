---
layout: page
title: PCjs Project Modules
permalink: /modules/
---

PCjs Project Modules
--------------------

This folder contains all the JavaScript modules for the [PCjs Project](https://github.com/jeffpar/pcjs).
It is our *private* counterpart to the **node_modules** folder, where all *public* Node modules are typically installed.

The project currently includes these emulation modules:

* [C1Pjs](c1pjs/): 6502 emulation module for the [Challenger 1P](/devices/c1p/)
* [PCx86](pcx86/): x86 emulation module for [IBM PC machines](/devices/pcx86/)
* [PC8080](pc8080/): 8080 emulation module for [8080-based machines](/devices/pc8080/) 
* [PDPjs](/docs/pdpjs/): emulation modules for [PDP-10](pdp10/) and [PDP-11](pdp11/) machines 

along with variety of Node support modules, such as:

* [DiskDump](diskdump/)
* [FileDump](filedump/)
* [HTMLOut](htmlout/)
* [MarkOut](markout/)

Also, new for 2017, we have set of stand-alone ES6 Device classes that were used to create the [TI-57](/devices/ti57/)
emulator:

* [PCjs Device Classes](/modules/devices/)

Only private Node modules are checked into the project.  If any of these modules are later published on
[npmjs.org](http://npmjs.org), then they will be moved to **node_modules** and removed from this folder.

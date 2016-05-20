---
layout: page
title: PCjs Project Modules
permalink: /modules/
---

PCjs Project Modules
===

This folder contains all the JavaScript modules for the [PCjs Project](https://github.com/jeffpar/pcjs).
It is our *private* counterpart to the **node_modules** folder, where all *public* Node modules are typically installed.

The project currently includes these emulation modules:

* [PCx86](pcx86/), the emulation module for [x86-based machines](/devices/pcx86/)
* [PC8080](pc8080/), the emulation module for [8080-based machines](/devices/pc8080/) 
* [C1Pjs](c1pjs/), the 6502-based emulation module for the [Challenger 1P](/devices/c1p/)

along with variety of Node support modules, such as:

* [DiskDump](diskdump/)
* [FileDump](filedump/)
* [HTMLOut](htmlout/)
* [MarkOut](markout/)

Only private Node modules are checked into the project.  If any of these modules are later published on
[npmjs.org](http://npmjs.org), then they will be moved to **node_modules** and removed from this folder.

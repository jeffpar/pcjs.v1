---
layout: page
title: PCjs Project Modules
permalink: /modules/
---

Project Modules
===

The **modules** folder contains all the JavaScript source code for the PCjs Project, organized into Node modules.
It is our *private* counterpart to the **node_modules** folder, where all *public* Node modules are installed.

The project includes these emulation modules:

* [PCjs](pcjs/), the x86-based PC Emulation Module
* [PC8080](pc8080/), the 8080-based Machine Emulation Module
* [C1Pjs](c1pjs/), the 6502-based Challenger 1P Emulation Module

along with variety of Node support modules, such as:

* [DiskDump](diskdump/)
* [FileDump](filedump/)
* [HTMLOut](htmlout/)
* [MarkOut](markout/)

Only private Node modules are checked into this project.  If any of these modules are later published on
[npmjs.org](http://npmjs.org), then they will be moved to **node_modules** and removed from this folder.

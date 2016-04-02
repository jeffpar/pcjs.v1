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

* C1Pjs, the 6502-based C1P Emulation Module
* [PCjs](pcjs/), the x86-based IBM PC Emulation Module

along with variety of support modules, such as:

* [DiskDump](diskdump/)
* [FileDump](filedump/)
* [HTMLOut](htmlout/)
* [MarkOut](markout/)

Only private Node modules are checked into this project.  If any of these modules are later published on
[npmjs.org](http://npmjs.org), then they will be moved to **node_modules** and removed from this folder.

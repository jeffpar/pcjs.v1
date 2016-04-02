---
layout: page
title: PCjs Project Modules
permalink: /modules/
---

Project Modules
===

This folder contains all the JavaScript source code for the PCjs Project, organized into Node modules.
It is the counterpart to **node_modules**, where all the *public* Node modules are installed.

The project includes these Emulation Modules:

* C1Pjs, the 6502-based C1P Emulation Module
* [PCjs](pcjs/), the x86-based IBM PC Emulation Module

along with variety of support modules, such as:

* [DiskDump](diskdump/)
* [FileDump](filedump/)
* [HTMLOut](htmlout/)
* [MarkOut](markout/)

Only private Node modules are checked into this project.  If any of these modules are later published on
[npmjs.org](http://npmjs.org), then they will be moved to **node_modules** and removed from this folder.

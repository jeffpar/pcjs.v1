---
layout: page
title: About PCjs
menu_title: About
menu_order: 9
permalink: /docs/about/
---

## About PCjs

The [PCjs Project](https://github.com/jeffpar/pcjs) is a collection of computer simulations written in
[JavaScript](/modules/).  The project is maintained on GitHub and is hosted here at 
[{{ site.pcjs.domain }}]({{ site.url }}/) (formerly [jsmachines.net](http://jsmachines.net/)). 

The goals of the project are to create fast, full-featured simulations of classic computer
hardware, help people understand how these early machines worked, make it easy to experiment with different machine
configurations, and provide a platform for running and analyzing old computer software.

The simulations are written entirely in JavaScript and run well in a variety of web browsers, on both
desktop and mobile devices.  Machines are created with simple XML files that define a set of machine components,
along with the features that each component should enable.  More details about machine definitions and component
capabilities can be found in the [Documentation](/docs/).

### Emulating the Challenger 1P

The first PCjs emulator was [C1Pjs](/docs/c1pjs/), a simulation of the
Challenger 1P, which was a 6502-based microcomputer introduced by Ohio Scientific in 1978.

C1Pjs v1.0 was released in July 2012.  More information about the first release of C1Pjs was
[posted](http://osiweb.org/osiforum/viewtopic.php?f=3&t=103) on the
[OSI Discussion Forum](http://osiweb.org/osiforum/index.php) at [osiweb.org](http://osiweb.org/).

### Emulating the IBM PC

The next PCjs emulator was [PCx86](/docs/about/pcx86/), which simulates the original IBM PC, IBM PC XT,
and IBM PC AT.  PCx86 v1.0 was released in late 2012.  Browse the source code [here](/modules/pcx86/) or on
[GitHub](https://github.com/jeffpar/pcjs).

[PCx86](/docs/about/pcx86/) emulates the Intel 8088, 80186, 80286 and 80386 CPUs, as well as IBM Monochrome Display
Adapter (MDA), Color Graphics Adapter (CGA), Enhanced Graphics Adapter (EGA), and Video Graphics Array (VGA) video
cards, along with assorted motherboard and expansion bus components.  It also includes an optional
[Debugger](/docs/pcx86/debugger/) and a user-configurable [Control Panel](/docs/pcx86/panel/).

Read [About PCx86](/docs/about/pcx86/) to learn more about its history, features, and upcoming improvements.

### Migrating to Node

The PCjs web server was originally written in PHP and hosted at [jsmachines.net](http://jsmachines.net/), but in 2014,
it was migrated to a [Node.js](http://nodejs.org) web server and hosted at [pcjs.org](http://www.pcjs.org/).

The goals included:

- Using JavaScript exclusively, for both client and server development
- Leveraging the Node.js web server to provide more sophisticated I/O capabilities
- Improving overall website design, including structure, appearance and responsiveness

The PCjs Node web server includes a number of custom Node modules that provide many of the same server-side features
found on [jsmachines.net](http://jsmachines.net/), including new ROM and disk image conversion APIs, and a
Markdown module that supports a subset of the [Markdown syntax](http://daringfireball.net/projects/markdown/syntax),
including extensions to the link syntax that make it easy to embed C1Pjs and PCx86 machine files in Markdown documents.

### Migrating to GitHub Pages

To simplify hosting requirements, the PCjs Project was migrated to GitHub Pages in late 2015.  The project still
includes the original Node-based web server, which is useful for development and debugging, but for production sites
(including [pcjs.org](http://www.pcjs.org/), using Jekyll to generate a static copy of the project for the web is the
preferred solution.

---

License
---
The [PCjs Project](https://github.com/jeffpar/pcjs) is now an open-source project on [GitHub](http://github.com/).
All published portions are free for redistribution and/or modification under the terms of the
[GNU General Public License](/LICENSE) as published by the Free Software Foundation, either version 3 of the License,
or (at your option) any later version.

You are required to include the following copyright notice, with a link to [{{ site.pcjs.domain }}]({{ site.url }}/):

> [PCjs]({{ site.url }}/) © 2012-2016 by [Jeff Parsons](mailto:Jeff@pcjs.org) ([@jeffpar](http://twitter.com/jeffpar))

in every source code file of every copy or modified version of this work, and to display that notice on every web page
or computer that runs any version of this software.

See [LICENSE](/LICENSE) for details.

More Information
---
If you have questions or run into any problems, feel free to [tweet](http://twitter.com/jeffpar) or
[email](mailto:Jeff@pcjs.org).

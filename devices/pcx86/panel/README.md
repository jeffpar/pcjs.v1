---
layout: page
title: IBM PC Control Panels
permalink: /devices/pcx86/panel/
redirect_from:
  - /devices/pc/panel/
---

IBM PC Control Panels
---

A *[Control Panel](/docs/pcx86/panel/)* is a collection of machine controls (e.g., buttons, register values, etc)
bound to the *[CPU](/docs/pcx86/cpu/)* and *[Debugger](/docs/pcx86/debugger/)* components and usually defined in a
separate XML file.

The following predefined IBM PC *[Control Panel](/docs/pcx86/panel/)* XML configuration are currently available:

 - [default.xml](default.xml) (a simple layout for 8086/8088-based machines)
 - [wide.xml](wide.xml) (a wide version of default.xml)
 - [wide386.xml](wide386.xml) (a wide version of default.xml for 80386-based machines)

The visual controls described by these layouts are provided by the *[Computer](/docs/pcx86/computer/)*,
*[CPU](/docs/pcx86/cpu/)*, *[Keyboard](/docs/pcx86/keyboard/)*, and *[Debugger](/docs/pcx86/debugger/)* components.

---
layout: page
title: 8080-Based Device Configurations
permalink: /devices/pc8080/
---

8080-Based Device Configurations
---

[8080-Based Machines](machine/) are built from a collection of devices, including:

* CPU (8080)
* RAM
* [ROMs](rom/)
* ChipSets
* Video Adapters
* [Control Panels](panel/)

Complete machine configurations are constructed from those devices.  A machine configuration is a single XML file
that lists all the device components to be used.  A machine XML file can choose to configure every device itself,
or it can include pre-configured device XML files, such as those provided above or elsewhere.

For example, here's what the [Space Invaders (1978)](/devices/pc8080/machine/invaders/)
[XML](/devices/pc8080/machine/invaders/machine.xml) looks like:

```xml
<machine id="invaders" class="pc8080" border="1" pos="center" background="#FAEBD7">
    <name pos="center">Space Invaders</name>
    <computer id="computer" busWidth="16"/>
    <cpu id="cpu8080" model="8080" cycles="2000000"/>
    <rom id="romH" addr="0x0000" size="0x0800" file="/devices/pc8080/rom/invaders/INVADERS-H.json"/>
    <rom id="romG" addr="0x0800" size="0x0800" file="/devices/pc8080/rom/invaders/INVADERS-G.json"/>
    <rom id="romF" addr="0x1000" size="0x0800" file="/devices/pc8080/rom/invaders/INVADERS-F.json"/>
    <rom id="romE" addr="0x1800" size="0x0800" file="/devices/pc8080/rom/invaders/INVADERS-E.json"/>
    <ram id="ram"  addr="0x2000" size="0x2000"/>
    <video id="video" screenWidth="224" screenHeight="256" bufferAddr="0x2400" bufferCols="256" bufferRows="224" bufferBits="1" interruptRate="120" rotation="90" width="40%" pos="left" padding="8px">
        <menu>
            <title>224x256 Screen (Rotated)</title>
        </menu>
    </video>
    <chipset id="chipset" model="SI1978"/>
    <panel ref="/devices/pc8080/panel/left.xml"/>
    <debugger id="debugger" commands="s 8086"/>
</machine>
```

In this example, all the devices are fully configured within the machine XML file, except for the
[Control Panel](panel/) [XML](panel/left.xml).

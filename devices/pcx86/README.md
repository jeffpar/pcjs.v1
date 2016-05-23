---
layout: page
title: IBM PC Device Configurations
permalink: /devices/pcx86/
redirect_from:
  - /devices/pc/
  - /configs/pc/
---

IBM PC Device Configurations
---

All our [IBM PC Machines](machine/) are built from a collection of devices, including:

* [ChipSet](chipset/)
* [Control Panel](panel/)
* [CPU](/docs/pcx86/cpu/)
* [Debugger](/docs/pcx86/debugger/)
* [Floppy Drive Controller](/docs/pcx86/fdc/)
* [Hard Drive Controller](/docs/pcx86/hdc/)
* [Keyboard](keyboard/)
* [Mouse](/docs/pcx86/mouse/)
* [RAM](/docs/pcx86/ram/)
* [ROM](rom/)
* [Parallel Port](/docs/pcx86/parallel/)
* [Serial Port](/docs/pcx86/serial/)
* [Video](video/)

Each of those devices can be configured in multiple ways, and some support external UI controls.

For example, the IBM PC *[Keyboard](/docs/pcx86/keyboard/)* component supports different keyboard models
(eg, 83-key, 84-key, 101-key), and each of those models can also be configured to have dedicated buttons for
selected key combinations, or even entire keyboard layouts.

Complete machine configurations are constructed from those devices.  A Machine Configuration is a single XML file
that lists all the device components to be used.  A Machine XML file can choose to configure every device itself,
or it can include pre-configured device XML files, such as those provided above or elsewhere.

Here's an [IBM 5150](/devices/pcx86/machine/5150/mda/64kb/) [XML](/devices/pcx86/machine/5150/mda/64kb/machine.xml)
example:

```xml
<machine id="ibm5150" class="pcx86" border="1" pos="center" background="#FAEBD7">
    <name pos="center">IBM PC (Model 5150) with Monochrome Display</name>
    <computer id="pc-mda-64k" name="IBM PC" resume="1"/>
    <ram id="ramLow" addr="0x00000"/>
    <rom id="romBASIC" addr="0xf6000" size="0x8000" file="/devices/pcx86/rom/5150/basic/BASIC100.json"/>
    <rom id="romBIOS" addr="0xfe000" size="0x2000" file="/devices/pcx86/rom/5150/1981-04-24/PCBIOS-REV1.json"/>
    <video ref="/devices/pcx86/video/ibm/mda/ibm-mda.xml"/>
    <fdc ref="/disks/pcx86/compiled/samples.xml"/>
    <cpu id="cpu8088" model="8088" autostart="true" pos="left" padleft="8px" padbottom="8px">
        <control type="button" binding="run">Run</control>
        <control type="button" binding="reset">Reset</control>
    </cpu>
    <keyboard ref="/devices/pcx86/keyboard/us83-buttons-arrows.xml"/>
    <chipset id="chipset" model="5150" sw1="01000001" sw2="11111000"/>
</machine>
```

In this example, all the devices are fully configured within the machine XML file, except for the
*[Video](/docs/pcx86/video/)* ([XML](/devices/pcx86/video/ibm/mda/ibm-mda.xml)),
*[Floppy Drive Controller](/docs/pcx86/fdc/)* ([XML](/disks/pcx86/compiled/samples.xml)), and
*[Keyboard](/docs/pcx86/keyboard/)* ([XML](/devices/pcx86/keyboard/us83-buttons-arrows.xml)) components,
which refer to separate XML configuration files.

---
layout: page
title: IBM PC Device Configurations
permalink: /devices/pc/
redirect_from:
  - /configs/pc/
---

IBM PC Device Configurations
---

[PC Machines](machine/) are built from a collection of devices, including:

* CPU
* RAM
* [ROMs](rom/)
* [Keyboards](keyboard/)
* [Video Adapters](video/)
* Floppy Disk Controllers
* Hard Disk (Fixed Disk) Controllers
* [Control Panels](panel/)

Each of those devices can be configured in multiple ways, and some support external UI controls.

For example, the IBM PC Keyboard component supports different keyboard models (eg, 83-key, 84-key, 101-key),
and each of those models can also be configured to have dedicated buttons for selected key combinations,
or even entire keyboard layouts.

Complete machine configurations are constructed from those devices.  A machine configuration is a single XML file
that lists all the device components to be used.  A machine XML file can choose to configure every device itself,
or it can include pre-configured device XML files, such as those provided above or elsewhere.

For example, here's what the machine located at
[/devices/pc/machine/5150/mda/64kb/machine.xml](/devices/pc/machine/5150/mda/64kb/machine.xml) looks like:

	<machine id="ibm5150" class="pc" border="1" pos="center" background="#FAEBD7">
		<name pos="center">IBM PC (Model 5150) with Monochrome Display</name>
		<computer id="pc-mda-64k" name="IBM PC" resume="1"/>
		<ram id="ramLow" addr="0x00000"/>
		<rom id="romBASIC" addr="0xf6000" size="0x8000" file="/devices/pc/rom/5150/basic/BASIC100.json"/>
		<rom id="romBIOS" addr="0xfe000" size="0x2000" file="/devices/pc/rom/5150/1981-04-24/PCBIOS-REV1.json"/>
		<video ref="/devices/pc/video/ibm/mda/ibm-mda.xml"/>
		<cpu id="cpu8088" model="8088" autostart="true" padleft="8px">
			<control type="button" binding="run">Run</control>
			<control type="button" binding="reset">Reset</control>
		</cpu>
		<keyboard ref="/devices/pc/keyboard/keyboard-minimal.xml"/>
		<fdc ref="/disks/pc/samples.xml" pos="right"/>
		<chipset id="chipset" model="5150" sw1="01000001" sw2="11110000"/>
	</machine>

All the devices are fully configured within the XML file, except for the [Video](/docs/pcjs/video/),
[Keyboard](/docs/pcjs/keyboard/), and [Floppy Disk Controller (FDC)](/docs/pcjs/fdc/) components, which are defined
in separate XML files.

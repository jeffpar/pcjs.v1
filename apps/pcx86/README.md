---
layout: page
title: IBM PC Application Demos
permalink: /apps/pcx86/
---

IBM PC Application Demos
------------------------

Below are selected [PCx86](/docs/about/pcx86/) demos of classic IBM PC applications.  In many cases,
we've had to create our own "Demo Disks", because copies of the original distribution disks are difficult
to find, and in some cases (e.g., [Executive Suite](1982/esuite/)), the original disks were copy-protected,
so we've been forced to use a "cracked" copy of the software instead.

A list of all the software available to PCx86 machines can be found in the [IBM PC Disk Library](/disks/pcx86/).

### 1981

* [DONKEY.BAS](1981/donkey/)
* [Microsoft Adventure](/disks/pcx86/games/microsoft/adventure/)
* [VisiCalc](1981/visicalc/)

### 1982

* [Executive Suite](1982/esuite/)
* [RatBas v2.13](1982/ratbas/)
* [Zork I](/disks/pcx86/games/infocom/zork1/)

### 1983

* [Adventures in Math v1.00](1983/adventmath/)
* [SuperCalc2 v1.00](/disks/pcx86/apps/other/sc2/1.00/)
* [SuperCalc3 v1.00](/disks/pcx86/apps/other/sc3/1.00/)

### 1985

* [Rogue](1985/rogue/)

### 1987

* [ThinkTank v2.14](1987/thinktank/)

### 1992

* [The Dungeons of Moria v5.5](1992/moria/)

---

### Creating IBM PC Application Demos

Demos in our [Application Archives](/apps/) combine
[Software Application Manifests](/apps/#software-application-manifests) with
[Machine Configurations](/devices/pcx86/machine/).

We'll use the [VisiCalc Demo](1981/visicalc/) as an example.  First, we choose a machine configuration.
For VisiCalc, we chose a Model 5150 machine with a Monochrome Display, and then inserted a link to that machine
in the demo's [manifest](1981/visicalc/manifest.xml):

```xml
<machine href="/devices/pcx86/machine/5150/mda/64kb/machine.xml"/>
```

Next, the [manifest](1981/visicalc/manifest.xml) requires a disk image containing the VisiCalc program
(VC.COM).  We used the [DiskDump](/modules/diskdump/) module to create that disk image:

	cd apps/pcx86/1981/visicalc
	node ../../../../modules/diskdump/bin/diskdump --path="archive/VC.COM;../README.md" --format=json --output=disk.json --manifest
	
The DiskDump command created a disk image named "disk.json" containing two files ("VC.COM" from the "archive"
subdirectory, and "README.md" from the "archive" parent directory) and automatically added that disk image to the demo's
[manifest](1981/visicalc/manifest.xml):

```xml
<disk id="disk01" size="163840" chs="40:1:8" dir="archive/" href="/apps/pcx86/1981/visicalc/disk.json" md5="61494f998d5fb0e31e7b8bd99f1cc588" md5json="3ad82ed815725e6bd786f92a4714e84f">
    <file size="27520" time="1981-12-16 23:00:00" attr="0x20" md5="28997dfedb2440c6054d8be835be8634">VC.COM</file>
    <file dir="../">README.md</file>
</disk>
```

Now that the manifest contains a disk image, we were able to add the manifest to our set of
[Sample Disks](/disks/pcx86/samples.xml):

```xml
<manifest ref="/apps/pcx86/1981/visicalc/manifest.xml" disk="*"/>
```

Next, we started a version of our chosen machine that's also configured to use the Debugger, by loading
the following **machine.xml** into a web browser (it's assumed the Node web server is already running on port 8088):

	http://localhost:8088/devices/pcx86/machine/5150/mda/64kb/debugger/machine.xml

Then we booted DOS, loaded the VisiCalc disk, ran VisiCalc, pressed the Debugger's "Halt" button, pressed "Clear" to
clear the Debugger's output window, and typed the following Debugger command:
 
	d state

We copied-and-pasted the entire contents of the Debugger's output window into a file named "state.json", and then
updated the &lt;machine&gt; entry in the [manifest](1981/visicalc/manifest.xml):

```xml
<machine href="/devices/pcx86/machine/5150/mda/64kb/machine.xml" state="/apps/pcx86/1981/visicalc/state.json"/>
```

It's important to use a state file *only* with the machine configuration it was created with; in this case, we're OK,
because the only difference between the two chosen Model 5150 machines is the addition of the Debugger.

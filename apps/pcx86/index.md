---
layout: page
title: IBM PC Application Demos
permalink: /apps/pcx86/
---

{% include_relative README.md %}

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
	node ../../../../modules/diskdump/bin/diskdump --dir=archive/visicalc.81 --format=json --output=VISICALC1981.json --manifest
	
The DiskDump command creates a disk image named **VISICALC1981.json** containing the files the archive/visicalc.81
subdirectory (ie, **VC.COM**) and automatically added that disk image to the demo's [manifest](1981/visicalc/manifest.xml):

```xml
<disk id="disk01" chs="40:1:8" dir="archive/visicalc.81" href="/apps/pcx86/1981/visicalc/VISICALC1981.json" md5="5b77efdfb86aa747edb49811db75021d" md5json="b1a45cb769cf04daa259263a92bacf16">
	<name>VisiCalc (1981)</name>
	<file size="27520" time="1981-12-16 23:00:00" attr="0x20" md5="28997dfedb2440c6054d8be835be8634">VC.COM</file>
	<link href="http://www.bricklin.com/history/vclicense.htm">VisiCalc License</link>
</disk>
```

Now that the manifest contains a disk image, we were able to add the manifest to our set of
[Sample Disks](/disks/pcx86/samples.xml):

```xml
<manifest ref="/apps/pcx86/1981/visicalc/manifest.xml"/>
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

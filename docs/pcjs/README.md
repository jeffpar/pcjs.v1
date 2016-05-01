---
layout: page
title: PCjs Documentation
permalink: /docs/pcjs/
machines:
  - type: pc
    id: ibm5150
    config: /devices/pc/machine/5150/mda/64kb/machine.xml
---

PCjs Documentation
---

[PCjs](/docs/about/pcjs/) is a full-featured IBM PC, PC XT and PC AT emulator written entirely in JavaScript.

After you've read the Documentation, check out with the [Examples](examples/), read the [Source Code](/modules/pcjs/),
and experiment!

{% include machine.html id="ibm5150" %}

The [simulation](/devices/pc/machine/5150/mda/64kb/) above features an Intel 8088
running at 4.77Mhz, with 64Kb of RAM and an IBM Monochrome Display Adapter.  To create your
own simulation, all you need is the PCjs script and a machine XML file, along with a couple
of XSL and CSS support files (included in the ZIP file below).

### Creating Machine XML Files

A PCjs machine XML file defines all a machine's components, including:

* [Chipset](chipset/)
* [Computer](computer/)
* [Control Panel](panel/)
* [CPU](cpu/)
* [Debugger](debugger/)
* [Floppy Drive Controller](fdc/)
* [Hard Drive Controller](hdc/)
* [Keyboard](keyboard/)
* [Mouse](mouse/)
* [RAM](ram/)
* [ROM](rom/)
* [Parallel Port](parallel/)
* [Serial Port](serial/)
* [Video Adapter](video/)

Here's a simple machine XML file that includes an 8088 CPU and 16Kb of RAM:

	<machine id="ibm">
	    <computer id="pc" name="IBM PC"/>
	    <cpu id="cpu8088" model="8088"/>
	    <ram id="ramLow" addr="0x00000" size="0x04000"/>
	</machine>

However, that machine isn't usable, since it lacks a keyboard, screen, or any code (ROMs) to execute.

A simple machine definition that actually works might look like:

	<machine id="ibm" class="pc" width="720px">
	    <computer id="pc" name="IBM PC"/>
	    <cpu id="cpu8088" model="8088"/>
	    <ram id="ramLow" addr="0x00000" size="0x04000"/>
	    <rom id="romBASIC" addr="0xf6000" size="0x8000" file="ibm-basic-1.00.json"/>
	    <rom id="romBIOS" addr="0xfe000" size="0x2000" file="1981-04-24.json"/>
	    <keyboard id="keyboard"/>
	    <video id="videoMDA" model="mda" screenwidth="720" screenheight="350" charset="ibm-mda-cga.json">
	        <name>Monochrome Display</name>
	    </video>
	    <chipset id="chipset" model="5150" sw1="01000001" sw2="11110000"/>
	</machine>

Here is an [example](examples/example1.html) of this machine's [XML](examples/example1.xml) file.

Machine definitions can also include visual elements.  For example, we can include a "Run" button with the CPU component.
Note that as soon as the machine is ready and the CPU starts running, the "Run" button will change to "Halt".

	<machine id="ibm" class="pc" width="720px">
	    <computer id="pc" name="IBM PC"/>
	    <cpu id="cpu8088" model="8088">
	        <control type="button" class="input" binding="run">Run</control>
	    </cpu>
	    ...
	</machine>

Next, we can add a Floppy Disk Controller (FDC) component.  And since we want to be able to "load" and "unload" floppy
disks at will, we'll include some UI controls.

	<machine id="ibm" class="pc" width="720px">
	    <fdc id="fdcNEC" autoMount="{A: {name: 'PC-DOS 1.0', path: 'pcdos-1.00.json'}}">
	        <control type="container">
	            <control type="list" class="input" binding="listDrives"/>
	            <control type="list" class="input" binding="listDisks">
	                <disk path="">None</disk>
	                <disk path="pcdos-1.00.json">PC-DOS 1.0</disk>
	            </control>
	            <control type="button" class="input" binding="loadDrive">Load</control>
	        </control>
	    </fdc>
	    ...
	</machine>

Here is an [example](examples/example2.html) of the updated machine's [XML](examples/example2.xml)
file.

### Loading Machine XML Files

Inside a web page, add a &lt;div&gt; to contain the machine, load the *pc.js* script
(*pc-dbg.js* if you need the PCjs [Debugger](debugger/)), and then call *embedPC()*:

	<div id="example2"/>
	<script type="text/javascript" src="pc.js"/>
	<script type="text/javascript">
	    embedPC("example2", "example2.xml", "components.xsl");
	</script>

In fact, this is exactly what we did in the previous [example](examples/example2.html).

*embedPC()* accepts 4 parameters:

- The *id* of the machine &lt;div&gt; (e.g., "example2");
- The *url* of the machine XML file (e.g., "example2.xml");
- The *url* of the components XSL file (e.g., "components.xsl")
- Any *parms* that should be passed to the machine components during initialization

The first 3 parameters are required; the *parms* parameter is optional.  If *parms* is specified, it should
contain a single-quoted JSON object definition, with properties intended to override those specified in the
machine XML file; eg:

	'{messages:"warn",autoMount:{"A":{"path":"/disks/pc/dos/ibm/1.00/PCDOS100.json"}}}'

*components.xsl* (and the corresponding *components.css*) are included with the PCjs scripts in the
[Examples](#running-pcjs-on-your-own-server) download.  Every version of *components.xsl* has a corresponding
*components.css*, which your web page should also load, usually with a &lt;link&gt; tag inside the &lt;head&gt;
element; eg:

	<link rel="stylesheet" type="text/css" href="components.css">

### Using the PCjs Debugger

To create a configuration that includes the PCjs Debugger, you need to:

- Add [Debugger](debugger/) and [Control Panel](panel/) components to the machine XML file;
- Add debugger controls to the Control Panel, such as Run, Step, Reset, etc;
- Change your web page to load *pc-dbg.js* instead of *pc.js*.

Take a look at the [example3a](examples/example3a.html) example
(with [XML file](examples/example3a.xml)).

The debugger gives you access to more capabilities than mere debugging. For example, you can use the **load**
command to load diskette sectors into memory ("l [addr] [drive #] ...") or the **dump** command to dump an entire
diskette as JSON ("d disk [drive #]").  You can also **halt** a machine ("h") and **dump** its entire state as JSON
("d state"). You can save that state in a .json file, and then use that state to initialize a new machine (as long as
it uses the same machine *id*).

In fact, the [example3b](examples/example3b.html) example (with [XML file](examples/example3b.xml))
does just that, using JSON dumps created from [example3a](examples/example3a.html) after starting VisiCalc.
See the *state* property on the [Computer](computer/) component for more information on state files.

### Running PCjs On Your Own Server
			
All of the examples described above are available for [download](examples/).

### Creating PCjs-Compatible Disk Images

If you have (or find) an IMG disk image file on a server, the PCjs web server provides a
[DiskDump API](/api/v1/dump) via endpoint "/api/v1/dump" that creates PCjs-compatible disks in JSON:

	{{ site.url }}/api/v1/dump?disk=(file|url)&format=json

For example, let's say you found a disk image online, such as:

	http://archive.pcjs.org/disks/pc/dos/ibm/1.00/PCDOS100.img

To convert it to a PCjs-compatible JSON format, issue the following
[request](/api/v1/dump?disk=http://archive.pcjs.org/disks/pc/dos/ibm/1.00/PCDOS100.img&format=json),
save the resulting JSON file to a folder on your server, and then update your machine XML file(s) to use that file.

	{{ site.url }}/api/v1/dump?disk=http://archive.pcjs.org/disks/pc/dos/ibm/1.00/PCDOS100.img&format=json

If necessary, you can also reverse the process and convert a JSON disk image back into an IMG file, with the
this [request](/api/v1/dump?disk=http://www.pcjs.org/disks/pc/dos/ibm/1.00/PCDOS100.json&format=img):

	{{ site.url }}/api/v1/dump?disk={{ site.url }}/disks/pc/dos/ibm/1.00/PCDOS100.json&format=img

Although PCjs will accept IMG disk image files, it must call the [DiskDump API](/api/v1/dump) to convert the image
every time it's loaded, so it's *much* faster and more efficient to use pre-converted JSON-encoded disk images.

Remember that PC and PC XT machines supported only 160Kb diskettes (on any version of PC-DOS),
320Kb diskettes (on PC-DOS 1.1 and higher), and 180Kb and 360Kb diskettes (on PC-DOS 2.0 and higher).

The 1.2Mb diskette format was introduced with the PC AT, and 720Kb and 1.44Mb diskette formats were
supported later on 8Mhz PC AT and PS/2 models.  So, when using any of these larger formats, be sure you're
also using a compatible machine configuration.

Learn more about PCjs disk images [here](/disks/).

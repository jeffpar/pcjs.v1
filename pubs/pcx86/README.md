---
layout: page
title: PCx86 Documentation
permalink: /pubs/pcx86/
redirect_from:
  - /docs/pcjs/
  - /docs/pcx86/
machines:
  - id: ibm5150
    type: pcx86
    resume: 1
    config: /devices/pcx86/machine/5150/mda/64kb/machine.xml
---

PCx86 Documentation
-------------------

[PCx86](/pubs/about/pcx86/) is a full-featured [IBM PC and PC-compatible](/devices/pcx86/machine/) emulator written
entirely in JavaScript.  It supports a variety of XT and AT class machines, with processors ranging from the 8088
through the 80386.  The PCjs website provides a variety of "stock" configurations, featuring classic machines running
at their original clock speed, or you can create your own, by mixing, matching, and reconfiguring any of the PCx86
components listed below.

After you've read the Documentation, check out the [Examples](examples/), browse the [Source Code](/modules/pcx86/),
and experiment!

{% include machine.html id="ibm5150" %}

The [simulation](/devices/pcx86/machine/5150/mda/64kb/) above features an Intel 8088 running at 4.77Mhz,
with 64Kb of RAM and an IBM Monochrome Display Adapter.  To create your own simulation, all you need is the PCx86
script and a machine XML file, along with a couple of XSL and CSS support files (included in the ZIP file below).

### Creating Machine XML Files

A PCx86 machine XML file defines all a machine's components, including:

* [ChipSet](chipset/)
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
* [Video](video/)

Here's a simple machine XML file that includes an 8088 CPU and 16Kb of RAM:

```xml
<machine id="ibm">
    <computer id="pc" name="IBM PC"/>
    <cpu id="cpu8088" model="8088"/>
    <ram id="ramLow" addr="0x00000" size="0x04000"/>
</machine>
```

However, that machine isn't really usable, since it lacks a keyboard, screen, or any code (ROMs) to execute.

Here's a simple machine XML definition that's more useful:

```xml
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
```

[Example 1](examples/example1.html) shows the [XML](examples/example1.xml) in action.

Machine definitions can also include visual elements.  For example, we can include a **Run** button with the CPU component.
Note that as soon as the machine is ready and the CPU starts running, the **Run** button will change to **Halt**.

```xml
<machine id="ibm" class="pc" width="720px">
    <computer id="pc" name="IBM PC"/>
    <cpu id="cpu8088" model="8088">
        <control type="button" class="input" binding="run">Run</control>
    </cpu>
    ...
</machine>
```

Next, we can add a Floppy Drive Controller (FDC) component.  And since we want to be able to "load" and "unload" floppy
disks at will, we'll include some UI controls.

```xml
<machine id="ibm" class="pc" width="720px">
    <fdc id="fdcNEC" autoMount="{A: {name: 'PC-DOS 1.0', path: 'pcdos-1.00.json'}}">
        <control type="container">
            <control type="list" class="input" binding="listDrives"/>
            <control type="list" class="input" binding="listDisks">
                <disk path="">None</disk>
                <disk path="pcdos-1.00.json">PC-DOS 1.0</disk>
            </control>
            <control type="button" class="input" binding="loadDisk">Load</control>
        </control>
    </fdc>
    ...
</machine>
```

[Example 2](examples/example2.html) shows the updated [XML](examples/example2.xml) in action.

### Loading Machine XML Files

Inside a web page, add a &lt;div&gt; to contain the machine, load the *pcx86.js* script
(*pcx86-dbg.js* if you need the PCx86 [Debugger](debugger/)), and then call *embedPCx86()*:

```xml
<div id="example2"/>
<script type="text/javascript" src="pcx86.js"/>
<script type="text/javascript">
    embedPCx86("example2", "example2.xml", "components.xsl");
</script>
```

In fact, this is exactly what we did in [Example 2](examples/example2.html).

*embedPCx86()* accepts 4 parameters:

- The *id* of the machine &lt;div&gt; (e.g., "example2");
- The *url* of the machine XML file (e.g., "example2.xml");
- The *url* of the components XSL file (e.g., "components.xsl")
- Any *parms* that should be passed to the machine components during initialization

The first 3 parameters are required; the *parms* parameter is optional.  If *parms* is specified, it should
contain a single-quoted JSON object definition, with properties intended to override those specified in the
machine XML file; eg:

	'{messages:"warn",autoMount:{"A":{"path":"/disks/pcx86/dos/ibm/1.00/PCDOS100.json"}}}'

*components.xsl* (and the corresponding *components.css*) are included with the PCx86 scripts in the
[Examples](#running-pcx86-on-your-own-server) download.  Every version of *components.xsl* has a corresponding
*components.css*, which your web page should also load, usually with a &lt;link&gt; tag inside the &lt;head&gt;
element; eg:

```xml
<link rel="stylesheet" type="text/css" href="components.css">
```

### Using the PCx86 Debugger

To create a configuration that includes the PCx86 Debugger, you need to:

- Add [Debugger](debugger/) and [Control Panel](panel/) components to the machine XML file;
- Add debugger controls to the Control Panel, such as Run, Step, Reset, etc;
- Change your web page to load *pcx86-dbg.js* instead of *pcx86.js*.

Take a look at [Example 3A](examples/example3a.html) ([XML](examples/example3a.xml)).

The debugger gives you access to more capabilities than mere debugging. For example, you can use the **load**
command to load diskette sectors into memory ("l [addr] [drive #] ...") or the **dump** command to dump an entire
diskette as JSON ("d disk [drive #]").  You can also **halt** a machine ("h") and **dump** its entire state as JSON
("d state"). You can save that state in a .json file, and then use that state to initialize a new machine (as long as
it uses the same machine *id*).

In fact, [Example 3B](examples/example3b.html) ([XML](examples/example3b.xml))
does just that, using JSON dumps created from [Example 3A](examples/example3a.html) after starting VisiCalc.
See the *state* property on the [Computer](computer/) component for more information on state files.

### Running PCx86 On Your Own Server
			
All of the examples described above are available for [download](examples/).

### Creating PCx86-Compatible Disk Images

If you have (or find) an IMG disk image file on a server, the PCjs Node web server provides a
[DiskDump API](/api/v1/dump) via endpoint "/api/v1/dump" that creates PCx86-compatible disks in JSON:
	
	{{ site.url }}/api/v1/dump?disk=(file|url)&format=json

For example, let's say you found a disk image online, such as:

	https://s3-us-west-2.amazonaws.com/archive.pcjs.org/disks/pcx86/dos/ibm/1.00/PCDOS100.img

To convert it to a PCx86-compatible JSON format, issue the following
[request](/api/v1/dump?disk=https://s3-us-west-2.amazonaws.com/archive.pcjs.org/disks/pcx86/dos/ibm/1.00/PCDOS100.img&format=json),
save the resulting JSON file to a folder on your server, and then update your machine XML file(s) to use that file.

	{{ site.url }}/api/v1/dump?disk=https://s3-us-west-2.amazonaws.com/archive.pcjs.org/disks/pcx86/dos/ibm/1.00/PCDOS100.img&format=json

If necessary, you can also reverse the process and convert a JSON disk image back into an IMG file, with the
this [request](/api/v1/dump?disk=http://www.pcjs.org/disks/pcx86/dos/ibm/1.00/PCDOS100.json&format=img):

	{{ site.url }}/api/v1/dump?disk={{ site.url }}/disks/pcx86/dos/ibm/1.00/PCDOS100.json&format=img

Although PCx86 will accept IMG disk image files, it must call the [DiskDump API](/api/v1/dump) to convert the image
every time it's loaded, so it's *much* faster and more efficient to use pre-converted JSON-encoded disk images.

Remember that PC and PC XT machines supported only 160Kb diskettes (on any version of PC-DOS),
320Kb diskettes (on PC-DOS 1.1 and higher), and 180Kb and 360Kb diskettes (on PC-DOS 2.0 and higher).

The 1.2Mb diskette format was introduced with the PC AT, and 720Kb and 1.44Mb diskette formats were
supported later on 8Mhz PC AT and PS/2 models.  So, when using any of these larger formats, be sure you're
also using a compatible machine configuration.

Learn more about PCx86 disk images [here](/disks/).

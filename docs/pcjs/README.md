PCjs Documentation
---

[PCjs](/docs/about/pcjs/) is a full-featured IBM PC, PC XT and PC AT emulator written entirely in JavaScript.
After you've read the Documentation, play with the [Demos](demos/).

[IBM PC Model 5150](/devices/pc/machine/5150/mda/64kb/ "PCjs:ibm5150")

The [simulation](/devices/pc/machine/5150/mda/64kb/) above features an Intel 8088
running at 4.77Mhz, with 64Kb of RAM and an IBM Monochrome Display Adapter.  To create your
own simulation, all you need is the PCjs script and a machine XML file, along with a couple
of XSL and CSS support files (included in the ZIP file below).

### Creating Machine XML Files

A PCjs machine XML file defines all a machine's components. Components include:

* [Chipset](/docs/pcjs/chipset/)
* [Computer](/docs/pcjs/computer/)
* [Control Panel](/docs/pcjs/panel/)
* [CPU](/docs/pcjs/cpu/)
* [Debugger](/docs/pcjs/debugger/)
* [Floppy Disk Controller](/docs/pcjs/fdc/)
* [Hard Disk Controller](/docs/pcjs/hdc/)
* [Keyboard](/docs/pcjs/keyboard/)
* [Mouse](/docs/pcjs/mouse/)
* [RAM](/docs/pcjs/ram/)
* [ROM](/docs/pcjs/rom/)
* [Serial Port](/docs/pcjs/serial/)
* [Video Adapter](/docs/pcjs/video/)

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

Here is a [demo](/docs/pcjs/demos/sample1.html) of this machine's [XML](/docs/pcjs/demos/sample1.xml) file.

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
		<fdc id="fdcNEC" automount="{A: {name: 'PC-DOS 1.0', path: 'pcdos-1.00.json'}}">
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

Here is a [demo](/docs/pcjs/demos/sample2.html) of the updated machine's [XML](/docs/pcjs/demos/sample2.xml) file.

### Loading Machine XML Files

Inside a web page, add a &lt;div&gt; to contain the machine, load the **pc.js** script
(**pc-dbg.js** if you need the PCjs [Debugger](/docs/pcjs/debugger/)), and then call *window.embedPC()*:

	<div id="sample2"/>
	<script type="text/javascript" src="pc.js"/>
	<script type="text/javascript">
		window.embedPC("sample2", "sample2.xml", "components.xsl");
	</script>

In fact, this is exactly what we did in the previous [demo](/docs/pcjs/demos/sample2.html).

*window.embedPC()* requires 3 parameters:

- The *id* of the machine &lt;div&gt; (e.g., "sample2");
- The *url* of the machine XML file (e.g., "sample2.xml");
- The *url* of the components XSL file (e.g., "components.xsl")

**components.xsl** (and the corresponding **components.css**) are included with the PCjs scripts in the samples download below.

### Using the PCjs Debugger

To create a configuration that includes the PCjs Debugger, you need to:

- Add [Debugger](/docs/pcjs/debugger/) and [Control Panel](/docs/pcjs/panel/) components to the machine XML file;
- Add debugger controls to the Control Panel, such as Run, Step, Reset, etc;
- Change your web page to load **pc-dbg.js** instead of **pc.js**.

Take a look at the [sample3a](/docs/pcjs/demos/sample3a.html) demo (with [XML file](/docs/pcjs/demos/sample3a.xml)) for an example.

The debugger gives you access to more capabilities than mere debugging. For example, you can use the **load** command
to load diskette sectors into memory ("l &lt;addr&gt; &lt;drive&gt; ...") or dump an entire diskette as JSON ("l json &lt;drive&gt;").
You can also **halt** a machine ("h") and **dump** its entire state as JSON ("d state"). You can save that state in a .json file,
and then use that state to initialize a new machine (as long as it uses the same machine *id*).

In fact, the [sample3b](/docs/pcjs/demos/sample3b.html) demo (with [XML file](/docs/pcjs/demos/sample3b.xml))
does just that, using JSON dumps created from [sample3a](/docs/pcjs/demos/sample3a.html) after starting VisiCalc.
See the *state* attribute on the [Computer](/docs/pcjs/computer/) component for more information on state files.

### Running PCjs On Your Own Server
			
All of the demos described above are available for [download](/docs/pcjs/demos/).

### Creating PCjs-Compatible Disk Images

If you have (or find) an IMG disk image file on a server, [pcjs.org](http://www.pcjs.org/) provides a
[DiskDump API](/api/v1/dump) that creates PCjs-compatible disks in JSON:

	http://www.pcjs.org/api/v1/dump?disk=(file|url)&format=json

For example, let's say you found a disk image online:

	http://static.pcjs.org/disks/pc/dos/ibm/1.00/PCDOS100.img

To convert it to a PCjs-compatible JSON format, use the following command:

	http://www.pcjs.org/api/v1/dump?disk=http://static.pcjs.org/disks/pc/dos/ibm/1.00/PCDOS100.img&format=json

Save the resulting JSON file to a folder on your server, and then update your machine XML file(s) to use that file.
If necessary, you can also reverse the process, converting a JSON disk image back into an IMG file:

	http://www.pcjs.org/api/v1/dump?disk=http://www.pcjs.org/disks/pc/dos/ibm/1.00/PCDOS100.json&format=img

Although PCjs will accept IMG disk image files, it must call the [DiskDump API](/api/v1/dump)
to convert the image every time it's loaded, so it's *much* faster and more efficient to use pre-converted
JSON-encoded disk images.

Remember that PC and PC XT machines supported only 160Kb diskettes (on any version of PC-DOS),
320Kb diskettes (on PC-DOS 1.1 and higher), and 180Kb and 360Kb diskettes (on PC-DOS 2.0 and higher).

The 1.2Mb diskette format was introduced with the PC AT, and 720Kb and 1.44Mb diskette formats were
supported later on 8Mhz PC AT and PS/2 models.  So, when using any of these larger formats, be sure you're
also using a compatible machine configuration.

Learn more about PCjs disk images [here](/disks/).

---
layout: page
title: IBM Video Graphics Array (VGA)
permalink: /devices/pcx86/video/ibm/vga/
---

IBM Video Graphics Array (VGA)
---

### IBM VGA Configurations

The easiest way for a machine to include an VGA *[Video](/docs/pcx86/video/)* component in its XML configuration file
is to reference one of the project's VGA configuration files, using the *ref* attribute; eg:

```xml
<video ref="/devices/pcx86/video/ibm/vga/1986-10-27/256kb-autolockfs.xml"/>
```

The referenced XML file automatically defines visual elements (eg, dimensions of the display window and other
visual indicators), display behaviors (eg, touchscreen support, mouse pointer locking), the ROM to load (and where
to load it), and other video card hardware features (eg, *memory* and *switches*).

Here's what *256kb-autolockfs.xml* currently looks like:

```xml
<video id="videoVGA" model="vga" screenwidth="1280" screenheight="960" scale="true" touchscreen="mouse" autolock="true" pos="center" padding="8px">
    <menu>
        <title>IBM VGA Color Display</title>
        <control type="container" pos="right">
            <control type="led" label="Caps" binding="caps-lock" padleft="8px"/>
            <control type="led" label="Num" binding="num-lock" padleft="8px"/>
            <control type="led" label="Scroll" binding="scroll-lock" padleft="8px"/>
            <control type="button" binding="fullScreen" padleft="8px">Full Screen</control>
        </control>
    </menu>
    <rom id="romVGA" addr="0xc0000" size="0x6000" file="/devices/pcx86/video/ibm/vga/1986-10-27/ibm-vga.json" notify="videoVGA[0x378d,0x3f8d]"/>
</video>
```

The following IBM VGA configuration files are currently available:

 - [256kb-autolockfs.xml](1986-10-27/256kb-autolockfs.xml)
 - [256kb-lockfs.xml](1986-10-27/256kb-lockfs.xml)

### IBM VGA ROM

We have only one IBM VGA ROM revision, dated October 27, 1986, from an IBM PS/2 Display Adapter.  Which, BTW,
has to be one of the *most* confusing product names ever, since the adapter was an 8-bit card designed for ISA
machines, *not* PS/2 machines.  

To (re)build the JSON-encoded IBM VGA ROM with symbols, run the following command:

	filedump --file=archive/ibm-vga.rom --format=bytes --decimal
	
The symbol information in the MAP file will be automatically converted and appended to the dump of the ROM file. 

The PCjs server's Dump API can be used as well:

	http://www.pcjs.org/api/v1/dump?file=https://s3-us-west-2.amazonaws.com/archive.pcjs.org/devices/pcx86/video/ibm/vga/1986-10-27/ibm-vga.rom&format=bytes&decimal=true

The disassembled contents of the 1986-10-27 ROM from the IBM PS/2 Display Adapter is available [here](1986-10-27/ibm-vga.asm).

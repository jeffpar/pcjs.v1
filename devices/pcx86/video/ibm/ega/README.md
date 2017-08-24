---
layout: page
title: IBM Enhanced Graphics Adapter (EGA)
permalink: /devices/pcx86/video/ibm/ega/
---

IBM Enhanced Graphics Adapter (EGA)
---

### IBM EGA Configurations

The easiest way for a machine to include an EGA *[Video](/docs/pcx86/video/)* component in its XML configuration file
is to reference one of the project's predefined EGA configuration files, using the *ref* attribute; eg:

```xml
<video ref="/devices/pcx86/video/ibm/ega/1984-09-13/64kb.xml"/>
```

The referenced XML file automatically defines visual elements (eg, dimensions of the display window and other
visual indicators), display behaviors (eg, touchscreen support, mouse pointer locking), the ROM to load (and where
to load it), and other video card hardware features (eg, *memory* and *switches*).

Here's what *64kb.xml* currently looks like:

```xml
<video id="videoEGA" model="ega" memory="0x10000" screenwidth="640" screenheight="350" touchscreen="mouse" pos="center" padding="8px">
    <menu>
        <title>IBM Enhanced Color Display</title>
        <control type="container" pos="right">
            <control type="led" label="Caps" binding="caps-lock" padleft="8px"/>
            <control type="led" label="Num" binding="num-lock" padleft="8px"/>
            <control type="led" label="Scroll" binding="scroll-lock" padleft="8px"/>
        </control>
    </menu>
    <rom id="romEGA" addr="0xc0000" size="0x4000" file="/devices/pcx86/video/ibm/ega/1984-09-13/ibm-ega.json" notify="videoEGA"/>
</video>
```

The following IBM EGA configuration files are currently available:

 - [64kb.xml](1984-09-13/64kb.xml)
 - [128kb-autolock640.xml](1984-09-13/128kb-autolock640.xml)
 - [128kb-autolockfs.xml](1984-09-13/128kb-autolockfs.xml)
 - [128kb-lockfs.xml](1984-09-13/128kb-lockfs.xml)
 - [256kb-autolock640.xml](1984-09-13/256kb-autolock640.xml)
 - [256kb-autolockfs.xml](1984-09-13/256kb-autolockfs.xml)
 - [256kb-lockfs.xml](1984-09-13/256kb-lockfs.xml)

### IBM EGA ROM

We have only one IBM EGA ROM revision, dated September 13, 1984.

To (re)build the JSON-encoded IBM EGA ROM with symbols, run the following command:

	filedump --file=archive/ibm-ega.rom --format=bytes --decimal
	
The symbol information in the MAP file will be automatically converted and appended to the dump of the ROM file. 

The PCjs server's Dump API can be used as well:

	http://www.pcjs.org/api/v1/dump?file=https://s3-us-west-2.amazonaws.com/archive.pcjs.org/devices/pcx86/video/ibm/ega/1984-09-13/ibm-ega.rom&format=bytes&decimal=true

### IBM EGA Font Information

As noted in [Video.onROMLoad()](/modules/pcx86/lib/video.js), the Video component needs to know where the card's
font data is located:

	For EGA cards, in the absence of any parameters, we assume that we're receiving the original
	IBM EGA ROM, which stores its 8x14 font data at 0x2230 as one continuous sequence; the total size
	of the 8x14 font is 0xE00 bytes.
	
	At 0x3030, there is an "ALPHA SUPPLEMENT" table, which contains 15 bytes per row instead of 14,
	because each row is preceded by one byte containing the corresponding ASCII code; there are 20
	entries in the supplemental table, for a total size of 0x12C bytes.
	
	Finally, at 0x3160, we have the 8x8 font data (also known as the thicker "double dot" CGA font);
	the total size of the 8x8 font is 0x800 bytes.  No other font data is present in the EGA ROM;
	the thin 5x7 "single dot" CGA font is notably absent, which is fine, because we never loaded it for
	the MDA/CGA either.
	
	TODO: Determine how the supplemental table is used and whether we need to add some "run-time"
	font generation to support it (as opposed to "init-time" generation, which is all we do now).
	There's probably a similar need for user-defined fonts; for now, they're simply not supported.

For reference, here are the first 0x80 bytes at offset 0x2230 from this ROM, which contain the font data
for the first 9 8x14 characters:

	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00, // 0x00002230 ................
	0x7E,0x81,0xA5,0x81,0x81,0xBD,0x99,0x81,0x7E,0x00,0x00,0x00,0x00,0x00,0x7E,0xFF, // 0x00002240 ~.......~.....~.
	0xDB,0xFF,0xFF,0xC3,0xE7,0xFF,0x7E,0x00,0x00,0x00,0x00,0x00,0x00,0x6C,0xFE,0xFE, // 0x00002250 ......~......l..
	0xFE,0xFE,0x7C,0x38,0x10,0x00,0x00,0x00,0x00,0x00,0x00,0x10,0x38,0x7C,0xFE,0x7C, // 0x00002260 ..|8........8|.|
	0x38,0x10,0x00,0x00,0x00,0x00,0x00,0x00,0x18,0x3C,0x3C,0xE7,0xE7,0xE7,0x18,0x18, // 0x00002270 8...............
	0x3C,0x00,0x00,0x00,0x00,0x00,0x18,0x3C,0x7E,0xFF,0xFF,0x7E,0x18,0x18,0x3C,0x00, // 0x00002280 ........~..~....
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x18,0x3C,0x3C,0x18,0x00,0x00,0x00,0x00,0x00, // 0x00002290 ................
	0xFF,0xFF,0xFF,0xFF,0xFF,0xE7,0xC3,0xC3,0xE7,0xFF,0xFF,0xFF,0xFF,0xFF,0x00,0x00, // 0x000022A0 ................

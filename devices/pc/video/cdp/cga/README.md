---
layout: page
title: Columbia Data Products Color Graphics Adapter (CGA)
permalink: /devices/pc/video/cdp/cga/
---

Columbia Data Products Color Graphics Adapter (CGA)
---

We don't have a Columbia Data Products CGA card, so we cannot say to what extent it may differ from
an IBM CGA card (if at all).  All we have is what's believed to be a copy of their CGA character ROM,
and it is *identical* the CGA portion of the [IBM CGA](/devices/pc/video/ibm/cga/) character ROM.

### Columbia Data Products CGA Configurations

The easiest way for a machine to include an CGA *[Video](/docs/pcjs/video/)* component in its XML configuration file
is to reference the project's predefined CGA configuration file, using the *ref* attribute; eg:

	<video ref="/devices/pc/video/cdp/cga/cdp-cga.xml"/>

The referenced XML file automatically defines visual elements (eg, dimensions of the display window and other
visual indicators), display behaviors (eg, touchscreen support, mouse pointer locking), and the character ROM to load. 

Here's what *cdp-cga.xml* currently looks like:

	<video id="videoCGA" model="cga" screenwidth="960" screenheight="480" scale="true" charset="/devices/pc/video/cdp/cga/MPC_VID-1.0.json" pos="center" padding="8px">
		<menu>
			<title>Color Display</title>
			<control type="container" pos="right">
				<control type="led" label="Caps" binding="caps-lock" padleft="8px"/>
				<control type="led" label="Num" binding="num-lock" padleft="8px"/>
				<control type="led" label="Scroll" binding="scroll-lock" padleft="8px"/>
			</control>
		</menu>
	</video>

### Columbia Data Products CGA Character ROM

There is only one known Columbia Data Products CGA Character ROM ([MDP_VID-10.json](MDP_VID-1.0.json)), and it is
*identical* to the CGA portion of the [IBM CGA](/devices/pc/video/ibm/cga/) character ROM.

For reference, here are the first 0x80 bytes at offset 0x0000 from this ROM, which contain the font data for the first
16 8x8 characters:

	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x7E,0x81,0xA5,0x81,0xBD,0x99,0x81,0x7E, // 0x00000000 ........~......~
	0x7E,0xFF,0xDB,0xFF,0xC3,0xE7,0xFF,0x7E,0x6C,0xFE,0xFE,0xFE,0x7C,0x38,0x10,0x00, // 0x00000010 ~......~l...|8..
	0x10,0x38,0x7C,0xFE,0x7C,0x38,0x10,0x00,0x38,0x7C,0x38,0xFE,0xFE,0xD6,0x10,0x38, // 0x00000020 .8|.|8..8|8....8
	0x10,0x10,0x38,0x7C,0xFE,0x7C,0x10,0x38,0x00,0x00,0x18,0x3C,0x3C,0x18,0x00,0x00, // 0x00000030 ..8|.|.8........
	0xFF,0xFF,0xE7,0xC3,0xC3,0xE7,0xFF,0xFF,0x00,0x3C,0x66,0x42,0x42,0x66,0x3C,0x00, // 0x00000040 ..........fBBf..
	0xFF,0xC3,0x99,0xBD,0xBD,0x99,0xC3,0xFF,0x0F,0x07,0x0F,0x7D,0xCC,0xCC,0xCC,0x78, // 0x00000050 ...........}...x
	0x3C,0x66,0x66,0x66,0x3C,0x18,0x7E,0x18,0x3F,0x33,0x3F,0x30,0x30,0x70,0xF0,0xE0, // 0x00000060 .fff..~.?3?00p..
	0x7F,0x63,0x7F,0x63,0x63,0x67,0xE6,0xC0,0x18,0xDB,0x3C,0xE7,0xE7,0x3C,0xDB,0x18, // 0x00000070 .c.ccg..........

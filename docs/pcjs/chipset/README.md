---
layout: page
title: PCjs &lt;chipset&gt; Element
permalink: /docs/pcjs/chipset/
---

PCjs ChipSet Component
---

Format
---
	<chipset>...</chipset>

Purpose
---
Creates an instance of the ChipSet component, which includes support for the following internal components:

* 8237 Direct Memory Access (DMA) Controller
* 8259 Programmable Interrupt Controller (PIC)
* 8253 Programmable Interval Timers (PIT)
* 8255 Programmable Peripheral Interface (PPI)
* Speaker (sound requires [webkitAudioContext](http://www.w3.org/TR/webaudio/) support in the web browser)

Attributes
---
 * *model* (required)

	The IBM PC model number to simulate (must be 5150, 5160 or 5170).

 * *sw1* (optional): A binary string representing DIP switches #1 through #8 for the SW1 switch block on the IBM PC motherboard, as follows:

	* \#1:
		* 0 (OFF) for normal operation
		* 1 (ON) to loop in the ROM BIOS POST (Power-On Self-Test)
	* \#2:
		* 0 (OFF) if math coprocessor installed
		* 1 (ON) if math coprocessor NOT installed
	* \#3 and \#4:
		* 11 for 64Kb
		* 01 for 128Kb
		* 10 for 192Kb
		* 00 for 256Kb
	* \#5 and \#6:
		* 11 for no monitor (or EGA installed)
		* 01 for Color Display (for use with CGA in 40x25 mode)
		* 10 for Color Display (for use with CGA in 80x25 mode)
		* 00 for Monochrome Display (or more than one Color/Monochrome monitor)
	* \#7 and \#8:
		* 11 for 1 diskette drive
		* 01 for 2 diskette drives
		* 10 for 3 diskette drives
		* 00 for 4 diskette drives

 * *sw2* (optional)

	A binary string representing DIP switches 1-8 for the SW2 switch block on the IBM PC motherboard,
	indicating the number of 32Kb blocks of additional RAM installed  (model 5150 only).

 * *sound* (optional)

	*true* (default) to enable sound, assuming the browser supports **webkitAudioContext**, or *false* to disable sound.

 * *scaletimers* (optional)

	*false* (default) to update timers in sync with CPU speed, *true* to scale timer updates to match real-world time.

 * *floppies* (optional)

	If no *sw1* setting is provided, *floppies* may be used to specify an array of floppy drive capacities;
	eg, [360, 360] for two 360Kb drives; default is none.

 * *monitor* (optional)

	If no *sw1* setting is provided, *monitor* specifies the primary monitor type, and should be one of:

	* "none"
	* "tv"
	* "color"
	* "mono"
	* "ega"

 * *rtcdate* (optional)

	Allows a specific startup date and time (model 5170 only); the *rtcdate* string must be of the form:
	
		yyyy-mm-ddThh:mm:ss

 * Also supports the attributes of *[Component](/docs/pcjs/component/)*.

Bindings
---
 * *sw1*

	For use with a control of type *switches*, which creates a &lt;div&gt; that the ChipSet will use to display the current settings of the SW1 switch block.

 * *sw2*

	Same as above, but for the SW2 switch block, if any.

 * *swdesc*

	For use with a control of type *descriptions*, which creates a &lt;div&gt; that the ChipSet will use to display a text description of the selected DIP switch settings.

Example
---
	<chipset id="chipset" model="5150" sw1="01000001" sw2="11110000"/>

Output
---
	<div id="..." class="pc-chipset pc-component">
		<div class="pc-container">
			<div class="pcjs-chipset" data-value="id:'...',name:'...',model:'...',sw1:'...',sw2:'...'"></div>
		</div>
	</div>

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCjs Documentation](..)]

<!-- NOTE: I had to "escape" the hashmarks above, otherwise PhpStorm's Markdown plugin would preview them as
headings; I think that's a bug in the plugin, because my reading of Markdown's syntax for the "Atx-style headers"
is that header hashmarks must always appear at the beginning of the line. --@jeffpar -->

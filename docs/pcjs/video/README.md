---
layout: page
title: PCjs &lt;video&gt; Element
permalink: /docs/pcjs/video/
---

PCjs Video Component
---

Format
---
	<video>...</video>

Purpose
---
Creates an instance of the Video component. This component is responsible for:

- Creating the canvas element representing the machine's screen;
- Loading the appropriate character generator ROM;
- Simulating the appropriate video hardware ports (e.g., MDA, CGA);
- Periodically rendering the video buffer contents to the canvas element

Attributes
---
 * *addr* (required)
 
	The ROM starting address (e.g., 0xfe000).
	
 * *size* (required)
 
	The length of ROM, in bytes (e.g., 0x02000 for an 8Kb ROM). This must match the length of the ROM image file.
	
 * *file* (required)
 
	URL of the ROM image file to load at the specified addr.
	
 * *notify* (optional)
 
	The *id* of a component to notify when *file* has been loaded. For example, the Video	component may need
	to know when an external video ROM has been loaded. Any component can load its own files, including ROM image files,
	but it's simpler to use the ROM component and request notification.

 * *model* (optional)

	* "mda" (Monochrome Display Adapter)
	* "cga" (Color Graphics Adapter)
	* "ega" (Enhanced Graphics Adapter)

	If *model* is not set, the SW1 switch block settings from the [ChipSet](/docs/pcjs/chipset/) component will
	determine the video model to use ("mda" or "cga" only).
	
 * *scale* (optional; default is false)
 
	true scales text modes to fill the canvas;  
	false centers text modes on the canvas (this generally provides the sharpest rendering).
	
 *  *screenwidth*, *screenheight* (required)
 
	The width and height of the canvas, in pixels (these are numbers, not style attributes, so do not include
	a "px" suffix).
	
 * *fontrom* (formerly *charset*; required for models "mda" and "cga")
 
	The name of a character generator (font ROM) file. The MDA and CGA adapters did not contain a separate
	system ROM, but they did contain on-board font data in ROM that the adapter used internally to generate character
	images. Consequently, the Video component requires the same font data for those adapters.
	
	The EGA uses font data stored in its system ROM, which is loaded by the ROM component, so do not use this
	setting with model "ega".
	
Also supports the attributes of *[Component](/docs/pcjs/component/)*.

Bindings
---
 * *refresh*
 
	For use with a control of type button, this manually refreshes the screen from the video buffer.
	Refreshes occur automatically, so this will generally not be necessary, except in certain diagnostic situations.

Example
---
	<video id="videoMDA" screenwidth="720" screenheight="350" scale="true" fontrom="ibm-mda-cga.json">
    	<name>Monochrome Display</name>
    </video>

Output
---
	<div id="..." class="pc-video pc-component">
		<div class="pc-container">
			<div class="pcjs-video" data-value="id:'...',name:'...',addr:'...',size:'...',test:'...'"></div>
		</div>
	</div>

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCjs Documentation](..)]

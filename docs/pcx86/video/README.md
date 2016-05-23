---
layout: page
title: PCx86 &lt;video&gt; Element
permalink: /docs/pcx86/video/
redirect_from:
  - /docs/pcjs/video/
---

PCx86 Video Component
---

Format
---
```xml
<video>...</video>
```

Purpose
---
Creates an instance of the Video component. This component is responsible for:

- Creating the canvas element representing the machine's screen;
- Loading the appropriate character generator ROM;
- Simulating the appropriate video hardware ports (e.g., MDA, CGA);
- Periodically rendering the video buffer contents to the canvas element

Attributes
---
 * *model* (optional)

	* "mda" (Monochrome Display Adapter)
	* "cga" (Color Graphics Adapter)
	* "ega" (Enhanced Graphics Adapter)

	If *model* is not set, the SW1 switch block settings from the [ChipSet](/docs/pcx86/chipset/) component will
	determine the video model to use ("mda" or "cga" only).
	
 *  *screenWidth*, *screenHeight* (required)
 
	The width and height of the canvas, in pixels (these are numbers, not style attributes, so do not include
	a "px" suffix); the canvas resolution does not need to match the *model* resolution (in fact, it should probably
	be closer to the resolution of modern monitors, but still proportional to the resolution of the *model* being used).
	
 * *fontROM* (formerly *charset*; required for models "mda" and "cga")
 
	The name of a character generator (font ROM) file. The MDA and CGA adapters did not contain a separate
	system ROM, but they did contain on-board font data in ROM that the adapter used internally to generate character
	images. Consequently, the Video component requires the same font data for those adapters.
	
	The EGA uses font data stored in its system ROM, which is loaded by the ROM component, so do not use this
	setting with model "ega".

 * *aspect* (optional)
 
	Defines an aspect ratio that overrides the default aspect (ie, width-to-height) ratio normally determined
	by the *screenWidth* and *screenHeight* parameters; can also be present as a URL parameter.
	
 * *scale* (optional; default is false)
 
	true scales text modes to fill the canvas (eg, scales 40-column modes to fill 80-column screens);
	false centers text modes on the canvas (this generally provides the sharpest rendering).
	
 * *smoothing* (optional; default depends on the browser)
 
	true enables HTML5 canvas image smoothing, false disables it (if not specified, the browser's default is used);
	can also be present as a URL parameter.
	
Also supports the attributes of *[Component](/docs/pcx86/component/)*.

Bindings
---
 * *refresh*
 
	For use with a control of type button, this manually refreshes the screen from the video buffer.
	Refreshes occur automatically, so this will generally not be necessary, except in certain diagnostic situations.

Example
---
```xml
<video id="videoMDA" screenWidth="720" screenHeight="350" fontROM="ibm-mda-cga.json" scale="true">
    <name>Monochrome Display</name>
</video>
```

Output
---
```html
<div id="..." class="pc-video pc-component">
    <div class="pc-container">
        <div class="pcx86-video" data-value="...">
        </div>
    </div>
</div>
```

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCx86 Documentation](..)]

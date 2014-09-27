&lt;HDC&gt;
===

PCjs *HDC* (Hard Disk Controller) XML Specification
---

Format
---
	<hdc>...</hdc>

Purpose
---
Creates an instance of the Hard Disk Controller (HDC) component. The HDC is responsible for:

- Automatically loading fixed disk image files at boot;
- Simulating the appropriate controller hardware ports;
- Saving/restoring all user fixed disk modifications in browser local storage.

The HDC component simulates an STC-506/412 interface to an IBM PC XT fixed disk drive.
The first such drive was a 10Mb 5.25-inch drive containing two platters and 4 heads; data spanned 306 cylinders
for a total of 1224 tracks, with 17 sectors/track and 512 bytes/sector.

Attributes
---
 * *drives* (required)
 
	This is an array definition, with one array entry per fixed disk. Each entry is a drive object definition,
	each of which may contain 'name', 'path' and 'type' properties. For example:
	
		[{name:'10Mb Hard Disk',path:'10mb.json',type:3}]
		
	The 'path' property is optional; if omitted, an empty disk matching the specified drive type will be created
	(10mb in the case of drive type 3).
	
 * Also supports the attributes of *[Component](/docs/pcjs/component/)*.

Bindings
---
This component has no bindings. Fixed disks cannot be loaded or unloaded once the machine is "powered".

Example
---
	<hdc id="hdcXT" drives="[{name:'10Mb Hard Disk',type:3}]"/>

Output
---
	<div id="..." class="pc-hdc pc-component">
		<div class="pc-container">
			<div class="pcjs-hdc" data-value="id:'...',name:'...',drives:'...'"></div>
		</div>
	</div>

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCjs Documentation](..)]
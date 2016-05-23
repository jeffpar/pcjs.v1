---
layout: page
title: PCx86 &lt;hdc&gt; Element
permalink: /docs/pcx86/hdc/
redirect_from:
  - /docs/pcjs/hdc/
---

PCx86 Hard Drive Controller (HDC) Component
---

Format
---
```xml
<hdc>...</hdc>
```

Purpose
---
Creates an instance of the Hard Drive Controller (HDC) component. The HDC is responsible for:

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
	
		[{name:'10Mb Hard Drive',path:'10mb.json',type:3}]
		
	The 'path' property is optional; if omitted, an empty disk matching the specified drive type will be created
	(10mb in the case of drive type 3).
	
 * *type* (optional)
 
	Should be set to one of:
	
	 * *'xt'*: PC XT Xebec controller emulation
	 * *'at'*: PC AT Western Digital controller emulation
	
	Also, make sure the appropriate ROM is installed.
	
	For the Xebec (*'xt'*) controller, you should install the Xebec ROM; eg:
	
		<rom id="romHDC" addr="0xc8000" size="0x2000" file="/devices/pcx86/hdc/ibm-xebec-1982.json"/>

	For the Western Digital (*'at'*) controller, use a Model 5170 (or newer) ROM module; eg:

		<rom id="romBIOS" addr="0xf0000" size="0x10000" alias="0xff0000" file="/devices/pcx86/rom/5170/1984-01-10/1984-01-10.json"/>

	The default *type* setting is *'xt'*.

 * Also supports the attributes of *[Component](/docs/pcx86/component/)*.

Bindings
---
This component has no bindings. Fixed disks cannot be loaded or unloaded once the machine is "powered".

Example
---
```xml
<hdc id="hdcXT" drives="[{name:'10Mb Hard Drive',type:3}]"/>
```

Output
---
```html
<div id="..." class="pc-hdc pc-component">
    <div class="pc-container">
        <div class="pcx86-hdc" data-value="id:'...',name:'...',drives:'...'">
        </div>
    </div>
</div>
```

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCx86 Documentation](..)]

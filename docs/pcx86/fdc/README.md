---
layout: page
title: PCx86 &lt;fdc&gt; Element
permalink: /docs/pcx86/fdc/
---

PCx86 Floppy Drive Controller (FDC) Component
---

Format
---
```xml
<fdc>...</fdc>
```

Purpose
---
Creates an instance of the Floppy Drive Controller (FDC) component. The FDC is responsible for:

- Automatically loading diskette image files at boot;
- Simulating the appropriate controller hardware ports;
- Providing user controls to display available diskettes and load/unload diskettes;
- Saving/restoring all user diskette modifications in browser local storage.

Attributes
---
 * *autoMount* (optional)
 
	This is an object definition containing one or more drive-letter properties.
	Each drive-letter property should contain, in turn, another object definition with 'name' and 'path' properties.
	For example:
	
		'{A: {name: "PC-DOS 1.0", path: "pcdos-1.00.json"}}'
		
Also supports the attributes of *[Component](/docs/pcx86/component/)*.

Bindings
---
 * *listDrives*
 
	For use with a control of type *list*. The list will be populated automatically with a series of &lt;option&gt;
	elements based on the number of floppy drives, as determined by the SW1 settings obtained from the
	[ChipSet](/docs/pcx86/chipset/) component.
	
 * *listDisks*
 
	For use with a control of type *list*. This list must be manually populated, using &lt;disk&gt; tags.
	See the example below.
	
 * *loadDrive*
 
	For use with a control of type *button*, to load the selected diskette image into the selected drive.
	This control is also used to unload diskette images. Select the diskette you want to unload, then select
	"None" from the list of diskettes, and click this button.

Example
---
```xml
<fdc id="fdcNEC" autoMount="'{A: {name: "PC-DOS 1.0", path: "pcdos-1.00.json"}}'">
    <control type="container">
        <control type="list" class="input" binding="listDrives"/>
        <control type="list" class="input" binding="listDisks">
            <disk path="pcdos-1.00.json">PC-DOS 1.0</disk>
        </control>
        <control type="button" class="input" binding="loadDrive">Load Drive</control>
    </control>
</fdc>
```

Output
---
```html
<div id="..." class="pc-fdc pc-component">
    <div class="pc-container">
        <div class="pcx86-fdc" data-value="id:'...',name:'...',listDrives:'...',listDisks:'...',loadDrive:'...'">
        </div>
    </div>
</div>
```

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCx86 Documentation](..)]

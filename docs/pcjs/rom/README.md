---
layout: page
title: PCjs &lt;rom&gt; Element
permalink: /docs/pcjs/rom/
---

PCjs Read-Only Memory (ROM) Component
---

Format
---
```xml
<rom>...</rom>
```

Purpose
---
Creates an instance of the ROM component. One instance per ROM image file is required.

Attributes
---
 * *addr* (required)
 
	The ROM starting address (e.g., 0xfe000).
	
 * *size* (required)
 
	The length of ROM, in bytes (e.g., 0x02000 for an 8Kb ROM). This must match the length of the ROM image file.
	
 * *file* (required)
 
	URL of the ROM image file to load at the specified addr.
	
 * *notify* (optional)
 
	The *id* of a component to notify when *file* has been loaded. For example, the *[Video](/docs/pcjs/video/)*
	component may need to know when an external video ROM has been loaded. Any component can load its own files,
	including ROM image files, but it's simpler to use the ROM component and request notification.
	
Also supports the attributes of *[Component](/docs/pcjs/component/)*.

Bindings
---
None.

Example
---
```xml
<rom id="romBIOS" addr="0xfe000" size="0x02000" file="/devices/pc/rom/5150/bios/1981-04-24.json"/>
```

Output
---
```html
<div id="..." class="pc-rom pc-component">
    <div class="pc-container">
        <div class="pcjs-rom" data-value="id:'...',name:'...',addr:'...',size:'...',test:'...'">
        </div>
    </div>
</div>
```

[Return to [PCjs Documentation](..)]

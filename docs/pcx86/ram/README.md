---
layout: page
title: PCx86 &lt;ram&gt; Element
permalink: /docs/pcx86/ram/
---

PCx86 Random-Access Memory (RAM) Component
---

Format
---
```xml
<ram>...</ram>
```

Purpose
---
Creates an instance of the RAM component. Multiple instances can be defined, if necessary,
to create discontiguous blocks of RAM.

Attributes
---
 * *addr* (required)
 
	 The RAM starting address (e.g., 0x00000).
	 
 * *size* (optional; default is 0x00000)
 
	The amount of RAM, in bytes. If the size is omitted (or 0), the *[ChipSet](/docs/pcx86/chipset/)* component
	is queried for the amount of RAM indicated by SW1/SW2.
	
 * *test* (optional; default is true)
 
	Disables the ROM BIOS memory test when set to "false".
	
Also supports the attributes of *[Component](/docs/pcx86/component/)*.

Bindings
---
 * *test*
 
	For use with a control of type checkbox, to enable/disable the ROM BIOS memory test.
	
	TODO: Implement.

Example
---
```xml
<ram id="ramLow" addr="0x00000"/>
```

Output
---
```html
<div id="..." class="pc-ram pc-component">
    <div class="pc-container">
        <div class="pcx86-ram" data-value="id:'...',name:'...',addr:'...',size:'...',test:'...'">
        </div>
    </div>
</div>
```

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCx86 Documentation](..)]

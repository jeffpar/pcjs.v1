---
layout: page
title: PCx86 &lt;parallel&gt; Element
permalink: /docs/pcx86/parallel/
redirect_from:
  - /docs/pcjs/parallel/
---

PCx86 ParallelPort Component
---

Format
---
```xml
<parallel>...</parallel>
```

Purpose
---
Creates an instance of the ParallelPort component, which simulates an IBM PC Parallel Printer Adapter.

Attributes
---
 * *adapter* (required)

	A number (1, 2, or 3) indicating whether this adapter uses port 0x3BC, 0x378, or 0x278.  Adapters 1 and 2
	default to IRQ 7, and adapter 3 defaults to IRQ 5.
	
 * *binding* (optional)
 
	The name of an existing control binding (typically a &lt;textarea&gt;) to optionally redirect port I/O to.
	For example, if you've defined a Control Panel with a &lt;textarea&gt; control bound to "print", specifying a
	binding of "print" for the Parallel Port component will bind its port to the same control.
	
Also supports the attributes of *[Component](/docs/pcx86/component/)*.

Bindings
---
 * *buffer*
 
	For use with a control of type "textarea", to send/receive data to/from the port. If you would rather
	bind the port to an existing control, then use *binding* attribute instead (see above).

Example
---
```xml
<parallel id="lpt1" adapter="2" binding="print"/>
```

Output
---
```html
<div id="..." class="pc-parallel pc-component">
    <div class="pc-container">
        <div class="pcx86-parallel" data-value="id:'...',name:'...',adapter:'...',binding:'...'">
        </div>
    </div>
</div>
```

[Return to [PCx86 Documentation](..)]

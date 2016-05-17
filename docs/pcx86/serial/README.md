---
layout: page
title: PCx86 &lt;serial&gt; Element
permalink: /docs/pcx86/serial/
---

PCx86 SerialPort Component
---

Format
---
```xml
<serial>...</serial>
```

Purpose
---
Creates an instance of the SerialPort component, which simulates an IBM PC Asynchronous Adapter (RS-232).

Attributes
---
 * *adapter* (required)

	A number (1 or 2) indicating whether this is a "Primary" or "Secondary" adapter.
	The former uses port 0x3F8 and IRQ 4, the latter uses port 0x2F8 and IRQ 3.
	
 * *binding* (optional)
 
	The name of an existing control binding (typically a &lt;textarea&gt;) to optionally redirect port I/O to.
	For example, if you've defined a Control Panel with a &lt;textarea&gt; control bound to "print", specifying a
	binding of "print" for the Serial Port component will bind its port to the same control.
	
Also supports the attributes of *[Component](/docs/pcx86/component/)*.

Bindings
---
 * *buffer*
 
	For use with a control of type "textarea", to send/receive data to/from the port. If you would rather
	bind the port to an existing control, then use *binding* attribute instead (see above).

Example
---
```xml
<serial id="com1" adapter="1" binding="print"/>
```

Output
---
```html
<div id="..." class="pc-serial pc-component">
    <div class="pc-container">
        <div class="pcx86-serial" data-value="id:'...',name:'...',adapter:'...',binding:'...'">
        </div>
    </div>
</div>
```

[Return to [PCx86 Documentation](..)]

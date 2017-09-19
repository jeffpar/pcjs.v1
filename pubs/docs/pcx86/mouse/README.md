---
layout: page
title: PCx86 &lt;mouse&gt; Element
permalink: /docs/pcx86/mouse/
---

PCx86 Mouse Component
---------------------

Format
------

```xml
<mouse>...</mouse>
```

Purpose
-------

Creates an instance of the Mouse component, which can be used simulate a Microsoft Serial mouse, Bus mouse, or
InPort mouse.

Attributes
----------

 * *adapter*

	1 (primary), 2 (secondary), 0 if not defined; used to select the port range for an InPort mouse 

 * *binding*

	The name of a corresponding device component (implies *type* of "serial", since none of the other mouse
	types require binding with another component)

 * *scaleMouse*

	A floating-point number used to scale incoming mouse coordinates; the default is 0.5

 * *serial* (deprecated; *type* should be set to "serial" and *binding* set to the Serial component ID instead)

	The ID of the Serial component that the mouse must be connected to

 * *type*

	One of "serial", "bus", or "inport"; the default is "serial" if either *serial* or *binding* are set

 * Also supports the attributes of *[Component](../component/)*.

Bindings
--------

No explicit DOM control bindings are used.  The Mouse component automatically binds to all Video screens attached
to the machine in order to obtain mouse events from the browser.

Example
-------

```xml
<mouse type="serial" binding="com1"/>
```

The "serial" example above shows how the *type* and *binding* attributes combine to supersede the *serial* attribute,
which has been deprecated:

```xml
<mouse serial="com1"/>
```

Output
------

```html
<div id="..." class="pc-mouse pc-component">
    <div class="pc-container">
        <div class="pcx86-mouse" data-value="id:'...',name:'...',type:'...',binding:'...'>
        </div>
    </div>
</div>
```

[Return to [PCx86 Documentation](..)]

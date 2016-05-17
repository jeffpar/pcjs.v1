---
layout: page
title: PCx86 &lt;mouse&gt; Element
permalink: /docs/pcx86/mouse/
---

PCx86 Mouse Component
---

Format
---
```xml
<mouse>...</mouse>
```

Purpose
---
Creates an instance of the Mouse component, which simulates the original Microsoft Serial Mouse.

Attributes
---
 * *serial* (required)

	Specifies the id of the Serial component that the mouse must be connected to.
	
As support for more types of mouse hardware are added, new attributes will be added. Also supports the attributes
of *[Component](/docs/pcx86/component/)*.

Bindings
---
None.

Example
---
```xml
<mouse serial="com1"/>
```

Output
---
```html
<div id="..." class="pc-mouse pc-component">
    <div class="pc-container">
        <div class="pcx86-mouse" data-value="id:'...',name:'...',serial:'...'>
        </div>
    </div>
</div>
```

[Return to [PCx86 Documentation](..)]

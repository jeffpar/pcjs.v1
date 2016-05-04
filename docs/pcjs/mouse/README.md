---
layout: page
title: PCjs &lt;mouse&gt; Element
permalink: /docs/pcjs/mouse/
---

PCjs Mouse Component
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
of *[Component](/docs/pcjs/component/)*.

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
        <div class="pcjs-mouse" data-value="id:'...',name:'...',serial:'...'>
        </div>
    </div>
</div>
```

[Return to [PCjs Documentation](..)]

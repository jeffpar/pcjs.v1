---
layout: page
title: PCjs &lt;keyboard&gt; Element
permalink: /docs/pcjs/keyboard/
---

PCjs Keyboard Component
---

Format
---
	<keyboard>...</keyboard>

Purpose
---
Creates an instance of the Keyboard component, which maps JavaScript key events (or other control events) to
IBM PC keyboard scan codes.

Attributes
---
* *model* (optional)
	* us83: US keyboard with 83-key layout (default)
	* us84: US keyboard with 84-key layout
	* us101: US keyboard with 101-key layout
	
Also supports the attributes of *[Component](/docs/pcjs/component/)*.

Bindings
---
 *	*esc*, *ctrl-c*, *ctrl-alt-del*, *left-arrow*, *up-arrow*, *right-arrow*, *down-arrow*, *f1*, *f2*, *f3*, *f4*, *f5*, *f6*, *f7*, *f8*, *f9*, *f10*, ...

	For use with a control of type button (or other control that supports the "onclick" event), to simulate the
	corresponding key press(es).
	
 *	The Keyboard component also provides keyDown, keyUp, and keyPress bindings to any control that supports the
corresponding "keyDown", "keyUp", and "keyPress" events. However, the Video component automatically binds its canvas
element to them, so they are generally unavailable for other components to use.
	
 *	TODO: Provide a complete set of bindings for all possible keys, and controls that display "soft keyboards" appropriate
for the specified model.

Example
---
	<keyboard id="keyboard" model="us83"/>

See [/devices/pc/keyboard/us83.xml](/devices/pc/keyboard/keyboard-us83.xml) for an example that provides a complete "soft keyboard".

Output
---
	<div id="..." class="pc-keyboard pc-component">
		<div class="pc-container">
			<div class="pcjs-keyboard" data-value="id:'...',name:'...',model:'...',sw1:'...',sw2:'...'"></div>
		</div>
	</div>

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCjs Documentation](..)]

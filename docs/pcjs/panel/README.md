---
layout: page
title: PCjs &lt;panel&gt; Element
permalink: /docs/pcjs/panel/
---

PCjs Control Panel Component
---

Format
---
	<panel>...</panel>

Purpose
---
Creates an instance of the Control Panel component, which simply acts as a container for controls that the
machine wants to bind to the [Computer](/docs/pcjs/computer/), [CPU](/docs/pcjs/cpu/), [Keyboard](/docs/pcjs/keyboard/)
and/or [Debugger](/docs/pcjs/debugger/) components.

Attributes
---
None.

Bindings
---
Refer to available bindings in the [Computer](/docs/pcjs/computer/), [CPU](/docs/pcjs/cpu/), [Keyboard](/docs/pcjs/keyboard/)
and [Debugger](/docs/pcjs/debugger/) components.

Example
---
	<panel id="panel" pos="center" width="900px" padleft="8px">
		<name>Control Panel</name>
		<control type="container" width="500px" pos="left" padbottom="10px">
			<control type="textarea" class="output" binding="print" width="480px" height="200px"/>
			<control type="container">
				<control type="text" class="input" binding="debugInput" width="360px"/>
				<control type="button" class="input" binding="debugEnter">Enter</control>
				<control type="button" class="input" binding="clear">Clear</control>
			</control>
		</control>
	</panel>

See [/devices/pc/panel/default.xml](/devices/pc/panel/default.xml) for a more complete example.

Output
---
	<div id="..." class="pc-panel pc-component">
		<div class="pc-container">
			<div class="pcjs-panel" data-value="id:'...',name:'...'"></div>
		</div>
	</div>

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCjs Documentation](..)]

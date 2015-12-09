---
layout: page
title: PCjs &lt;machine&gt; Element
permalink: /docs/pcjs/machine/
---

PCjs Machine Component
---

Format
---
	<machine>...</machine>

Purpose
---
Container for a complete machine definition.

Machines are components that contain other components. See [Component](/docs/pcjs/component/) for more details.

Attributes
---
 * *class* (required)
 
	For PCjs machines, this must be set to "pcjs", indicating the machine belongs to PCjs.
	
 * Also supports the attributes of [Component](/docs/pcjs/component/). The *id* attribute is optional for a machine,
unless there is more than one machine on a page, in which case each machine must have a unique *id*.

Bindings
---
None.

Example
---
	<machine id="ibm5150" class="pcjs" width="740px" pos="center" border="1" style="background-color:#FAEBD7">...</machine>

Output
---
	<div id="..." class="pc-machine pc-component" style="">
		<div class="pc-container" style="">
			...
		</div>
	</div>

[Return to [PCjs Documentation](..)]

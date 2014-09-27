&lt;component&gt;
===

*Component* XML Specification
---

Format
---
	<component>...</component>

Purpose
---
Describes a machine component. It is transformed into an outer "component" &lt;div&gt; and an inner "container" &lt;div&gt;.
See **Output** details below.

Attributes
---
* *id* (optional)
	* ID of the component &lt;div&gt; that uniquely identifies the component on the page.
* *name* (optional)
	* User-friendly name to be displayed between the component &lt;div&gt; and container &lt;div&gt;.
* *class* (optional)
	* Class name for the component &lt;div&gt;.
* *width* (optional)
	* Width of the component &lt;div&gt;.
* *pos* (optional)
	* Positional value added to the style attribute of the component &lt;div&gt;. "left" is a shortcut for "float:left", "right" a shortcut for "float:right", and "center" a shortcut for "margin:0 auto".
* *border* (optional)
	* Border for the container &lt;div&gt;.
* *style* (optional)
	* Value(s), if any, used as-is for the container &lt;div&gt;.

Example
---
	<component id="ibm5150" class="pcjs" width="740px" pos="center" border="1">...</component>

Output
---
	<div id="..." class="pc-component">
		<div class="pc-container">
			...
		</div>
	</div>

[Return to [PCjs Documentation](..)]
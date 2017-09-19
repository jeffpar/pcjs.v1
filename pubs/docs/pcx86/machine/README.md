---
layout: page
title: PCx86 &lt;machine&gt; Element
permalink: /docs/pcx86/machine/
---

PCx86 Machine Component
-----------------------

Format
------

```xml
<machine>...</machine>
```

Purpose
-------

Container for a complete machine definition.

Machines are components that contain other components. See [Component](../component/) for more details.

Attributes
----------

 * *class* (required)
 
	For PCx86 machines, this must be set to "pcx86", indicating the machine belongs to the PCx86 application.
	
 * Also supports the attributes of [Component](../component/). The *id* attribute is optional for a machine,
unless there is more than one machine on a page, in which case each machine must have a unique *id*.

Bindings
--------

None.

Example
-------

```xml
<machine id="ibm5150" class="pcx86" width="740px" pos="center" border="1" style="background-color:#FAEBD7">...</machine>
```

Output
------

```html
<div id="..." class="pc-machine pc-component" style="">
    <div class="pc-container" style="">
        ...
    </div>
</div>
```

[Return to [PCx86 Documentation](..)]

---
layout: page
title: PCjs &lt;computer&gt; Element
permalink: /docs/pcjs/computer/
---

PCjs Computer Component
---

Format
---
```xml
<computer>...</computer>
```

Purpose
---
The Computer component is responsible for managing all the other components within the machine.

It waits for all components to become ready before "powering" them. It is also responsible for saving
and restoring the state of all components, if the machine's resume feature is enabled.

Attributes
---
* *resume* (optional)
	* 0: the resume feature is disabled
	* 1: the resume feature is enabled
	* 2: the resume feature is conditionally enabled (the user will be prompted)
* *state* (optional; default is '')
	* The name of a file containing the state of the entire machine.

A state file is loaded ONLY when the page is first loaded.	Once the state has been restored,
the contents of the state file are discarded.

States can be dumped using the Debugger's "dump" command and then copied/pasted into a file.
Don't use states from different machines/configurations, as that will produce unpredictable results.

WARNING: If you use BOTH the *resume* and *state* features in the same machine, the state file will
be loaded only on the FIRST page load; all subsequent page loads will resume from the last state saved.
To return to the original state, you must either disable the *resume* setting or use the "Reset" button. 

Bindings
---
 * *reset*

	For use with a control of type *button*, to reset the Computer. This binding is also available
	through the CPU component, for convenience.
	
 * *save*

	For use with a control of type *button*, to manually save the state of the Computer. State can optionally
	be saved to the server, if an approriate server key is provided.

Example
---
```xml
<computer id="pc" name="IBM PC"/>
```

Output
---
```html
<div id="..." class="pc-computer pc-component" style="">
    <div class="pc-container" style="">
        <div class="pcjs-computer" data-value="id:'...',name:'...',resume:'...',state:'...'">
        </div>
    </div>
</div>
```

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCjs Documentation](..)]

---
layout: page
title: PCx86 &lt;debugger&gt; Element
permalink: /docs/pcx86/debugger/
---

PCx86 Debugger Component
---

Format
---
```xml
<debugger>...</debugger>
```

Purpose
---
Creates an instance of the Debugger component.

Attributes
---
* *messages* (optional)
	* One or more message categories to enable, separated by |. By default, all message categories are disabled.
	See the Debugger's "m" command for a current list of message categories.

Also supports the attributes of *[Component](/docs/pcx86/component/)*. The *id* attribute is optional, since machines
currently support only one Debugger component.

Bindings
---
* *debugInput*
	* For use with a control of type *text*, to input Debugger commands.  Commands are submitted to the Debugger
	when either the **Enter** key is pressed or the *debugEnter* control (if any) is clicked.
* *debugEnter*
	* For use with a control of type *button*, to submit a new command to the Debugger (or resubmit the last command).
* *step*
	* For use with a control of type *button*, to step over the next instruction (assuming the CPU is currently halted).

Commands
---
Use the Debugger's built-in help for a list of commands.

Example
---
```xml
<debugger/>
```

Output
---
```html
<div id="..." class="pc-debugger pc-component" style="">
    <div class="pc-container" style="">
        <div class="pcx86-debugger" data-value="id:'...',name:'...',messages:'...'">
        </div>
    </div>
</div>
```

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCx86 Documentation](..)]

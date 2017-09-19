---
layout: page
title: PCx86 &lt;cpu&gt; Element
permalink: /docs/pcx86/cpu/
---

PCx86 CPU Component
-------------------

Format
------

```xml
<cpu>...</cpu>
```

Purpose
-------

Defines all the properties required for the CPU component to initialize, along with any optional CPU-related UI bindings.

Attributes
----------

* *model* (optional; default is 8088; supported values include: 8086, 8088, 80186, 80286, and 80386)
	* Defines the CPU model, adjusting the CPU's capabilities accordingly.
* *stepping* (optional; if specified, it should be a 2-character string, such as "A0" or "B1")
	* Defines the CPU stepping, adjusting the CPU's capabilities accordingly.
	* Currently supported only on the 80386 model.
* *cycles* (optional; default is 4772727)
	* Defines the simulated CPU speed in terms of cycles. The default is 4.77Mhz. The exact speed will vary, according
	to the whims of JavaScript, your web browser, and your machine's overall workload.
* *multiplier* (optional; default is 1)
	* Provides an easy way to multiply the default CPU speed.
* *autoStart* (optional)
	* This can be set to "true" or "false" to explicitly control whether or not the machine starts running automatically.
	If this parameter is omitted, the machine will autostart only if no Debugger component is included and no **Run** button is defined.

Also supports the attributes of *[Component](/docs/pcx86/component/)*. The *id* attribute is optional, since machines
currently support only one CPU component.

Bindings
--------

* *run*
	* For use with a control of type *button*, to start/stop the CPU.
* *reset*
	* For use with a control of type *button*, to reset the CPU. This binding actually belongs to the
	*[Computer](/docs/pcx86/computer/)* component, because every component is reset, but the CPU offers the binding
	for convenience.
* *speed*
	* For use with any control with an *textContent* property, to display the current CPU speed.
* *setSpeed*
	* For use with a control of type *button*, to increase the CPU speed.
* *AX*, *BX*, *CX*, *DX*, *SP*, *BP*, *SI*, *DI*, *CS*, *DS*, *SS*, *ES*, *PC*, *PS*, *C*, *P*, *A*, *Z*, *S*, *T*, *I*, *D*, *O*
	* For use with any control with an *textContent* property, to display the corresponding register's contents.

Example
-------

```xml
<cpu id="cpu8088" model="8088" autoStart="true">
    <control type="button" class="input" binding="run">Run</control>
</cpu>
```

Output
------

```html
<div id="..." class="pc-cpu pc-component" style="">
    <div class="pc-container" style="">
        <div class="pcx86-cpu" data-value="id:'...',name:'...',model:'...',cycles:'...',multiplier:'...',autoStart:'...'">
        </div>
    </div>
</div>
```

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCx86 Documentation](..)]

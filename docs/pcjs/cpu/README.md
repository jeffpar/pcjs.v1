&lt;cpu&gt;
===

PCjs *CPU* XML Specification
---

Format
---
	<cpu>...</cpu>

Purpose
---
Defines all the properties required for the CPU component to initialize, along with any optional CPU-related UI bindings.

Attributes
---
* *model* (optional; default is 8088)
	* Defines the CPU model, adjusting the CPU's capabilities accordingly.
* *cycles* (optional; default is 4772727)
	* Defines the simulated CPU speed in terms of cycles. The default is 4.77Mhz. The exact speed will vary, according
	to the whims of JavaScript, your web browser, and your machine's overall workload.
* *multiplier* (optional; default is 1)
	* Provides an easy way to multiply the default CPU speed.
* *autostart* (optional)
	* This can be set to "true" or "false" to explicitly control whether or not the machine starts running automatically.
	If this parameter is omitted, the machine will autostart only if no Debugger component is included and no "Run" button is defined.

Also supports the attributes of *[Component](/docs/pcjs/component/)*. The *id* attribute is optional, since machines
currently support only one CPU component.


Bindings
---
* *run*
	* For use with a control of type *button*, to start/stop the CPU.
* *reset*
	* For use with a control of type *button*, to reset the CPU. This binding actually belongs to the
	*[Computer](/docs/pcjs/computer/)* component, because every component is reset, but the CPU offers the binding
	for convenience.
* *speed*
	* For use with any control with an *innerHTML* property, to display the current CPU speed.
* *setSpeed*
	* For use with a control of type *button*, to increase the CPU speed.
* *AX*, *BX*, *CX*, *DX*, *SP*, *BP*, *SI*, *DI*, *CS*, *DS*, *SS*, *ES*, *PC*, *PS*, *C*, *P*, *A*, *Z*, *S*, *T*, *I*, *D*, *O*
	* For use with any control with an *innerHTML* property, to display the corresponding register's contents.

Example
---
	<cpu id="cpu8088" model="8088" autostart="true">
		<control type="button" class="input" binding="run">Run</control>
	</cpu>

Output
---
	<div id="..." class="pc-cpu pc-component" style="">
		<div class="pc-container" style="">
			<div class="pcjs-cpu" data-value="id:'...',name:'...',model:'...',cycles:'...',multiplier:'...',autostart:'...'">
			</div>
		</div>
	</div>

Also, if any controls are defined, another &lt;div&gt; of class="pc-controls" is created in the container &lt;div&gt;,
with each control inside a &lt;div&gt; of class="pc-control".

[Return to [PCjs Documentation](..)]
---
layout: page
title: PDP-10 KA10 Basic Instruction Diagnostic #10
permalink: /apps/pdp10/diags/klad/dakaj/
machines:
  - id: testka10
    type: pdp10
    config: /devices/pdp10/machine/ka10/test/debugger/machine.xml
    debugger: true
    commands: a DAKAJ.MAC
---

PDP-10 KA10 Basic Instruction Diagnostic #10
--------------------------------------------

The *PDP-10 KA10 Basic Instruction Diagnostic #10* (MAINDEC-10-DAKAJ) test code has been extracted from
[DAKAJM.MAC](DAKAJM.MAC.txt) [[original](http://pdp-10.trailing-edge.com/klad_sources/01/klad.sources/dakajm.mac.html)] and
[DAKAJT.MAC](DAKAJT.MAC.txt) [[original](http://pdp-10.trailing-edge.com/klad_sources/01/klad.sources/dakajt.mac.html)]
for use with the [PDP-10 Test Machine with Debugger](/devices/pdp10/machine/ka10/test/debugger/) below.

Resources for this test include:

- [Instructions](#dakajtxt)
- [History](#dakajhst)
- [Source Code](#dakajmac)
- [MACRO-10 Listing](DAKAJ.LST.txt)
- [Additional Information](http://archive.pcjs.org/apps/pdp10/diags/klad/dakaj/DAKAJ.SEQ.txt)

{% include machine.html id="testka10" %}

The Debugger's assemble ("a") command can be used to test the new built-in
[MACRO-10 Mini-Assembler](/modules/pdp10/lib/macro10.js), which supports a subset
of the [MACRO-10](http://archive.pcjs.org/pubs/dec/pdp10/tops10/02_1973AsmRef_macro.pdf) assembly language.
This command:

	a DAKAJ.MAC

will automatically read the [DAKAJ.MAC](DAKAJ.MAC.txt) source file (a slightly modified copy of [DAKAJM.MAC](DAKAJM.MAC.txt)),
assemble it, and then load the binary image at the location specified in the file.

---

DAKAJ.TXT
---------

```
```

DAKAJ.HST
---------


DAKAJ.MAC
---------

[[Download](DAKAJ.MAC.txt)]
 
{% highlight text %}
{% include_relative DAKAJ.MAC.txt %}
{% endhighlight %}

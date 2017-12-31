---
layout: page
title: Embedding The C1Pjs Simulator
permalink: /docs/c1pjs/embed/
machines:
  - id: c1p8kb
    type: c1p
    config: /devices/c1p/machine/8kb/embed/machine.xml
redirect_from:
  - /configs/c1p/embed/
  - /demos/c1p/embed.html
---

Embedding The C1Pjs Simulator
-----------------------------

{% include machine.html id="c1p8kb" %}

If you want to read as little as possible, then just paste the following code onto a web page:

```html
<div id="myC1P"/></div><div style="clear:both"></div>
<script type="text/javascript"
    src="http://www.pcjs.org/versions/c1pjs/1.37.0/c1p.js">
</script>
<script type="text/javascript">
    window.embedC1P(
        "myC1P",
        "http://www.pcjs.org/devices/c1p/machine/8kb/embed/machine.xml",
        "http://www.pcjs.org/versions/c1pjs/1.37.0/components.xsl"
    );
</script>
```

Otherwise, read on to learn how embedding works, and how you can create your own machine configuration and customize
its appearance.

Step 1: Create a machine definition XML file
--------------------------------------------

You need an XML file that defines a Challenger configuration, listing all the components it will contain and where
they will be mapped into the address space.

The order of the XML elements also determines the layout of the associated HTML elements; for example, if the
**&lt;keyboard&gt;** element appears before the **&lt;video&gt;** element, then the keyboard controls will be
displayed *above* the video display instead of *below*. There's an extensive set of attributes that you can add
to any of the elements below to style and position them, including the usual *style* attribute, but at present,
there's no documentation beyond the sample XML files and the default [XML stylesheet](/versions/c1pjs/1.37.0/components.xsl).

The example at the top of this page uses an [XML file](/devices/c1p/machine/8kb/embed/machine.xml) that looks like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<machine id="OSI" class="c1pjs" border="1" width="272px" pos="right" padleft="16px" padright="16px" padbottom="16px">
    <computer id="c1p" name="Challenger 1P">
        <module type="cpu" refid="cpu6502" start="0x0000" end="0xffff"/>
        <module type="ram" refid="ram8K" start="0x0000" end="0x1fff"/>
        <module type="rom" refid="romNull" start="0x2000" end="0x9fff"/>
        <module type="rom" refid="romBasic" start="0xa000" end="0xbfff"/>
        <module type="video" refid="video" start="0xd000" end="0xd3ff"/>
        <module type="keyboard" refid="keyboard" start="0xdf00" end="0xdfff"/>
        <module type="serial" refid="serialPort" start="0xf000" end="0xf0ff"/>
        <module type="rom" refid="romSystem" start="0xf800" end="0xffff"/>
    </computer>
    <cpu id="cpu6502"/>
    <ram id="ram8K" size="0x2000"/>
    <rom id="romNull" size="0x8000"/>
    <rom id="romBasic" size="0x2000" image="http://www.pcjs.org/devices/c1p/rom/basic-gcpatch.hex"/>
    <rom id="romSystem" size="0x0800" image="http://www.pcjs.org/devices/c1p/rom/system.hex"/>
    <video id="video" screenwidth="256" screenheight="192" cols="32" rows="32"
        charset="http://www.pcjs.org/devices/c1p/video/chargen1x.png" padtop="8px" padleft="8px" padbottom="8px"/>
    <keyboard id="keyboard" pos="center">
        <control type="button" class="input" binding="ctrl-c">CTRL-C</control>
        <control type="button" class="input" binding="ctrl-o">CTRL-O</control>
        <control type="button" class="input" binding="break">BREAK</control>
    </keyboard>
    <serial id="serialPort" demo="true"/>
</machine>
```

Machine configuration files can also be "self-starting" if they contain the following XML stylesheet reference at the
top of the file:

```xml
<?xml-stylesheet type="text/xsl" href="http://www.pcjs.org/versions/c1pjs/1.37.0/machine.xsl"?>
```

For example, here's a self-starting [machine.xml](/devices/c1p/machine/8kb/large/machine.xml) configuration.
After it loads, use your browser's "View Source" command and you'll see that it's very similar to the
[XML example](/devices/c1p/machine/8kb/embed/machine.xml) above.

Want to embed *multiple* simulators on a single page? No problem. Each **&lt;machine&gt;** element simply needs
a unique *id* attribute. Take a look at [array.xml](/devices/c1p/machine/8kb/array/) for an example.

Step 2: Make sure you have all the necessary resource files
-----------------------------------------------------------

In the above XML file, the ROM and Video components refer to additional resources:

- 8K BASIC ROM image @ http://www.pcjs.org/devices/c1p/rom/basic-gcpatch.hex
- 2K SYSTEM ROM image @ http://www.pcjs.org/devices/c1p/rom/system.hex
- 256-Character Generator image @ http://www.pcjs.org/devices/c1p/video/chargen1x.png

The URLs for those resource files can omit the server name if they're on the same server as the web page.
The simulator will not start running until all the above resources have been loaded. Other resources, such as files
or disk images listed by the &lt;serial&gt; or &lt;disk&gt; components, are not loaded until/unless they are selected.

NOTE: For larger simulator windows (eg, screenwidth of 512 and screenheight of 384), use a larger image file for the charset attribute; the smaller image file will work as well, but in the process of being enlarged, it won't look as sharp.

If you decide to include the &lt;disk&gt; component, you can simply link to an existing component definition XML file,
such as samples.xml:

```xml
<machine id="OSI" border="1" width="272px">
    <computer id="c1p" name="Challenger 1P">
        ...
        <module type="ram" refid="ram32K" start="0x0000" end="0x7fff"/>
        <module type="rom" refid="romNull" start="0x8000" end="0x9fff"/>
        <module type="rom" refid="romBasic" start="0xa000" end="0xbfff"/>
        <module type="disk" refid="disk" start="0xc000" end="0xc0ff"/>
        <module type="video" refid="video" start="0xd000" end="0xd7ff"/>
        ...
    </computer>
    ...
    <disk ref="http://www.pcjs.org/apps/c1p/samples.xml"/>
    ...
</machine>
```

Step 3: Add the C1Pjs Simulator to your web page
------------------------------------------------

Somewhere on your page, you need to add the following **&lt;script&gt;** element:

```html
<script type="text/javascript" src="http://www.pcjs.org/versions/c1pjs/1.37.0/c1p.js"></script>
```

To include the C1Pjs Debugger, use [c1p-dbg.js](/versions/c1pjs/1.37.0/c1p-dbg.js) instead of
[c1p.js](/versions/c1pjs/1.37.0/c1p.js), and include some additional definitions in your machine
definition XML file:

```xml
<machine id="OSI" border="1" width="272px">
    <computer id="c1p" name="Challenger 1P">
        ...
    </computer>
    ...
    <debugger id="debugger"/>
    <panel ref="http://www.pcjs.org/devices/c1p/panel/default.xml"/>
    ...
</machine>
```

The [Panel](/devices/c1p/panel/default.xml) XML file included above defines a variety of buttons and
input/output controls that are bound to the CPU and Debugger components according to their *binding*
attributes.

You can also create your own XML file that defines a completely different Control Panel layout, and either
paste it into your machine definition file, inside a pair of **&lt;panel *id*="panel"...&gt;** ... **&lt;/panel&gt;**
elements, or link to it using a single **&lt;panel/&gt;** element with the *ref* attribute.

Step 4: Activate the C1Pjs Simulator
------------------------------------

Add the following to your page's **&lt;body&gt;** element:

```html
<body onload="window.embedC1P('myC1P','embed.xml')">
```

and insert a **&lt;div id="myC1P"&gt;&lt;/div&gt;** where you want the simulator to appear.

The **embedC1P()** function accepts three parameters:
- the *id* attribute of the HTML element that will contain the simulator (eg, 'myC1P');
- the URL of your machine definition XML file (eg, 'embed.xml', since it's on the same server);
- the URL of an XML stylesheet; unless you've created your own stylesheet, it's recommended you omit this
parameter and use the default [XML stylesheet](/versions/c1pjs/1.37.0/components.xsl).

Step 5: Enjoy!
--------------

All I ask is that any page that embeds the simulator also includes attribution, such as: 

> [PCjs](http://pcjs.org) © 2012-2018 by [Jeff Parsons](mailto:Jeff@pcjs.org) ([@jeffpar](http://twitter.com/jeffpar))

If you use the default [XML stylesheet](/versions/c1pjs/1.37.0/components.xsl), attribution is automatically inserted,
which relieves you from including it yourself.

Feel free to copy any or all of the files listed above to your own server (it's probably better to share the server
load, after all). Just be aware that none of these files have been frozen -- there are more features to add and
probably still a few bugs waiting to be fixed. The advantage of copying them is that you might avoid regressions down
the road, but the disadvantage is that you'll miss out on any changes, unless you check back periodically.

Problems? Something I neglected to explain? Features you'd like to see added, or better yet, add yourself? You can
reach me at either [@jeffpar](http://twitter.com/jeffpar) or [Jeff@pcjs.org](mailto:Jeff@pcjs.org).

Thanks!

*Jeff Parsons<br/>August 28, 2012*

[Return to [C1Pjs Documentation](../)]

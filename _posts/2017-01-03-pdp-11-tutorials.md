---
layout: post
title: PDP-11 Tutorials
date: 2017-01-03 15:00:00
permalink: /blog/2017/01/03/
machines:
  - id: test1170
    type: pdp11
    debugger: true
    config: /devices/pdp11/machine/1170/vt100/debugger/machine.xml
    connection: dl11->vt100.serialPort
  - id: vt100
    type: pc8080
    config: /devices/pc8080/machine/vt100/machine.xml
    connection: serialPort->test1170.dl11
    sticky: top
---

Introducing PDP-11 tutorials.  For more information, keep scrolling.

{% include machine.html id="vt100" %}

[PDPjs](/devices/pdp11/machine/) is able to run a variety of old DEC operating systems, such as RT-11 and RSTS/E,
and while there are manuals available online, thanks to the efforts of those who operate and contribute to websites
like [bitsavers.org](http://bitsavers.org), I suspect most people don't have a lot of interest or time to spend
reading old manuals.

In an effort to remedy that situation, I'm adding some new features to PCjs.  The first feature is what I call
"Sticky Machines", and it's more a website feature than a machine feature.  At the top of any PCjs webpage, in the
*machines* section, a machine can now have a *sticky* property.  For now, the only supported value is "top"; e.g.:

	machines:
	  - id: vt100
		type: pc8080
		config: /devices/pc8080/machine/vt100/machine.xml
		connection: serialPort->test1170.dl11
		sticky: top

A sticky machine makes it easier to construct a tutorial page for a single machine, by preventing that machine from
scrolling off the top of the page; it "sticks" to the top instead.  The rest of the page scrolls normally, allowing the
user to progress at their own pace through the text and/or images of an accompanying tutorial.

The second feature is a generalized method for sending commands to components within a machine.  For example, if we
want to send some keyboard commands to machine:

{% raw %}
	{% include machine-command.html type='button' label='Try It!' machine='vt100' component='Keyboard' command='sendString' value='Hello World' %}
{% endraw %}

which should translate into a control that looks like:

	<button type="button" onclick="commandMachine('vt100','Keyboard','sendString','Hello World')">Try It!</button>

In fact, let's try it now. {% include machine-command.html type='button' label='Try It!' machine='vt100' component='Keyboard' command='sendString' value='Hello World' %}

Obviously, every component we want to control will need to be updated to export the necessary functions.

{% include machine.html id="test1170" %}

*[@jeffpar](http://twitter.com/jeffpar)*  
*Jan 3, 2017*

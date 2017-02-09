---
layout: page
title: IBM PC Keyboard Devices
permalink: /devices/pcx86/keyboard/
---

IBM PC Keyboard Devices
---

### Keyboard Configuration Files

The easiest way for a machine to add a *[Keyboard](/docs/pcx86/keyboard/)* component to its XML configuration file
is to use one of the project's predefined configuration files, with the *ref* attribute; e.g.:

```xml
<keyboard ref="/devices/pcx86/keyboard/us83-buttons-minimal.xml"/>
```

The referenced XML file automatically defines the keyboard's hardware characteristics (eg, model) and
any visual elements, such as buttons to simulate common keystrokes, or even complete "soft keyboard" layouts. 

Here's what *us83-buttons-minimal.xml* currently looks like:

```xml
<keyboard id="keyboard" model="us83" pos="left" padleft="8px" padbottom="8px">
    <control type="button" binding="esc">ESC</control>
    <control type="button" binding="f1">F1</control>
    <control type="button" binding="f10">F10</control>
</keyboard>
```

The following IBM keyboard configuration files are currently available:

- [us83-buttons-arrows.xml](us83-buttons-arrows.xml)
- [us83-buttons-functions.xml](us83-buttons-functions.xml)
- [us83-buttons-minimal.xml](us83-buttons-minimal.xml)
- [us83-softkeys.xml](us83-softkeys.xml)
- [us84-buttons-arrows.xml](us84-buttons-arrows.xml)
- [us84-buttons-functions.xml](us84-buttons-functions.xml)

### 8042 Keyboard Controller Internals

The following documents were obtained from [halicery.com](http://halicery.com/):

- [8042_INTERN.TXT](8042_INTERN.TXT)
- [8042_1503033.TXT](8042_1503033.TXT)
- [dasm42.c](dasm42.c)

Additional information (eg, undocumented 8042 commands) is also available from [OS/2 Museum](http://www.os2museum.com/wp/?p=589).

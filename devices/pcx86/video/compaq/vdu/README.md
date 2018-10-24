---
layout: page
title: COMPAQ Video Display Controller (VDU)
permalink: /devices/pcx86/video/compaq/vdu/
---

COMPAQ Video Display Controller (VDU)
-------------------------------------

### COMPAQ VDU Configurations

The easiest way for a machine to include a VDU *[Video](/docs/pcx86/video/)* component in its XML configuration file
is to reference one of the project's predefined VDU configuration files, using the *ref* attribute; eg:

```xml
<video ref="/devices/pcx86/video/compaq/vdu/compaq-vdu.xml"/>
```

The referenced XML file automatically defines visual elements (eg, dimensions of the display window and other
visual indicators), display behaviors (eg, touchscreen support, mouse pointer locking), and the character ROM to load. 

Here's what *compaq-vdu.xml* currently looks like:

```xml
<video id="videoMDA" screenWidth="1440" screenHeight="900" fontROM="/devices/pcx86/video/ibm/mda/ibm-mda.json" pos="center" padding="8px">
    <menu>
        <title>Monochrome Display</title>
        <control type="container" pos="right">
            <control type="led" label="Caps" binding="caps-lock" padleft="8px"/>
            <control type="led" label="Num" binding="num-lock" padleft="8px"/>
            <control type="led" label="Scroll" binding="scroll-lock" padleft="8px"/>
        </control>
    </menu>
</video>
```

The following COMPAQ VDU configuration files are currently available:

- [compaq-vdu.xml](compaq-vdu.xml)

Until we can dump an original COMPAQ VDU character ROM, our configurations are using the [IBM MDA Character ROM](../../ibm/mda/#ibm-mda-character-rom).

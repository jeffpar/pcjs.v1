---
layout: page
title: 8080-Based RAM Images
permalink: /devices/pc8080/ram/
---

8080-Based RAM Images
---------------------

RAM images are added to machines by including a *<ram>* component in the machine XML configuration file
with the *file* attribute set to the filename of the image; eg:

```xml
<ram id="romH" addr="0x0000" size="0x0800" file="/devices/pc8080/rom/invaders/INVADERS-H.json"/>
```

The project currently contains the following 8080-based ROMs:

* [8080 Exerciser Tests](exerciser/)
* [Space Invaders (1978)](invaders/)
* [DEC VT100 Terminal](vt100/)

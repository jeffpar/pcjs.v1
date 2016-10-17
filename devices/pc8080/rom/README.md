---
layout: page
title: 8080-Based ROM Images
permalink: /devices/pc8080/rom/
---

8080-Based ROM Images
---------------------

ROMs are added to machines by including one `<rom>` component in the machine XML configuration file
for each ROM in the machine; eg:

```xml
<rom id="romH" addr="0x0000" size="0x0800" file="/devices/pc8080/rom/invaders/INVADERS-H.json"/>
```

The project currently contains the following 8080-based ROM images:

* [Space Invaders (1978)](invaders/)
* [DEC VT100 Terminal](vt100/)

---
layout: page
title: 8080-Based RAM Images
permalink: /devices/pc8080/ram/
---

8080-Based RAM Images
---------------------

RAM images are added to machines by including a `<ram>` component in the machine XML configuration file
with the *file* attribute set to the filename of the image, along with optional *load* and *exec* addresses; eg:

```xml
<ram id="ram64K" addr="0x0000" size="0x10000" file="/devices/pc8080/ram/exerciser/8080EX1.json" load="0x100" exec="0x100"/>
```

If no *load* address is specified, the `<ram>` component relies on the "load" property of the JSON-encoded RAM image;
otherwise, the starting RAM address is used.  If no *exec* address is specified, the CPU will begin execution at its usual
reset address.

The project currently contains the following 8080-based RAM images:

* [8080 Exerciser Tests](exerciser/)

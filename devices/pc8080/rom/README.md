---
layout: page
title: 8080-Based ROMs
permalink: /devices/pc8080/rom/
---

8080-Based ROMs
---

ROMs are added to machines by including one *[ROM](/docs/pcx86/rom/)* component in the machine XML configuration file
for each ROM in the machine; eg:

	<rom id="romH" addr="0x0000" size="0x0800" file="/devices/pc8080/rom/invaders/INVADERS-H.json"/>

The project currently contains the following 8080-based ROMs:

 * [Space Invaders (1978)](invaders/)
 * [8080 Exerciser Tests](exerciser/)

---
layout: page
title: PC11 High-Speed Paper Tape Reader/Punch
permalink: /devices/pdp11/pc11/
---

PC11 High-Speed Paper Tape Reader/Punch
---------------------------------------

PDPjs implements the PC11 component in [pc11.js](/modules/pdp11/lib/pc11.js). 

Paper Tape configurations include:

- [Demo](demo.xml)

which are typically instantiated by a Machine XML file using:

	<device ref="/devices/pdp11/pc11/demo.xml"/>
		
The above configurations are used by machines such as:

- [PDP-11/20 with 16Kb and Bootstrap Loader](/devices/pdp11/machine/1120/bootstrap/) ([Debugger](/devices/pdp11/machine/1120/bootstrap/debugger/))
- [PDP-11/20 with 16Kb and DEC BASIC](/devices/pdp11/machine/1120/basic/) ([Debugger](/devices/pdp11/machine/1120/basic/debugger/))

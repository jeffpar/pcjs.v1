---
layout: page
title: DEC PDP-11 Tape Images
permalink: /apps/pdp11/tapes/
---

DEC PDP-11 Tape Images
----------------------

We have archived the following DEC PDP-11 Tapes:

- [Absolute Loader](absloader/)
- [BASIC (Single User)](basic/)

To make it easy for PDPjs machines to load these tapes, we created the following High-Speed
Paper Tape Reader (PC11) configurations:

- [demo.xml](/devices/pdp11/pc11/demo.xml)

which is typically instantiated by a Machine XML file using:

	<device ref="/devices/pdp11/pc11/demo.xml"/>
		
These configuration files create UI controls that allow you to choose from a set of tapes that are automatically sent
to the machine's PC11 device.

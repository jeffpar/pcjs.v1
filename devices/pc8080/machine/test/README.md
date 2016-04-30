---
layout: page
title: 8080 Test Machine
permalink: /devices/pc8080/machine/test/
machines:
  - type: pc8080
    id: test8080
    debugger: true
---

8080 Test Machine
---

This is a test of [PC8080](/modules/pc8080/), a new 8080-based machine emulator being added to the
PCjs Project.

This test machine loads a copy of the
[8080 Exerciser](https://web.archive.org/web/20151006085348/http://www.idb.me.uk/sunhillow/8080.html)
(specifically, [8080EX1](/devices/pc8080/rom/test/8080EX1.MAC)) and intercepts *just* enough of the exerciser's
CP/M calls to display its progress.

The good news: PC8080 passes all the 8080 Exerciser tests.  At 2Mhz, the tests do take quite a while,
but you can click the speed button while the machine is running to increase the simulated speed; it will
wrap around to 2Mhz if you try to exceed the maximum speed that your system supports.

NOTE: The original [8080 Exerciser website](http://www.idb.me.uk/sunhillow/8080.html) is currently unavailable,
so we refer you to the copy on
[archive.org](https://web.archive.org/web/20151006085348/http://www.idb.me.uk/sunhillow/8080.html).
The 8080 Exerciser has also been "forked" on [GitHub](https://github.com/begoon/8080ex1).

{% include machine.html id="test8080" %}

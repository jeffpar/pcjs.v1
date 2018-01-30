---
layout: page
title: "Castle Adventure (1985)"
permalink: /apps/pcx86/1985/castle_adventure/
machines:
  - id: ibm5160-castle-adventure
    type: pcx86
    resume: 1
    config: /devices/pcx86/machine/5160/cga/640kb/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/dos/ibm/2.00/PCDOS200-DISK1.json
      B:
        path: /apps/pcx86/1985/castle_adventure/CASTLE-ADVENTURE-1985.json
    autoType: $date\r$time\rb:\rcastle\r
---

Castle Adventure (1985)
-----------------------

From [MobyGames](http://www.mobygames.com/game/dos/castle-adventure):

> This game is like a cross between a Kroz game and a text adventure -- the player moves through a castle using the arrow keys, picking up equipment and battling monsters in real-time along the way; however, at any time, it is also possible to type simple commands into the game's text parser, allowing a greater variety of actions and more complex solutions to problems. The object of the game is to escape from the 83-room castle while collecting as many of the thirteen available treasures as possible.

For more classic PC software experiences, see the PCjs collection of [IBM PC Application Demos](/apps/pcx86/).

{% include machine.html id="ibm5160-castle-adventure" %}

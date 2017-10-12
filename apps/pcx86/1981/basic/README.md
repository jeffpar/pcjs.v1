---
layout: page
title: "PC-DOS 1.00 BASIC Samples"
permalink: /apps/pcx86/1981/basic/
machines:
  - id: ibm5150
    type: pcx86
    config: /devices/pcx86/machine/5150/cga/64kb/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/dos/ibm/1.00/PCDOS100.json
      B:
        name: None
    autoType: $date\r
---

PC-DOS 1.00 BASIC Samples
-------------------------

Using the PCx86 machine below, all the BASIC samples distributed with PC-DOS 1.00 were captured and saved here.

The procedure is simple.  For example, to capture [MUSIC.BAS](#musicbas):

- Run `BASIC` from the DOS prompt
- Type `LOAD "MUSIC"`
- Type `LIST ,"COM1"`

The `LIST` command is used to list all or part of a program on the screen, by including either a single line number
(e.g., `LIST 940`), a range of line numbers (e.g., `LIST 940-960`), or no numbers at all.  And if you want the listing
sent to a different output device, you must append a comma and the name of the device, in quotes.  Since this machine
has been configured with one serial port (COM1) bound to the text window inside the machine's Control Panel,
specifying "COM1" redirects the program listing to that window.  One parallel port has been added to the machine and
bound to the same window as well, so you can also use "LPT1".

Except for the [Music Samples](#music-samples), IBM stored all the BASIC files on the PC-DOS 1.00 diskette as *BINARY*
files, to reduce their size; otherwise, one or more of the samples would have had to be removed, since there wasn't
enough space on a single-sided 160Kb diskette.

NOTE: To save a BASIC program as an *ASCII* file, save it with the `A` option; e.g.:

	SAVE "MUSIC",A

{% include machine.html id="ibm5150" %}

### ART.BAS

[[Download](ART.BAS)]

{% highlight basic %}
{% include_relative ART.BAS %}
{% endhighlight %}

### BALL.BAS

[[Download](BALL.BAS)]

{% highlight basic %}
{% include_relative BALL.BAS %}
{% endhighlight %}

### CALENDAR.BAS

[[Download](CALENDAR.BAS)]

{% highlight basic %}
{% include_relative CALENDAR.BAS %}
{% endhighlight %}

### CIRCLE.BAS

[[Download](CIRCLE.BAS)]

{% highlight basic %}
{% include_relative CIRCLE.BAS %}
{% endhighlight %}

### COMM.BAS

[[Download](COMM.BAS)]

{% highlight basic %}
{% include_relative COMM.BAS %}
{% endhighlight %}

### DONKEY.BAS

[[Download](DONKEY.BAS)]

{% highlight basic %}
{% include_relative DONKEY.BAS %}
{% endhighlight %}

### MORTGAGE.BAS

[[Download](MORTGAGE.BAS)]

{% highlight basic %}
{% include_relative MORTGAGE.BAS %}
{% endhighlight %}

### MUSIC.BAS

[[Download](MUSIC.BAS)]

{% highlight basic %}
{% include_relative MUSIC.BAS %}
{% endhighlight %}

### PIECHART.BAS

[[Download](PIECHART.BAS)]

{% highlight basic %}
{% include_relative PIECHART.BAS %}
{% endhighlight %}

### SAMPLES.BAS

[[Download](SAMPLES.BAS)]

{% highlight basic %}
{% include_relative SAMPLES.BAS %}
{% endhighlight %}

### SPACE.BAS

[[Download](SPACE.BAS)]

{% highlight basic %}
{% include_relative SPACE.BAS %}
{% endhighlight %}

---

### MUSIC Samples

The rest of the BASIC Samples are not stand-alone programs; they are collections of *DATA* statements loaded
by [MUSIC.BAS](#musicbas) using the *CHAIN* command.

#### BLUE.BAS

[[Download](BLUE.BAS)]

{% highlight basic %}
{% include_relative BLUE.BAS %}
{% endhighlight %}

#### BUG.BAS

[[Download](BUG.BAS)]

{% highlight basic %}
{% include_relative BUG.BAS %}
{% endhighlight %}

#### DANDY.BAS

[[Download](DANDY.BAS)]

{% highlight basic %}
{% include_relative DANDY.BAS %}
{% endhighlight %}

#### FORTY.BAS

[[Download](FORTY.BAS)]

{% highlight basic %}
{% include_relative FORTY.BAS %}
{% endhighlight %}

#### HAT.BAS

[[Download](HAT.BAS)]

{% highlight basic %}
{% include_relative HAT.BAS %}
{% endhighlight %}

#### HUMOR.BAS

[[Download](HUMOR.BAS)]

{% highlight basic %}
{% include_relative HUMOR.BAS %}
{% endhighlight %}

#### MARCH.BAS

[[Download](MARCH.BAS)]

{% highlight basic %}
{% include_relative MARCH.BAS %}
{% endhighlight %}

#### POP.BAS

[[Download](POP.BAS)]

{% highlight basic %}
{% include_relative POP.BAS %}
{% endhighlight %}

#### SAKURA.BAS

[[Download](SAKURA.BAS)]

{% highlight basic %}
{% include_relative SAKURA.BAS %}
{% endhighlight %}

#### SCALES.BAS

[[Download](SCALES.BAS)]

{% highlight basic %}
{% include_relative SCALES.BAS %}
{% endhighlight %}

#### STARS.BAS

[[Download](STARS.BAS)]

{% highlight basic %}
{% include_relative STARS.BAS %}
{% endhighlight %}

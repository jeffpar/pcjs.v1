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

Using the PCx86 machine below, all the BASIC samples distributed with PC-DOS 1.00 were captured and saved in
this folder.

The procedure is simple.  For example, here's how to capture [MUSIC.BAS](#musicbas):

- Run `BASIC` from the DOS prompt
- Type `LOAD "MUSIC"`
- Type `LIST ,"COM1"`

Since the machine's COM1 serial port is bound to the text window inside the machine's Control Panel, the program
listing should appear in that window.

{% include machine.html id="ibm5150" %}

### ART.BAS

{% highlight basic %}
{% include_relative ART.BAS %}
{% endhighlight %}

### BALL.BAS

{% highlight basic %}
{% include_relative BALL.BAS %}
{% endhighlight %}

### CALENDAR.BAS

{% highlight basic %}
{% include_relative CALENDAR.BAS %}
{% endhighlight %}

### CIRCLE.BAS

{% highlight basic %}
{% include_relative CIRCLE.BAS %}
{% endhighlight %}

### COMM.BAS

{% highlight basic %}
{% include_relative COMM.BAS %}
{% endhighlight %}

### DONKEY.BAS

{% highlight basic %}
{% include_relative DONKEY.BAS %}
{% endhighlight %}

### MORTGAGE.BAS

{% highlight basic %}
{% include_relative MORTGAGE.BAS %}
{% endhighlight %}

### MUSIC.BAS

{% highlight basic %}
{% include_relative MUSIC.BAS %}
{% endhighlight %}

### PIECHART.BAS

{% highlight basic %}
{% include_relative PIECHART.BAS %}
{% endhighlight %}

### SAMPLES.BAS

{% highlight basic %}
{% include_relative SAMPLES.BAS %}
{% endhighlight %}

### SPACE.BAS

{% highlight basic %}
{% include_relative SPACE.BAS %}
{% endhighlight %}

---

### MUSIC Samples

The rest of the BASIC Samples are not stand-alone programs; they are collections of *DATA* statements loaded
by [MUSIC.BAS](#musicbas) using the *CHAIN* command.

#### BLUE.BAS

{% highlight basic %}
{% include_relative BLUE.BAS %}
{% endhighlight %}

#### BUG.BAS

{% highlight basic %}
{% include_relative BUG.BAS %}
{% endhighlight %}

#### DANDY.BAS

{% highlight basic %}
{% include_relative DANDY.BAS %}
{% endhighlight %}

#### FORTY.BAS

{% highlight basic %}
{% include_relative FORTY.BAS %}
{% endhighlight %}

#### HAT.BAS

{% highlight basic %}
{% include_relative HAT.BAS %}
{% endhighlight %}

#### HUMOR.BAS

{% highlight basic %}
{% include_relative HUMOR.BAS %}
{% endhighlight %}

#### MARCH.BAS

{% highlight basic %}
{% include_relative MARCH.BAS %}
{% endhighlight %}

#### POP.BAS

{% highlight basic %}
{% include_relative POP.BAS %}
{% endhighlight %}

#### SAKURA.BAS

{% highlight basic %}
{% include_relative SAKURA.BAS %}
{% endhighlight %}

#### SCALES.BAS

{% highlight basic %}
{% include_relative SCALES.BAS %}
{% endhighlight %}

#### STARS.BAS

{% highlight basic %}
{% include_relative STARS.BAS %}
{% endhighlight %}

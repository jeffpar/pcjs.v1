---
layout: page
title: '"Lite-Brite" LED Simulation'
permalink: /devices/leds/litebrite/
machines:
  - id: lbDemo
    type: leds
    name: Lite-Brite Demo
    config: |
      {
        "lbDemo": {
          "class": "Machine",
          "type": "leds",
          "name": "Lite-Brite Demo",
          "version": 1.10,
          "autoStart": false,
          "bindings": {
            "clear": "clearLB",
            "print": "printLB"
          },
          "overrides": ["autoStart"]
        },
        "lbChip": {
          "class": "Chip",
          "rule": "A4",
          "toggleColor": true,
          "bindings": {
            "colorPalette": "colorPaletteLB",
            "colorSelection": "colorSelectionLB",
            "colorSwatch1": "colorSwatchLB1",
            "colorSwatch2": "colorSwatchLB2",
            "colorSwatch3": "colorSwatchLB3",
            "colorSwatch4": "colorSwatchLB4",
            "colorSwatch5": "colorSwatchLB5",
            "colorSwatch6": "colorSwatchLB6",
            "colorSwatch7": "colorSwatchLB7",
            "colorSwatch8": "colorSwatchLB8",
            "countInit": "countInit",
            "countOn": "countOn",
            "countOff": "countOff",
            "countCycle": "countCycle",
            "backgroundImage": "backgroundImage",
            "saveToURL": "saveLB"
          },
          "colors": {
            "Original": {
              "Blue":   "#3067c1",
              "Green":  "#2f9a27",
              "Violet": "#9f3c92",
              "Red":    "#ff0000",
              "Orange": "#fa7d14",
              "Pink":   "#ff1493",
              "Yellow": "#fadc4e",
              "White":  "#fffff9"
            }
          },
          "overrides": ["blue","green","violet","red","orange","pink","yellow","white","wrap","backgroundImage","pattern"]
        },
        "lbClock": {
          "class": "Time",
          "cyclesPerSecond": 1,
          "cyclesMinimum": 1,
          "cyclesMaximum": 120,
          "bindings": {
            "run": "runLB",
            "speed": "speedLB",
            "step": "stepLB",
            "throttle": "throttleLB"
          },
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate","cyclesMinimum","cyclesMaximum","requestAnimationFrame"]
        },
        "lbDisplay": {
          "class": "LED",
          "type": 1,
          "cols": 45,
          "rows": 39,
          "backgroundColor": "black",
          "hexagonal": true,
          "highlight": false,
          "bindings": {
            "container": "displayLB"
          },
          "overrides": ["color","backgroundColor"]
        },
        "lbInput": {
          "class": "Input",
          "drag": true,
          "bindings": {
            "reset": "resetLB"
          }
        }
      }
styles:
  lbDemo:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  displayLB:
    position: relative;
    line-height: 0;
    margin-bottom: 8px;
    background-color: rgb(26,26,26);
    background-image: none;
    background-size: 100% 100%;
    -webkit-tap-highlight-color: transparent;
  .colorSwatchLB:
    display: none;
    width: 16px;
    height: 16px;
    border: 1px solid;
    border-radius: 50%;
    vertical-align: middle;
    background-color: green;
  diagsLB:
    float: left;
  printLB:
    font-family: Monaco,"Lucida Console",monospace;
---

"Lite-Brite" LED Simulation
---------------------------

The [Lite-Brite](https://en.wikipedia.org/wiki/Lite-Brite) concept was invented by Joseph M. Burck at
[Marvin Glass & Associates](https://en.wikipedia.org/wiki/Marvin_Glass_and_Associates) and first marketed as a toy
in 1967 by [Hasbro](https://en.wikipedia.org/wiki/Hasbro).

The original Lite-Brite design used a pair of matching black panels punctured with a series of evenly spaced holes
arranged in a grid of 39 rows, which alternated between 44 and 45 holes per row, resulting in a hexagonal ("honeycomb")
layout containing 1735 holes.  A piece of black paper containing a pre-printed pattern would be sandwiched between
the panels, and then your job was to insert any of the (blue, green, violet, red, orange, pink, yellow, or white)
colored pegs into the appropriately marked holes.

This simulation takes the "Lite-Brite" concept a bit farther, allowing you to add counters to each of the colored LEDs,
making it possible to create a variety of "blinking" and "color-cycling" animations.

Some of the original background images can also be turned on underneath the grid, to help you recreate them
with LEDs.  However, it's difficult to find decent high-quality images of the original 1967 patterns, and tricky to
get them to line up properly, so some "artistic interpretation" is required.

Eventually, we'll also add recreations of some of the original black-and-white pattern images, using the original
Lite-Brite color codes: B, G, V, R, O, P, Y, and W.

{% include machine.html id="lbDemo" config="json" %}

<div id="lbDemo">
  <div id="displayLB"></div>
  <select id="colorPaletteLB"></select>&nbsp;<select id="colorSelectionLB"></select>
  <div id="colorSwatchLB1" class="colorSwatchLB"></div>
  <div id="colorSwatchLB2" class="colorSwatchLB"></div>
  <div id="colorSwatchLB3" class="colorSwatchLB"></div>
  <div id="colorSwatchLB4" class="colorSwatchLB"></div>
  <div id="colorSwatchLB5" class="colorSwatchLB"></div>
  <div id="colorSwatchLB6" class="colorSwatchLB"></div>
  <div id="colorSwatchLB7" class="colorSwatchLB"></div>
  <div id="colorSwatchLB8" class="colorSwatchLB"></div>
  <select id="countInit">
    <option value="0" selected="selected">Start at 0</option>
    <option value="1">Start at 1</option>
    <option value="2">Start at 2</option>
    <option value="3">Start at 3</option>
    <option value="4">Start at 4</option>
    <option value="5">Start at 5</option>
    <option value="6">Start at 6</option>
    <option value="7">Start at 7</option>
  </select>
  <select id="countOn">
    <option value="0">On for 0</option>
    <option value="1" selected="selected">On for 1</option>
    <option value="2">On for 2</option>
    <option value="3">On for 3</option>
    <option value="4">On for 4</option>
    <option value="5">On for 5</option>
    <option value="6">On for 6</option>
    <option value="7">On for 7</option>
  </select>
  <select id="countOff">
    <option value="0" selected="selected">Off for 0</option>
    <option value="1">Off for 1</option>
    <option value="2">Off for 2</option>
    <option value="3">Off for 3</option>
    <option value="4">Off for 4</option>
    <option value="5">Off for 5</option>
    <option value="6">Off for 6</option>
    <option value="7">Off for 7</option>
  </select>
  <select id="countCycle">
    <option value="0" selected="selected">Cycle by 0</option>
    <option value="1">Cycle by 1</option>
    <option value="2">Cycle by 2</option>
    <option value="3">Cycle by 3</option>
    <option value="4">Cycle by 4</option>
    <option value="5">Cycle by 5</option>
    <option value="6">Cycle by 6</option>
    <option value="7">Cycle by 7</option>
  </select>
  <select id="backgroundImage">
    <option value="" selected="selected">No Image</option>
    <option value="images/American_Eagle.png">American Eagle</option>
    <option value="images/American_Flag.png">American Flag</option>
    <option value="images/Antique_Auto.png">Antique Auto</option>
    <option value="images/Barnyard_Scene.png">Barnyard Scene</option>
    <option value="images/Basketball_Player.png">Basketball Player</option>
    <option value="images/Bird_of_Paradise.png">Bird of Paradise</option>
    <option value="images/Boy_and_Girl.png">Boy and Girl</option>
    <option value="images/Butterflies.png">Butterflies</option>
    <option value="images/Cat_on_Fence.png">Cat on Fence</option>
    <option value="images/Chicken.png">Chicken</option>
    <option value="images/Choo-Choo_Train.png">Choo-Choo Train</option>
    <option value="images/Christmas_Tree.png">Christmas Tree</option>
    <option value="images/Clown.png">Clown</option>
    <option value="images/Cowboy_and_Indian.png">Cowboy and Indian</option>
    <option value="images/Dancing_Ballerina.png">Dancing Ballerina</option>
    <option value="images/Ducks.png">Ducks</option>
    <option value="images/Flower_Garden.png">Flower Garden</option>
    <option value="images/Fruit_Bowl.png">Fruit Bowl</option>
    <option value="images/Girl_in_the_Rain.png">Girl in the Rain</option>
    <option value="images/House_and_Light.png">House and Light</option>
    <option value="images/Indian_Chief.png">Indian Chief</option>
    <option value="images/Jack_be_Nimble.png">Jack be Nimble</option>
    <option value="images/Jungle_Scene.png">Jungle Scene</option>
    <option value="images/Lemonade_Sign.png">Lemonade Sign</option>
    <option value="images/Lighthouse.png">Lighthouse</option>
    <option value="images/Little_Bo_Peep.png">Little Bo Peep</option>
    <option value="images/Merry-Go-Round_Horse.png">Merry-Go-Round Horse</option>
    <option value="images/Performing_Seal.png">Performing Seal</option>
    <option value="images/Pumpkin_Coach.png">Pumpkin Coach</option>
    <option value="images/Ring_Around_the_Rosy.png">Ring Around the Rosy</option>
    <option value="images/Sailboat.png">Sailboat</option>
    <option value="images/Snow_Man.png">Snow Man</option>
    <option value="images/Steamboat.png">Steamboat</option>
    <option value="images/Surfer.png">Surfer</option>
    <option value="images/The_Red_Balloon.png">The Red Balloon</option>
    <option value="images/The_Skier.png">The Skier</option>
    <option value="images/The_Witch.png">The Witch</option>
    <option value="images/The_Wizard_of_Light.png">The Wizard of Light</option>
    <option value="images/Toy_Soldier.png">Toy Soldier</option>
    <option value="images/Tropical_Fish.png">Tropical Fish</option>
    <option value="images/Windmill.png">Windmill</option>
  </select>
  <button id="saveLB">Save to URL</button>
</div>
<div id="diagsLB">
  <div>
    <textarea id="printLB" cols="78" rows="16"></textarea>
  </div>
  <button id="runLB">Run</button>
  <button id="stepLB">Step</button>
  <button id="resetLB">Reset</button>
  <button id="clearLB">Clear</button>
  <input type="range" min="1" max="120" value="15" class="slider" id="throttleLB"><span id="speedLB">Stopped</span>
</div>

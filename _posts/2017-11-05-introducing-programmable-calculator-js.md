---
layout: post
title: Introducing Programmable Calculator JS
date: 2017-11-05 15:00:00
permalink: /blog/2017/11/05/
machines:
  - id: ti57
    type: ti57
    name: TI-57 Programmable Calculator
    config: |
      {
        "ti57": {
          "class": "Machine",
          "type": "TI57",
          "name": "TI-57 Emulator",
          "version": 1.10,
          "bindings": {
            "clear": "clearTI57",
            "print": "printTI57"
          }
        },
        "chip": {
          "class": "Chip",
          "type": "TMS-1501",
          "input": "buttons",
          "output": "display",
          "bindings": {
            "2nd": "ind2nd",
            "INV": "indINV",
            "Deg": "indDeg",
            "Rad": "indRad",
            "Grad": "indGrad"
          }
        },
        "clock": {
          "class": "Time",
          "cyclesPerSecond": 650000,
          "bindings": {
            "run": "runTI57",
            "speed": "speedTI57",
            "step": "stepTI57"
          },
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate"]
        },
        "display": {
          "class": "LED",
          "type": 3,
          "cols": 12,
          "rows": 1,
          "color": "red",
          "bindings": {
            "container": "displayTI57"
          },
          "overrides": ["color","backgroundColor"]
        },
        "buttons": {
          "class": "Input",
          "buttonDelay": 50,
          "location": [45, 316, 372, 478, 0.34, 0.5, 459, 832, 322, 168, 75, 38],
          "map": [
            ["2nd",  "inv",  "lnx",  "\\b",  "clr"],
            ["lrn",  "xchg", "sq",   "sqrt", "rcp"],
            ["sst",  "sto",  "rcl",  "sum",  "ypow"],
            ["bst",  "ee",   "(",    ")",    "/"],
            ["gto",  "7",    "8",    "9",    "*"],
            ["sbr",  "4",    "5",    "6",    "-"],
            ["rst",  "1",    "2",    "3",    "+"],
            ["r/s",  "0",    ".",    "+/-",  "=|\\r"]
          ],
          "bindings": {
            "surface": "imageTI57",
            "power": "powerTI57",
            "reset": "resetTI57"
          }
        },
        "rom": {
          "class": "ROM",
          "wordSize": 13,
          "valueSize": 16,
          "valueTotal": 2048,
          "littleEndian": true,
          "file": "ti57le.bin",
          "reference": "",
          "chipID": "TMC1501NC DI 7741",
          "revision": "0",
          "values": [
            4623,4386,5106,7051,3246,6152,5813,5628,5805,7051,4386,3246,7911,5132,1822,6798,
            2600,1497,6539,6471,6642,6462,6899,6939,6660,3246,7587,4388,6648,4386,5634,7051,
            4386,5692,7051,6154,6392,3246,7434,4388,3186,3197,7755,3194,8074,3495,3184,6731,
            4065,6775,6300,6893,6327,3246,7273,4386,6768,4388,3246,8118,3186,7719,3879,6686,
            2087,6236,6266,6890,6328,4386,3246,7317,6208,4388,3246,8140,3186,7761,3219,6743,
            3261,6799,6679,6896,6755,3288,6240,3288,6311,4386,3246,8141,3238,6801,3188,6782,
            3112,3246,6762,3290,3296,6314,4386,3217,7050,3250,6253,3194,6565,4386,6393,2079,
            2241,5133,2079,1879,3588,1806,7051,5090,3329,7051,4388,3246,7300,3189,3186,7710,
            3250,3237,7055,3587,5132,1793,3194,6325,5112,2272,2272,3310,6288,3584,1793,3590,
            2273,3594,3310,7703,6277,5551,5511,3194,8075,1887,5587,7051,4386,3194,7172,5736,
            3246,7051,804,8075,5813,5635,7051,3108,3246,6762,3359,4388,5132,3129,3133,3298,
            7349,3128,3290,7349,3132,5234,7055,3308,3250,7590,4386,5426,3246,6335,3232,3194,
            6342,3304,3298,6342,3246,7279,2271,3583,5276,3592,3551,2303,3877,6775,3298,6354,
            3234,7280,3118,7799,2080,3114,6365,3118,7389,3110,3108,6367,3107,3115,3300,2055,
            3594,5138,1815,1991,3298,7414,3310,6380,3234,6261,5230,6261,3306,3129,6384,3128,
            3234,6388,5636,6389,5585,5138,5229,6799,3246,3296,6327,4224,5120,5136,2573,6406,
            2657,5142,2656,5155,2657,6397,2777,5155,6475,5217,4224,5123,2599,3120,3124,2629,
            6406,2656,5142,2657,5155,2656,6412,3186,3592,6427,5186,3225,1815,5537,3919,3587,
            3246,6455,3250,6423,3250,3237,6431,3233,1505,2623,3194,6445,3116,3246,6450,3943,
            3192,3848,2759,5123,5155,3234,7499,3233,5120,5136,2573,6678,2592,6469,4224,3246,
            7463,5136,3233,2593,7499,3588,6475,3246,8095,3250,7702,3592,3248,5123,2593,7506,
            544,6478,813,1028,808,6489,3589,2561,6469,5826,1991,3593,5142,3877,7184,3118,
            6500,3117,3309,1255,3943,3192,3849,3877,6523,3292,3848,5255,3877,6526,1823,1061,
            1281,557,2247,3232,3236,7660,3294,6633,6117,6045,6542,3849,3877,7530,2591,6056,
            1535,1512,3134,6539,3130,3126,6539,3130,3122,7623,3841,5488,1528,1823,5416,616,
            616,872,872,1061,7574,1127,2377,5826,872,872,5561,3234,7055,1384,3238,7055,
            3233,5221,6706,4224,3308,3256,3237,3232,145,3194,6572,167,3495,3228,3220,3246,
            6578,3488,3298,7608,3310,7464,3488,3488,3224,6440,3234,6450,3233,3258,7645,3118,
            7474,3479,3903,165,7474,3116,6450,2599,2592,3124,3314,7631,4065,3128,3872,3318,
            7635,3872,3321,3322,7638,3872,3232,3236,3310,3309,6527,1255,6527,1503,2623,3257,
            3226,6447,3222,6630,3116,6447,3218,7621,6450,6118,6090,6542,3294,1312,6520,6115,
            6096,6542,3250,7456,3246,7433,3252,6658,3262,7680,1999,5416,3591,3591,7676,1887,
            3254,8079,3263,7055,3246,3296,7963,4388,5135,2561,3588,5133,3121,3125,6325,401,
            257,3594,3588,2208,3590,6673,3249,4388,257,2193,329,473,3594,3588,1793,5416,
            3184,1038,616,1038,3473,3877,7736,3218,7726,3216,679,672,680,592,3221,7055,
            1320,5110,1328,7055,3250,7610,3186,6686,3222,7728,549,6718,3218,6727,719,744,
            2024,2024,3282,7055,1038,616,1038,2055,1087,552,7055,3194,7726,3196,3220,1353,
            7055,3222,6743,3308,5221,1144,5007,2121,2144,1896,79,3895,3122,7768,3167,2145,
            8079,5492,6751,4386,3246,7287,3116,3194,6762,3288,4386,6019,3238,7799,3236,6801,
            5127,3236,3872,3134,6777,3126,6777,3188,7050,5234,7054,5636,2079,6019,4065,6801,
            4057,3594,2081,2085,2561,7815,2079,1815,3588,7054,3877,7843,3873,2277,3588,287,
            7051,5127,2151,3877,2085,6807,2119,2149,7839,2141,6794,4064,3594,3322,7216,287,
            3841,3105,6792,1887,1806,3162,6824,3128,2120,7854,2120,7803,5585,6780,2079,3588,
            1999,1806,549,7870,5537,5736,1806,3589,5636,5805,5213,1999,2247,6780,3154,6849,
            6124,613,6842,6137,5552,5537,6842,5132,3919,3090,2303,6861,3232,1887,5635,5112,
            3189,5628,1822,5628,5691,3190,6872,3300,5112,3841,5857,1863,5133,613,7908,5628,
            5112,1815,5627,7051,5485,1806,6260,3194,7879,3240,3120,3246,6176,3124,3246,6145,
            3246,6173,5855,3250,6903,3246,6565,4386,3246,6973,5135,549,3094,7941,5108,3399,
            3157,5583,3195,3588,6924,1793,6914,5132,5582,3298,6924,3090,549,7951,3232,3194,
            6930,3235,1951,3234,7050,3262,3254,7050,5136,2592,7049,3250,6944,3246,3194,6564,
            4386,3246,7943,5132,3194,8060,3262,3254,7980,3121,3125,6967,3126,7799,3872,3588,
            3697,5211,3697,3588,5136,1807,3681,5234,3254,8026,3240,3262,8026,5426,5276,3877,
            7034,3246,7002,2349,3527,5276,3877,3551,1535,1512,2055,3592,1528,7034,5136,2561,
            3242,6996,3241,3260,1500,7799,1505,8073,2592,6998,2413,2413,1503,2687,2009,2265,
            3551,5183,2629,2573,1504,7029,3593,296,296,3592,2272,3310,7010,3552,3294,8056,
            3290,7007,3286,8032,7007,2408,2408,6990,2408,2408,2193,6775,3122,3123,3126,3125,
            6224,3588,3665,5211,3665,3588,3697,5214,3681,3588,1815,3242,2193,7899,5426,3254,
            7061,3262,3261,8085,3253,5276,3593,3877,2265,7732,3289,2305,1504,1508,3586,4386,
            3194,8101,5426,5186,5253,3090,7080,2279,3089,5238,3194,7086,5253,7087,5574,5238,
            3194,7091,5574,5221,3376,7051,4386,3300,5132,5627,3633,5213,5226,3681,5223,5106,
            3697,5223,5133,3302,3303,8125,5552,3649,5223,3665,5223,7050,3296,4386,3194,8145,
            3300,3681,5138,5136,3298,7333,1991,1807,5628,1806,5635,3697,1863,5138,5587,1806,
            6309,1927,769,6093,6090,6099,6104,6112,6090,6045,6103,6101,5826,967,768,839,
            768,3587,1991,5627,1865,103,2055,3587,5213,3588,1807,3587,0,0,0,0,
            2663,3936,7164,5136,2631,1793,3587,3871,3594,455,3589,3587,1991,3649,6154,1991,
            3665,6154,3302,7262,3584,6239,3293,6180,3294,6177,2591,3429,6187,3590,591,2687,
            3587,2759,6174,3292,2639,639,3401,2575,5170,2145,7192,5488,1399,296,3424,1288,
            7197,6185,2560,3130,6205,3126,6205,2085,7229,3114,8188,3872,2049,2119,3847,3594,
            3584,3587,1100,3237,3185,3329,7241,3092,5570,621,1127,1120,616,97,7254,76,
            7252,97,6561,3088,552,6220,616,5567,101,7254,6561,3589,3681,1863,3589,1806,
            3587,5423,2592,3134,6241,2271,3587,1991,5138,1823,3855,5585,5138,1815,3302,7282,
            3590,6259,3588,1823,2567,3587,5537,5551,5511,1822,5582,1822,1865,3156,3160,1901,
            3156,1383,3855,3131,6826,5567,6591,3114,6293,3126,7309,3122,7317,3873,2080,3118,
            6333,3126,7317,3841,2605,3587,2561,3588,3188,3261,3253,799,3192,3245,3195,3262,
            3254,7364,975,3591,3591,7331,5411,3591,3591,6310,2623,3130,6318,3125,5420,5236,
            1535,5255,3130,3877,7473,2085,6449,3122,6302,3126,7473,3247,6303,2080,3118,7316,
            3872,3872,3872,6333,967,3593,3190,7321,3254,7389,3591,3591,6365,2623,3126,3130,
            7389,2080,3118,6358,2081,6395,2080,3106,3110,7389,3114,6365,5217,5136,2592,3588,
            2593,5170,3190,7318,2145,7400,296,6372,3877,7419,3118,6382,3117,3192,5488,3391,
            3431,3160,3337,3365,3335,7419,3895,3337,3365,6417,3244,5235,1535,3877,7473,5255,
            3877,6449,3246,3194,7430,5007,4375,3194,7435,799,4899,3246,7438,4954,2279,3308,
            4208,2265,2193,3090,7447,3361,2215,3098,6426,3296,3094,7453,3308,3194,6432,3304,
            1823,4375,4306,3190,6447,2592,3122,6444,841,3592,865,7471,3593,863,3592,3591,
            3591,3587,3592,5537,3649,5213,1865,3156,5492,2009,3090,6461,3431,2119,3198,7494,
            1479,992,992,1005,1509,7549,3284,2081,5490,5490,3118,6473,1028,6495,5491,711,
            544,1252,6485,749,6481,741,6496,545,967,1815,5565,804,6452,799,6496,5491,
            2149,6502,1061,6502,1125,7519,552,616,3286,6520,3094,6521,1120,3282,6513,3091,
            3847,3587,2081,557,1901,3152,3164,3587,1377,1121,3587,5567,557,3094,7547,1317,
            7495,621,5575,2081,6527,2049,6527,1814,841,3169,3094,7585,941,5575,3094,7580,
            872,613,7572,3168,5527,552,6541,533,7629,529,864,6551,5567,936,3094,7585,
            5527,3129,6567,37,6570,552,5575,549,6563,1793,3130,3129,8105,1927,6594,2007,
            5108,783,3329,1281,3128,6563,1351,2121,1281,1377,8105,813,6585,513,39,3094,
            7145,1313,1317,6597,3093,3587,5575,3094,8169,1313,6597,1319,3092,3587,1887,3128,
            1806,3130,6612,3091,1423,3129,3158,7665,3094,1299,7670,1445,6608,1937,3090,6631,
            3154,7657,525,7632,521,1887,6561,3154,7650,520,6687,557,877,5566,804,7653,
            6687,3094,6608,1299,7632,1445,613,7645,557,5567,6612,1887,3129,6665,5553,1303,
            3154,6561,5108,3128,3130,6652,549,8179,3095,1935,583,3338,3089,3154,6672,3088,
            3217,3346,3222,7721,1288,8171,513,1425,1353,5570,677,7653,3130,7729,557,1185,
            6633,685,677,7653,101,6686,872,5575,6687,1293,6701,3095,1294,1289,6678,905,
            544,909,6703,37,6629,877,552,549,6705,5575,6705,5588,6138,1793,677,7585,
            5108,1441,7755,1441,7751,1312,6721,3222,6730,1312,621,3217,2121,1287,2424,1281,
            1425,6753,877,813,6752,897,897,776,901,6741,777,786,6749,165,6738,936,
            877,869,6742,5554,3351,2383,1343,6629,3841,6138,1281,3088,549,8172,5558,841,
            3122,6773,103,549,7678,798,769,2063,2081,7877,2081,7887,2081,7894,2081,7899,
            39,6052,798,3122,6800,797,7829,793,655,534,6052,534,592,6789,535,856,
            647,6052,534,530,6798,2144,749,741,6773,3122,7678,5814,1991,521,5554,1822,
            3222,6819,3088,1895,1431,127,1453,621,1431,127,1806,5636,6612,3120,5813,5511,
            3328,3170,8171,1423,6766,1863,1793,6106,6104,808,6106,6099,6090,6099,808,6112,
            6104,808,808,808,3587,6098,6104,6045,808,6045,6093,6112,6090,5826,6786,6111,
            6099,808,6104,6104,808,6860,6110,6099,5826,6106,6861,6109,6099,5825,6786,4386,
            2303,3189,5537,3194,8019,3128,6058,5090,3189,768,5511,6005,5558,5089,768,3090,
            6898,787,3329,5090,909,853,7930,3235,3126,6920,901,7936,897,3126,6912,3091,
            3122,3877,6990,909,7944,787,3091,3235,925,7948,851,3128,791,3527,798,841,
            913,167,3194,7958,6024,6935,6051,965,7976,963,798,3194,6946,6052,786,6024,
            778,6930,6051,776,782,6052,897,6930,2144,741,6930,783,3130,6963,3194,6962,
            5089,851,790,5554,5485,3194,8037,1814,5554,1879,5635,3089,5485,3126,6983,5106,
            3125,5691,5634,5485,3190,6983,5545,3281,3234,6987,3280,2271,3967,5003,909,8017,
            787,851,6920,6005,3527,3126,7005,5106,5587,5692,3190,8036,5635,3094,549,8034,
            5634,3128,5558,6926,4751,3122,7020,5089,5553,1879,5587,3089,1927,3234,7027,5090,
            3329,1879,5588,6058,6987,657,936,912,677,7597,3094,6573,3194,8037,3122,6987,
            1991,5552,6987,3097,3290,6573,3096,6573,769,2063,2081,8085,2081,8095,39,2081,
            7076,6108,6112,6095,7117,6111,6095,6090,6096,6099,6106,6101,6112,808,7145,6109,
            6095,6095,7068,791,2063,813,2081,7077,2080,3587,5488,2175,5132,2349,2062,2600,
            3182,8129,3178,7283,6099,6093,6106,6098,6092,6098,6045,6104,3329,808,6045,1879,
            6660,6103,6095,6045,6112,6092,6106,6104,6093,7100,808,7138,6093,808,7139,6096,
            808,7140,6112,808,7141,808,7142,6096,808,7143,808,7144,6112,6112,6112,6112,
            808,800,800,800,800,800,800,800,800,1312,6597,3094,769,8177,801,3093,
            8183,1313,8182,613,3343,7148,39,3188,6561,3130,3090,7165,3188,3587,0,0
          ]
        }
      }
styles:
  _ti57:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
  _displayTI57:
    position: absolute;
    left: 16%;
    top: 7%;
    width: 70%;
    height: 4%;
  .indTI57:
    font-size: 11px;
    font-family: Monaco,"Lucida Console",monospace;
    color: red;
  _ind2nd:
    position: absolute;
    left: 17%;
    top: 12%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indINV:
    position: absolute;
    left: 25%;
    top: 12%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indDeg:
    position: absolute;
    left: 33%;
    top: 12%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indRad:
    position: absolute;
    left: 41%;
    top: 12%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _indGrad:
    position: absolute;
    left: 49%;
    top: 12%;
    width: 7%;
    height: 2%;
    opacity: 0;
  _powerTI57:
    position: absolute;
    left: 70%;
    top: 20%;
    width: 16%;
    height: 5%;
    opacity: 0;
  .diagsTI57:
    float: left;
  _printTI57:
    font-family: Monaco,"Lucida Console",monospace;
---

For years, we all assumed that **PCjs** meant **Personal Computers in JavaScript**.  Even I thought that.  But now
it turns out that it also stands for **Programmable Calculators in JavaScript**.  Who knew?

My first programmable device was a TI-57 Programmable Calculator, purchased in 1978.  I (or more likely my dad)
bought it at Radio Shack, so it was actually an EC-4000, but as I explain on the [TI-57 Resources](/devices/ti57/) page,
the EC-4000 was just a rebranded TI-57.  I'm not sure why we bought it at Radio Shack.  Maybe they were having a sale,
or maybe we got a bunch of free punches on our Radio Shack Battery Cards.

It was a great device and I wrote [all sorts of programs](/devices/ti57/docs/) for it, although my fascination
with it was eventually superseded by the [Challenger 1P](/devices/c1p/) I got later that year.

I recently unearthed my TI-57 from storage, and after retro-fitting it with a 9V battery, I was happy to see that it
still mostly worked, except for a few unresponsive buttons.  I immediately started wondering how much work it would be
to write a TI-57 emulator, to sidestep these annoying problems with fussy old hardware.

It was no real surprise that several other people already had the same idea, but as far as I could tell,
only one person, who goes by the name "[HrastProgrammer](http://www.hrastprogrammer.com/)", went all-out and created
a simulation of the TI-57 calculator chip, the TMS-1500: basically, a very simple CPU with 20+ registers, along with
2K of ROM and assorted circuitry for driving the LED display and scanning the keyboard.

This was an interesting challenge, because while no system manuals had ever been published for this "single-chip
computer", it was documented in excruciating detail in at least *nine* [TI-57 Patents](/devices/ti57/patents/).
And excruciating is the right word, because only a hard-core chip designer would love reading the many delightful
pages of how `OR gate 515 is responsive to the DISP and REL HOLD signals` or how `NAND gate 468 is responsive to the MSKΦ
signal from gates 220 received via inverter 434`.

HrastProgrammer's work was a great step forward, proving that an emulator was possible, and other people used it
to learn more about TI-57 internals.  For example, Claus Buchholz wrote a few articles
("[The TI-57 Memory Map](http://www.rskey.org/CMS/index.php/the-library/100)" and 
"[TI-57 Constant ROM](http://www.rskey.org/CMS/index.php/the-library/475)") with the assistance of that emulator.

Sadly, HrastProgrammer's work is closed-source, so many of the details that he gleaned from the patents and learned
along the way remain buried.  His [FAQ](http://www.hrastprogrammer.com/faq.htm) summarizes his opinion of
open-source projects:

	Yes, what about it? From time to time, I receive a request to release them as open-source.
	Sometimes it sounds like I SHOULD DO THIS because it is to be expected. Well, I SHOULD do
	only what I WANT to do. And I DON'T WANT to release anything as open-source because I have
	no reason to do this. Except in a few rare cases, I don't like this open-source concept at all
	so I will not participate. All my emulators will be closed-source forever. Don't waste your
	and my time asking such questions.

We know from a handful of [blog posts](http://www.hpmuseum.org/cgi-sys/cgiwrap/hpmuseum/archv015.cgi?read=84950)
that HrastProgrammer originally decided to use a hand-edited version of the TI-57 ROM, extracted from six TI patents,
and that he probably made a number of useful corrections and discoveries along the way.  However, in the most recent
version of his [TI-57E](http://www.hrastprogrammer.com/ti57e/index.htm) emulator, he uses an electronic dump of a
production TI-57 ROM, reportedly obtained from a friend and which he said he could not distribute.

UPDATE: With a Windows debugger and lots of patience, I was able to isolate and extract the electronic ROM dump stored
inside HrastProgrammer's TI57E.EXE binary.  See the [TI-57 ROM](/devices/ti57/rom/#hrast-rom-2) page for details.

My only choice was to go down the same road that HrastProgrammer travelled and pore over the same TI patents.  They are
definitely valuable historical documents, filled with detailed diagrams, instruction decoding tables, and object code
listings of the chip's entire 2K ROM.  Unfortunately, as several people before me had found, the ROM listings in nearly
every one of the *nine* patents were all slightly different, no doubt because they had all been typed by hand (with
[one possible exception](/devices/ti57/rom/#rom-from-us-pat-no-4125867)).  Given all the obvious errors (invalid digits,
excessive digits, and missing digits), it was all but certain that the listings also contained numerous non-obvious
errors.

One enterprising person, [Sean Riddle](http://seanriddle.com/tms1500.html), had carefully scrutinized the ROM circuits
of a [Decapped TMS-1500 Chip](http://seanriddle.com/ti57rombits.jpg) and created a "transcript" of all the ROM bits.
To get some idea of how tedious that process is, here's a small section of that ROM image:

![TI-57 ROM Image](/devices/ti57/images/TI-57-ROM.png)

So, how to be sure that that transcript was accurate?  I decided to make my own independent transcript of all 26,624
ones and zeros, and then compare the results:

```
1011011010110101-1111100100011011-1001101011110101-0000000000101001-0101111101001010-0110010100011110-0011011111011001-1000000000111010-0001010000110001-1000010100100101-0101111001111011-0101111111110110-1000000100010000
0100101001111010-0000001001110101-0110101101010110-0000100001111000-0010000000100001-1111111100001011-0001001011010000-1011000001011010-1001101011101111-0110100110110000-0111111111000111-0101010110110010-1010101000101101
0100111101010001-1110111001011011-0101100011111110-1110011101011010-1001101110001100-0001010101111101-1010001110011011-0001110100010011-1100000011011111-1111001110000111-0001101101110000-1100011111111110-1100000010011011
1111110101010011-0010011010011111-0000111000000010-1101011010011001-0000000111101101-0011111000100100-0000000100100000-0100000000011001-1001100000000010-0100000001010011-0110001111101101-1011111001111011-1011100110000000
0010010110010000-1001111100011001-1100101010110000-1101101001011011-0001000100011101-0001101000011101-0010000110010001-1010001000010001-0000001000110010-0110001111100100-1101100100101011-1111111111111101-0100001001110110
0110011011110111-0100011000101000-0011010101101101-1011011000000101-0011000001001110-1001001000011100-0010100000001000-1001011000110100-0100001011101111-0110010111100010-0101111111000000-1001100010111101-1010010001101001
1011110111111110-0100111101111010-1000010001111100-1000101000111110-1110110101110111-0001101010000011-0110000100010000-0010001000001101-0001101001110000-0011000111010101-1100100110000111-1110101111111110-1001101001110100
0110010010001111-0101111110101100-1100111110010001-1010011111001001-1101010110111100-1101011000011111-1000000100101000-1101000000000011-1000110010011101-0011100100100000-1011011111111010-1101011100001010-1110101100001001
....
```

As my [TI-57 ROM](/devices/ti57/rom/) page explains, I found 4 bits that differed.  I passed the corrections on to
Sean, and then decided to go with this new transcribed ROM as the basis for my own emulator.

What you see below is the current state of the PCjs TI-57 emulator.  Just today, I finished "wiring" up the
[LED](/modules/devices/led.js) and [Keyboard](/modules/devices/input.js) devices to the
[TMS-1500 Chip](/modules/devices/tms1500.js) device, and so far, basic arithmetic operations look good.  I've not
exercised it much beyond that, because I'm not ready to go down more debugging rabbit holes just yet.  But if it does
crash, there's a handy "Diagnostics" window attached to it that should display useful information about what went wrong,
and it even includes a "mini-debugger".

With the PCjs [TI-57](/devices/ti57/) emulator, I also decided to take a fresh approach.  Instead of using
the same old ES5-based PCjs [shared modules](/modules/shared/lib), the TI-57 emulator is built with a new set of
ES6-based [Device modules](/modules/devices/), including:

* [Device](/modules/devices/device.js)
* [Input](/modules/devices/input.js)
* [LED](/modules/devices/led.js)
* [ROM](/modules/devices/rom.js)
* [Time](/modules/devices/time.js)
* [TMS-1500](/modules/devices/tms1500.js)
* [Machine](/modules/devices/machine.js)

Since I'm not currently "compiling/transpiling" any of that code to ES5 (as I've done with every other PCjs machine
to date), you have to be running a modern web browser.  I'll probably add an ES5 fall-back mechanism eventually, but
for now, it's rather refreshing to be using modern JavaScript language features and not constantly worrying about
backward-compatibility. 

*[@jeffpar](http://twitter.com/jeffpar)*  
*Nov 5, 2017*

{% include machine.html id="ti57" config="json" %}

<div id="ti57">
  <img id="imageTI57" src="/devices/ti57/images/TI-57.png" alt="TI-57 Calculator"/>
  <div id="displayTI57"></div>
  <div id="ind2nd" class="indTI57">2nd</div>
  <div id="indINV" class="indTI57">INV</div>
  <div id="indDeg" class="indTI57">Deg</div>
  <div id="indRad" class="indTI57">Rad</div>
  <div id="indGrad" class="indTI57">Grad</div>
  <button id="powerTI57">Power</button>
</div>
<div class="diagsTI57">
  <div>
    <p>Diagnostics</p>
    <textarea id="printTI57" cols="74" rows="16"></textarea>
  </div>
  <button id="runTI57">Run</button>
  <button id="stepTI57">Step</button><span id="speedTI57">Stopped</span>
  <button id="resetTI57">Reset</button>
  <button id="clearTI57">Clear</button>
</div>

/**
 * @fileoverview PCjs Build Options
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * PCjs is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * PCjs is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with PCjs.  If not,
 * see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every modified copy of this work
 * and to display that copyright notice when the software starts running; see COPYRIGHT in
 * <http://pcjs.org/modules/shared/lib/defines.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/*
 * This file provides UI options for building a functional PCjs PC.
 *
 * WARNING: This code is experimental and FAR from functional.  It is a work-in-progress.
 */

var typeAddress = {
    type: "address"
};

var typeBoolean = {
    type: "boolean"
};

var typeNumber = {
    type: "number"
};

var typePath = {
    type: "string"
};

var typeString = {
    type: "string"
};

var typeElement = {
    type: "element"
};

var machineOptions = {
    'ibm5150': "IBM PC (Model 5150)",
    'ibm5160': "IBM PC XT (Model 5160)",
    'ibm5170': "IBM PC AT (Model 5170)",
    'deskpro386': "COMPAQ DeskPro 386"
};

var videoLEDCapsLock = {
    'control': {
        _type: typeElement,
        'type': {
            _type: typeString,
            _value: "led"
        },
        'label': {
            _type: typeString,
            _value: "Caps"
        },
        'binding': {
            _type: typeString,
            _value: "caps-lock"
        },
        'pad-left': {
            _type: typeString,
            _value: "8px"
        }
    }
};

var videoLEDNumLock = {
    'control': {
        _type: typeElement,
        'type': {
            _type: typeString,
            _value: "led"
        },
        'label': {
            _type: typeString,
            _value: "Num"
        },
        'binding': {
            _type: typeString,
            _value: "num-lock"
        },
        'pad-left': {
            _type: typeString,
            _value: "8px"
        }
    }
};

var videoLEDScrollLock = {
    'control': {
        _type: typeElement,
        'type': {
            _type: typeString,
            _value: "led"
        },
        'label': {
            _type: typeString,
            _value: "Scroll"
        },
        'binding': {
            _type: typeString,
            _value: "scroll-lock"
        },
        'pad-left': {
            _type: typeString,
            _value: "8px"
        }
    }
};

var videoLEDContainer = {
    _type: typeElement,
    _value: [videoLEDCapsLock, videoLEDNumLock, videoLEDScrollLock],
    'type': {
        _type: typeString,
        _value: "container"
    },
    'pos': {
        _type: typeString,
        _value: "right"
    }
};

var videoCGALEDContainer = {
    'title': {
        _type: typeElement,
        _value: "Color Display"
    },
    'control': videoLEDContainer
};

var videoCGALEDMenu = {
    'menu': {
        _type: typeElement,
        _value: videoCGALEDContainer
    }
};

var machineElements = {
    'name': {
        _type: typeElement,
        _desc: "Machine Description",
        _value: "IBM PC"
    },
    'computer': {
        _type: typeElement,
        _desc: "General Computer Features",
        _value: null,
        'buswidth': {
            _type: typeNumber,
            _desc: "Bus width",
            _opts: {
                20: "20-bit bus",
                24: "24-bit bus",
                32: "32-bit bus"
            }
        },
        'resume': {
            _type: typeNumber,
            _desc: "Resume option",
            _opts: {
                0: "Resume Disabled",
                1: "Resume Enabled",
                2: "Resume with Prompt"
            }
        }
    },
    'ram': {
        _type: typeElement,
        _desc: "Read-Write Memory (Conventional or Extended)",
        _multi: true,
        _value: [
            {
                'id': "ramLow",
                'addr': "0x00000"
            }
        ],
        'id': {
            _type: typeString
        },
        'addr': {
            _type: typeAddress
        },
        'size': {
            _type: typeNumber
        }
    },
    'rom': {
        _type: typeElement,
        _desc: "Read-Only Memory",
        _multi: true,
        _value: [
            {
                'id': "romBASIC",
                'addr': "0xf6000",
                'size': "0x8000",
                'file': "/devices/pc/rom/5150/basic/BASIC100.json"
            },
            {
                'id': "romBIOS",
                'addr': "0xfe000",
                'size': "0x2000",
                'file': "/devices/pc/rom/5150/1981-04-24/PCBIOS-REV1.json"
            }
        ],
        'addr': {
            _type: typeAddress
        },
        'size': {
            _type: typeNumber
        },
        'file': {
            _type: typePath
        }
    },
    'video': {
        _type: typeElement,
        _desc: "Video Adapter",
        _multi: false,
        _opts: {
            'cga': {
                'screenwidth': {
                    _type: typeNumber,
                    _opts: [960]
                },
                'screenheight': {
                    _type: typeNumber,
                    _opts: [480]
                },
                'scale': {
                    _type: typeBoolean,
                    _opts: [true]
                },
                'charset': {
                    _type: typePath,
                    _opts: ["/devices/pc/video/ibm/cga/ibm-cga.json"]
                },
                'pos': {
                    _type: typeString,
                    _opts: ["center"]
                },
                'padding': {
                    _type: typeString,
                    _opts: ["8px"]
                },
                'controls': videoCGALEDMenu
            }
        }
    }
};

var pcElements = {
    'machine': {
        _desc: "Machine",
        _type: typeElement,
        _opts: machineOptions,
        _value: machineElements,
        'id': {
            _type: typeString
        },
        'class': {
            _type: typeString,
            _value: "pc"
        },
        'border': {
            _type: typeNumber,
            _value: "1"
        },
        'pos': {
            _type: typeString,
            _value: "center"
        },
        'background': {
            _type: typeString,
            _value: "#FAEBD7"
        }
    }
};

/*
 * As we build a PC, elements will be added to pcState that mirror the template structures above.  Also,
 * as choices are made, the identifier of that choice will be added as the 'id' of the corresponding element.
 *
 *      'machine': {
 *          'id': "ibm5150",
 *          'class': "pc",
 *          'border': "1",
 *          'pos': "center"
 *          'background': "#FAEBD7"
 *          'name': {
 *          },
 *          'computer': {
 *          },
 *          'ram': {
 *          }
 *          // ...
 *      }
 */
var pcState = {};

/**
 * findNewItem(state, template)
 *
 * @param {Object} state (eg, pcState)
 * @param {Object} template (eg, pcElements)
 * @return {Object|null} (eg, state['machine'])
 */
function findNewItem(state, template)
{
    for (var item in template) {

        if (item.charAt(0) == '_') continue;

        if (state[item] === undefined) {
            state[item] = {
                _template: template[item]
            };
            return state[item];
        }

        if (typeof template[item] == "object") {
            var itemNext = findNewItem(state[item], template[item]);
            if (itemNext) return itemNext;
        }
    }

    if (template._type == typeElement && template._value && typeof template._value == "object") {
        return findNewItem(state, template._value);
    }

    return null;
}

/**
 * setNewItem(idHTML, eHTML, item)
 *
 * @param {string} idHTML
 * @param {Object} eHTML
 * @param {Object} item (ie, a node in pcState with a _template that contains _opts)
 */
function setNewItem(idHTML, eHTML, item)
{
    /*
     * First, remove any old options...
     *
    while (eHTML.firstChild) {
        eHTML.removeChild(eHTML.firstChild);
    }
     */
    /*
     * Next, add a new set of options....
     */
    var value;
    var opts = item._template._opts;
    if (!opts) {
        value = item._template._value;
        if (value) {
            populateItem(item, null);
        }
        else {
            /*
             * Add an input field to prompt for the value...
             */
        }
        setTimeout(function() { buildPC(idHTML) }, 0);
    }
    else {
        var eSelect = document.createElement("select");
        var eOption = document.createElement("option");
        eOption['value'] = "none";
        eOption.textContent = "Select a " + item._template._desc + "...";
        eSelect.appendChild(eOption);
        for (value in opts) {
            eOption = document.createElement("option");
            eOption['value'] = value;
            eOption.textContent = opts[value];
            eSelect.appendChild(eOption);
        }
        eSelect.onchange = function(event) {
            var id = eSelect.value;
            if (id != "none" && id != item.id) {
                populateItem(item, id);
                setTimeout(function() { buildPC(idHTML) }, 0);
            }
        };
        eHTML.appendChild(eSelect);
    }
}

/**
 * populateItem(item, id)
 *
 * @param {Object} item (eg, state['machine'])
 * @param {string|null} id for item
 */
function populateItem(item, id)
{
    if (id) item.id = id;
    for (var prop in item._template) {
        if (prop == '_value' && !id) {
            item[prop] = item._template[prop];
        }
        if (prop.charAt(0) != '_') {
            var attr = item._template[prop];
            if (item[prop] === undefined && typeof attr._value == "string") {
                item[prop] = attr._value;
            }
        }
    }
}

/**
 * buildPC(idHTML)
 *
 * @param {string} idHTML (the ID of the DIV where build UI options should be presented)
 */
function buildPC(idHTML)
{
    var eHTML = document.getElementById(idHTML);
    if (eHTML) {
        var item = findNewItem(pcState, pcElements);
        if (item) {
            setNewItem(idHTML, eHTML, item);
        }
    }
}

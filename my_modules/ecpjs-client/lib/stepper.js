/*
 *  stepper.js
 *  by Jeff Parsons, June 24, 2012
 *
 *  Stepper methods extracted from the original Component class.
 */

/*
 *  The Stepper class defines a set of stepping functions used to help drive multi-step
 *  operations that a component may want to "single-step."  The setStep() function determines
 *  the delay, if any, between the steps.  If there is no delay, then all the supplied
 *  "step" functions are called directly.  Otherwise, any delay (even a minimal delay of 0ms)
 *  results in the creation and queuing of step objects. Every step object contains:
 *
 *      fn: step function pointer
 *      n: step number
 *
 *  and is stored in a simple array (aStep) used to enqueue/dequeue the step objects.
 *
 *  firstStep() gets the ball rolling by queuing the first "step" function.  That initial
 *  "step" function, as well as any or all subsequent "step" functions, call addStep()
 *  to add more steps to the queue as needed.  As each "step" function successfully finishes
 *  (by returning true), the next "step" function is dequeued and called.  As soon as a
 *  "step" function returns false, the dequeuing process stops, and any remaining steps
 *  in the queue are ignored.  If the queue empties before that happens, then we essentially
 *  repeat firstStep(), and the process continues.
 *
 *  If a negative millisecond delay (-1) has been set via setStep(), then both firstStep()
 *  and addStep() call their respective "step" functions directly, instead of queuing them.
 *  That option should be used only for very brief steps, otherwise the browser will appear
 *  to hang if the stepping functions never yield.
 *
 *  Also, when "step" functions are called directly, the step number (n) is omitted from the
 *  calls, so that the "step" function can quickly determine whether to bypass its internal print
 *  operations.  printStep() will automatically bypass, since it has access to the step number,
 *  but if you want to maximize speed, then either always check for an undefined step number, or
 *  use separate "step" functions that omit both the step number and the print operations altogether.
 *
 *  NOTE: the stepping functions use printStatus() indirectly, via printStep(). However,
 *  there may be times when a component wants to reserve its "status" control for more pertinent
 *  messages.  In those cases, the component can pass a "quiet" setting to setStep().
 */

function Stepper() {
}

Stepper.prototype = {
    /*
     *  initStep(parms) accepts any or all of the following parameter (parms) properties:
     *
     *      step: millisecond step setting (0 for minimum delay when single-stepping, -1 for direct calls instead of steps)
     */
    initStep: function(parms) {
        this.msStep = parms.step;
        this.quiet = (this.msStep == 0);
    },
    /*
     *  setStep(ms, quiet)
     *
     *  ms can be any of:
     *
     *      1) non-negative number of milliseconds
     *      2) -1 to call all step functions directly without delay
     *      3) an HTML element (eg, a button) that will control stepping via its "onclick" handler
     *
     *  Note that even 0 is a supported millisecond delay, albeit a minimal one, insuring that scripts
     *  don't run too long without yielding.
     *
     *  If quiet, then printStep() messages will not be passed to printStatus(); however, if logging is
     *  enabled (refer to this.fLog), printStep() messages will still be logged.
     */
    setStep: function(ms, quiet) {
        this.msStep = ms;
        this.quiet = quiet;
    },
    stopSteps: function() {
        if (this.timerSteps !== undefined)
            clearTimeout(this.timerSteps);
        if (this.timerNotify !== undefined)
            clearTimeout(this.timerNotify);
        this.aSteps = [];
        this.cSteps = 0;
        this.timerSteps = undefined;
        this.fnNotify = undefined;
        this.timerNotify = undefined;
        if (!this.quiet) this.printStatus();    // "clear" the status field, if any, as well
    },
    firstStep: function(fn, fnNotify) {
        this.fnNotify = fnNotify;
        this.timerNotify = undefined;
        if (this.msStep == -1) {
            while (fn.call(this))
                ;
            if (this.fnNotify) this.timerNotify = setTimeout(this.fnNotify, 0);
            return;
        }
        this.kickStep(fn);
        this.nextStep(0);
    },
    kickStep: function(fn) {
        this.addStep(function(n) {
            // this.log(this.toString() + ": Step " + n + ": automatic kickStep");
            if (!fn.call(this, n))
                return false;
            return this.kickStep(fn);
        });
        return true;
    },
    addStep: function(fn) {
        if (this.msStep == -1) {
            return fn.call(this);
        }
        var step = {fn:fn, n:++this.cSteps};
        this.aSteps.push(step);
        return true;
    },
    removeStep: function($this) {
        $this.timerSteps = undefined;
        if (typeof $this.msStep == "object")
            $this.msStep.onclick = null;
        var step = $this.aSteps.shift();
        if (step === undefined)
            return false;
        return $this.doStep(step);
    },
    doStep: function(step) {
        if (!step.fn.call(this, step.n)) {
            if (this.fnNotify) this.timerNotify = setTimeout(this.fnNotify, 0);
            return false;
        }
        return this.nextStep(this.msStep);
    },
    nextStep: function(ms) {
        if (this.aSteps.length == 0) {
            console.warn("Component.nextStep(): unexpected end of steps");
            return false;
        }
        if (typeof ms == "number") {
            /*
             * IE doesn't support:
             *
             *      setTimeout(this.removeStep, ms, this);
             *
             * so we're forced to do this instead:
             *
             *      var thisParm = this;
             *      setTimeout(function() {thisParm.removeStep(thisParm);}, ms);
             */
            var thisParm = this;
            this.timerSteps = setTimeout(function() {thisParm.removeStep(thisParm);}, ms);
        }
        else
        if (typeof ms == "object") {
            ms.onclick = function(regParm) {
                /*
                 * If we defined the onclick handler below as "function(e)" instead of simply "function()", then we could
                 * also receive an event object (e); however, IE reportedly requires that we examine a global (window.event)
                 * instead.  If that's true, and if we ever care to get more details about the click event, then we might
                 * have to worry about that (eg, define a local var: "var event = window.event || e").
                 */
                return function() {
                    return regParm.removeStep(regParm);
                };
            }(this);
        }
        else
            alert("unexpected step parameter (" + ms + ")");
        return true;
    },
    printStep: function(n, s) {
        if (n !== undefined) {
            if (!this.quiet)
                this.printStatus("Step " + n + ": " + s);
            else if (this.fLog)
                this.log(this.toString() + ": Step " + n + ": " + s);
        }
    },
    /*
     *  printStatus(s)
     *
     *  Passes any string (s) to the associated HTML element of class "status", if any;
     *  pass a blank string, or nothing at all, to clear the contents of the associated
     *  "status" element.
     *
     *  If there's no "status" element associated with this component, then status messages
     *  are simply thrown away.  However, if logging is enabled (ie, parms.log was true),
     *  all status messages are still logged.
     */
    printStatus: function(s) {
        if (this.updateStatus !== undefined) {
            this.updateStatus(s);
        }
        if (this.fLog && s) {
            this.log(this.toString() + ": " + s);
        }
    },
    /*
     *  setStatusUpdate(s)
     *
     *  Sets the "updateStatus" handler that printStatus() uses to display any status messages.
     */
    setStatusUpdate: function(updateStatus) {
        this.updateStatus = updateStatus;
    }
};

Component.extend(Component.prototype, Stepper.prototype);

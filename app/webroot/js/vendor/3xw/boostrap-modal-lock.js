/**
 * http://stackoverflow.com/questions/13421750/twitter-bootstrap-jquery-how-to-temporarily-prevent-the-modal-from-being-clo
 */

// save the original function object
var _superModal = $.fn.modal;

// add locked as a new option
$.extend( _superModal.Constructor.DEFAULTS, {
    locked: false
});

// capture the original hide
var _hide = _superModal.Constructor.prototype.hide;
// console.log('HIDE:', _hide);

// add the lock, unlock and override the hide of modal
$.extend(_superModal.Constructor.prototype, {
    // locks the dialog so that it cannot be hidden
    lock: function() {
        // console.log('lock called');
        // console.log('OPTIONS',this.options);
        this.options.locked = true;
    }
    // unlocks the dialog so that it can be hidden by 'esc' or clicking on the backdrop (if not static)
    ,unlock: function() {
        // console.log('unlock called');
        this.options.locked = false;
    }
    // override the original hide so that the original is only called if the modal is unlocked
    ,hide: function() {
        // console.log('hide called');
        if (this.options.locked) return;

        _hide.apply(this, arguments);
    }
});
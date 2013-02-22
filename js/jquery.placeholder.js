/*
Placeholder jQuery Plugin @version 1.0

Fades out the placeholder text on focus instead of clearing it out completely.
Restores the placeholder text on blur, if no value was entered.
Supports Chrome, Firefox, Safari, and IE 7, 8, and 9!

----------------------------------
Copyright (C) 2013 Wesley Musgrove
----------------------------------
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>

--------------
Example Usage:
--------------
$(document).ready(function() {
    $("input, textarea").placeholder();
});

<input type="text" id="txtFirstName" name="txtFirstName" value="" placeholder="Enter First Name...">
<textarea id="txtArea1" name="txtArea1" placeholder="Placeholder Text..."></textarea>
 */
(function($){

  $.placeholder = function(field, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of each element
    base.$field = $(field);
    base.field = field;

    // If this (field) input does not have a placeholder attribute, do not bind any events
    if (base.$field.attr('placeholder') > "" && typeof (base.$field.attr('placeholder')) != 'undefined') {

      base.init = function() {
        // Merge supplied options with default options
        base.options = $.extend({},$.placeholder.defaultOptions, options);
        base.options.placeholder = base.$field.attr('placeholder');

        // Check if the field is already filled in with the placeholder
        if(base.$field.val() != "" && base.$field.val() == base.options.placeholder) {
          base.$field.css('color',base.options.normal);
        }
        // Check if the field is already filled in with something other than the placeholder
        else if (base.$field.val() != "" && base.$field.val() != base.options.placeholder) {
          base.$field.css('color',base.options.normal);
        }
        // Otherwise, it was empty so fill it with the placeholder
        else {
          base.$field.css('color',base.options.normal).val(base.options.placeholder);
        }
      
        // Use of a namespace (.placeholder) allows us to unbind or trigger some events of a type without affecting others. 
        base.$field
        .bind('focus.placeholder', function(e) {
          base.fadeOnFocus(e);
        })
        .bind('click.placeholder', function(e) {
          base.fadeOnFocus(e);
        })
        .bind('blur.placeholder', function(e) {
          base.checkForEmpty(e);
        })
        .bind('keyup.placeholder', function(e) {
          base.checkForEmpty(e);
          base.removeSelectedRange(e);
        })
        .bind('keydown.placeholder', function(e) {
          base.hideOnChange(e);
        })
        .bind('change.placeholder', function(e) {
          base.checkForEmpty(e);
        })
        .bind('onPropertyChange.placeholder', function(e) {
          base.checkForEmpty(e);
        });

        // Check for parent forms
        var forms = document.getElementsByTagName('form');
        for(var f = 0; f < forms.length; f++) {
          if(forms[f]) {
            // Check if the current input is a child of that form
            var children = forms[f].children;
            if ($.inArray(base.field, children) >= 0) {
              forms[f].onsubmit = function() {
                base.clearPlaceholdersOnSubmit(this);
              }
            } 
          }
        }
      }; //end base.init

      base.fadeOnFocus = function(e){
        if (base.$field.val() == base.options.placeholder) {
          base.setCaret(e);
          base.setColor(base.options.focus);
        }
      };

      base.setColor = function(colorOption){
        base.$field.stop().animate({ color: colorOption }, base.options.fadeDuration);
      };
            
      // If the value is empty show the placeholder, otherwise set the color to normal.
      base.checkForEmpty = function(e){
        if(base.$field.val() == ""){
          //Do not pass in "e" event or input will be unblurrable in Chrome
          base.restorePlaceHolder();
        }
        base.setColor(base.options.normal);
      };
      
      //Restore the focused placeholder if the input value is not equal to the placeholder (empty).
      base.restorePlaceHolder = function(e){
        if (base.$field.val() != base.options.placeholder) {
          base.$field.css('color',base.options.focus).val(base.options.placeholder);
          base.setCaret(e);
          base.hideOnChange(e);
        }
      };

      //Hide the placeholder and set the color to normal when you start typing - Skip Shift and Tab.
      base.hideOnChange = function(e){
        if (typeof (e) != 'undefined') {
          if (!(e.shiftKey && e.keyCode == 16) && e.keyCode != 9) {
            if (base.$field.val() == base.options.placeholder) {
              base.$field.css('color',base.options.normal).val('');
            }
          }
        }
      };

      //Set the caret to position 0 when showing the placeholder.
      base.setCaret = function (e) {
        if (base.$field.val() == base.options.placeholder) {

          if(base.field.setSelectionRange) {
            base.field.setSelectionRange(0,0);
          }
          else if(base.field.createTextRange) {
            var range = base.field.createTextRange();
            range.collapse(true);
            range.moveEnd('character', 0);
            range.moveStart('character', 0);
            range.select();
          }
          
          if (typeof (e) != 'undefined') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }
      };

      //By default (in Chrome), tabbing from one field to the next selects the entire input, nullifying the fade out effect.
      //Deselect any current selection range.
      base.removeSelectedRange = function(e) {
        if (base.$field.val() == base.options.placeholder) {
          if(window.getSelection) {
            window.getSelection().removeAllRanges();
          }
          else if(document.getSelection) {
            document.getSelection().removeAllRanges();
          }
          else if(document.selection) {
            document.selection.empty();
          }
          base.fadeOnFocus(e);
        }
      };

      //Prevent placeholder text from being submitted in the form.
      base.clearPlaceholdersOnSubmit = function (form) {
        var children = form.children;
        for(var i = 0; i < children.length; i++) {
          if(children[i]) {
            var node = children[i];
            if(node.tagName.toLowerCase() == "input" || node.tagName.toLowerCase() == "textarea") {
              if(node.value == node.getAttribute('placeholder')) {
                node.value = "";
              }
            }
          }
        }
      };
      
      // Run the initialization method
      base.init();
    }
    else {
      return false;
    }
  };

  $.placeholder.defaultOptions = {
    fadeDuration: 300,
    focus: "#d3d3d3",
    normal: "#808080",
    placeholder: "Enter Something..."
  };

  $.fn.placeholder = function(options){
    return this.each(function(){
      (new $.placeholder(this, options));
    });
  };

})(jQuery);
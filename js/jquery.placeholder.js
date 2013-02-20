/*
 * Placeholder jQuery Plugin
 *
 * Author: Wesley Musgrove
 * Date: Feb 2013
 *
 * Description:
 * Placeholder jQuery Plugin for fading out placeholder text on focus instead of clearing it out completely.
 * Clears all placeholders when the form is submitted.
 *
 * Example Usage:
 * 		$(document).ready(function() {
 *      $("input, textarea").placeholder();
 *    });
 *
 * 		<input type="text" id="txtFromCity" name="txtFromCity" value="" placeholder="Moving From ZIP or City & State">
 *		<textarea id="txtArea1" name="txtArea1" placeholder="Placeholder Text..."></textarea>
 * @version 1.0
 */
(function($){

	$.placeholder = function(field, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of each element
 		base.$field = $(field);
		base.field = field;

		// If this input doesn't have a placeholder attribute, don't run any of these event bindings
		if (base.$field.attr('placeholder') > "" && typeof (base.$field.attr('placeholder')) != 'undefined') {

    	base.init = function() {
				// Merge supplied options with default options
      	base.options = $.extend({},$.placeholder.defaultOptions, options);

				base.placeholder = base.$field.attr('placeholder');
				if (base.placeholder > "" && typeof (base.placeholder) != 'undefined') {
      		base.options.placeholder = base.placeholder;
      	}

				// Check if the field is already filled in with the placeholder
				if(base.$field.val() != "" && base.$field.val() == base.options.placeholder) {

				}
				// Check if the field is already filled in with something other than the placeholder
				else if (base.$field.val() != "" && base.$field.val() != base.options.placeholder) {

				}
				// Otherwise, it was empty so fill it with the placeholder
				else {
					base.setColor(base.options.normal);
					base.$field.val(base.options.placeholder);
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
					base.checkForEmpty(true);
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
				.bind('onPropertyChange.placeholder', function() {
					base.checkForEmpty();
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
						
			// Checks for empty as a fail safe. Set blur to true when passing from the blur event
			base.checkForEmpty = function(blurring){
				if(base.$field.val() == ""){
					base.prepForShow();
					base.setColor( blurring ? base.options.normal : base.options.focus );
				}
				else {
					base.setColor(base.options.normal);
				}
			};
			
			base.prepForShow = function(e){
				if (base.$field.val() != base.options.placeholder) {
        	base.$field.val(base.options.placeholder);
        	base.setCaret(e);
					base.setColor(base.options.normal);
					base.hideOnChange(e);
				}
			};

			//Hide the placeholder and set the color to normal when you start typing
			base.hideOnChange = function(e){
				// Skip Shift or Tab
				if (typeof (e) != 'undefined') {
					if (!(e.shiftKey && e.keyCode == 16) && e.keyCode != 9) {
          	if (base.$field.val() == base.options.placeholder) {
            	base.$field.val('');
            	base.setColor(base.options.normal);
          	}
        	}
      	}
			};

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
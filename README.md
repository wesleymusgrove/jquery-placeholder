jquery-placeholder
==================

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

<input type="text" id="txtFromCity" name="txtFromCity" value="" placeholder="Moving From ZIP or City & State">
<textarea id="txtArea1" name="txtArea1" placeholder="Placeholder Text..."></textarea>
// HackMIT Check-In System
// Label is 2 5/16 x 2

var users = [];

(function() {
  $.support.cors = true;
  var MAX_RESULTS = 100;
  var BASE_URL = 'https://my-staging.hackmit.org/api'
  var access_token;

  function printLabel(name, fullname, email, school) {
    try {
      var labelXml = '<?xml version="1.0" encoding="utf-8"?>\
        <DieCutLabel Version="8.0" Units="twips">\
          <PaperOrientation>Landscape</PaperOrientation>\
          <Id>Address</Id>\
          <PaperName>30370 Zip Disk</PaperName>\
          <DrawCommands />\
          <ObjectInfo>\
            <TextObject>\
              <Name>name</Name>\
              <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
              <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
              <LinkedObjectName></LinkedObjectName>\
              <Rotation>Rotation0</Rotation>\
              <IsMirrored>False</IsMirrored>\
              <IsVariable>True</IsVariable>\
              <HorizontalAlignment>Center</HorizontalAlignment>\
              <VerticalAlignment>Middle</VerticalAlignment>\
              <TextFitMode>AlwaysFit</TextFitMode>\
              <UseFullFontHeight>True</UseFullFontHeight>\
              <Verticalized>False</Verticalized>\
              <StyledText>\
                <Element>\
                  <String>name</String>\
                  <Attributes>\
                    <Font Family="Montserrat" Size="18" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                  </Attributes>\
                </Element>\
              </StyledText>\
            </TextObject>\
            <Bounds X="270" Y="192" Width="2790" Height="1152" />\
          </ObjectInfo>\
          <ObjectInfo>\
            <TextObject>\
              <Name>fullname</Name>\
              <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
              <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
              <LinkedObjectName></LinkedObjectName>\
              <Rotation>Rotation0</Rotation>\
              <IsMirrored>False</IsMirrored>\
              <IsVariable>True</IsVariable>\
              <HorizontalAlignment>Center</HorizontalAlignment>\
              <VerticalAlignment>Middle</VerticalAlignment>\
              <TextFitMode>AlwaysFit</TextFitMode>\
              <UseFullFontHeight>True</UseFullFontHeight>\
              <Verticalized>False</Verticalized>\
              <StyledText>\
                <Element>\
                  <String>fullname</String>\
                  <Attributes>\
                    <Font Family="Montserrat" Size="18" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                  </Attributes>\
                </Element>\
              </StyledText>\
            </TextObject>\
            <Bounds X="270" Y="1344" Width="2790" Height="576" />\
          </ObjectInfo>\
          <ObjectInfo>\
            <TextObject>\
              <Name>school</Name>\
              <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
              <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
              <LinkedObjectName></LinkedObjectName>\
              <Rotation>Rotation0</Rotation>\
              <IsMirrored>False</IsMirrored>\
              <IsVariable>True</IsVariable>\
              <HorizontalAlignment>Center</HorizontalAlignment>\
              <VerticalAlignment>Middle</VerticalAlignment>\
              <TextFitMode>AlwaysFit</TextFitMode>\
              <UseFullFontHeight>True</UseFullFontHeight>\
              <Verticalized>False</Verticalized>\
              <StyledText>\
                <Element>\
                  <String>school</String>\
                  <Attributes>\
                    <Font Family="Montserrat" Size="18" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                  </Attributes>\
                </Element>\
              </StyledText>\
            </TextObject>\
            <Bounds X="270" Y="1920" Width="2790" Height="672" />\
          </ObjectInfo>\
          <ObjectInfo>\
            <TextObject>\
              <Name>email</Name>\
              <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
              <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
              <LinkedObjectName></LinkedObjectName>\
              <Rotation>Rotation0</Rotation>\
              <IsMirrored>False</IsMirrored>\
              <IsVariable>True</IsVariable>\
              <HorizontalAlignment>Center</HorizontalAlignment>\
              <VerticalAlignment>Middle</VerticalAlignment>\
              <TextFitMode>AlwaysFit</TextFitMode>\
              <UseFullFontHeight>True</UseFullFontHeight>\
              <Verticalized>False</Verticalized>\
              <StyledText>\
                <Element>\
                  <String>school</String>\
                  <Attributes>\
                    <Font Family="Montserrat" Size="18" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                  </Attributes>\
                </Element>\
              </StyledText>\
            </TextObject>\
            <Bounds X="270" Y="1920" Width="2790" Height="672" />\
          </ObjectInfo>\
        </DieCutLabel>';

      var label = dymo.label.framework.openLabelXml(labelXml);

      label.setObjectText("name", name);
      label.setObjectText("fullname", fullname);
      label.setObjectText("school", school);
      label.setObjectText("email", email);

      // Select printer to print on
      var printers = dymo.label.framework.getPrinters();
      if (printers.length == 0) {
        throw "No DYMO printers are installed. Install DYMO printers.";
      }
      var printerName = "";
      for (var i = printers.length - 1; i >= 0; i--)
      {
        var printer = printers[i];
        if (printer.printerType == "LabelWriterPrinter")
          {
            printerName = printer.name;
            break;
          }
      }

      if (printerName == "") {
        throw "No LabelWriter printers found. Install LabelWriter printer";
      }

      label.print(printerName);
    } catch (e) {
      alert(e.message || e);
    }
  }

  var searchString = '';

  function logCheckin(user_id) {
    $.ajax({
      url: BASE_URL + '/users/' + user_id + '/checkin',
      type: 'POST',
      headers: { 'x-access-token': access_token }
    }).fail(function(data, status) {
      alert('Error saving check-in information to disk. Is the python server running?');
    });
  };

  function isTruthy(str) {
    return str == 't' || str == 'T' || str == 'true' || str == 'True' ||
      str == 'y' || str == 'Y' || str == 'yes' || str == 'Yes';
  };

  function validateInput() {
    return true;
  };

  function checkin(person) {
    var name = $('#form-name').val();
    var legal = $('#form-legal').val();
    var email = $('#form-email').val();
    var school = $('#form-school').val();
    var user_id = $('#form-user-id').val();
    if (name == legal) legal = '';
    printLabel(name, legal, email, school);
    logCheckin(user_id);
  };

  function resetForm() {
    $('#form').addClass('hidden');
    $('#form-name').val('');
    $('#form-legal').val('');
    $('#form-email').val('');
    $('#form-school').val('');
    $('#swag').text('');
    $('#shirt-size').text('');
    $('#laptop').text('');
    $('#forms').text('');
  };

  function reset() {
    resetForm();
    searchString = '';
    updateSearch();
  };

  function search() {
    if (searchString == '') return [];
    var queries = $.grep(searchString.toLowerCase().split(/[ ,]+/), function(query) {
      return query != '';
    });
    return $.grep(users, function(elem) {
      for (var i = 0; i < queries.length; i++) {
        var name = elem.profile && elem.profile.name;
        var school = elem.profile && elem.profile.school;
        var terms = [];
        if (name != undefined) terms = terms.concat(name.toLowerCase().split(/[ ,]+/));
        if (school != undefined) terms = terms.concat(school.toLowerCase().split(/[ ,]+/));
        var contains = false;
        for (var j = 0; j < terms.length; j++) {
          if (terms[j].indexOf(queries[i]) != -1) contains = true;
        }
        if (contains == false) return false;
      }
      return true;
    });
  };

  function updateSearch() {
    var sb = $('#searchbox');
    sb.text(searchString);
    var res = $('#results');
    if (searchString == '') {
      res.empty();
    } else {
      matches = search();
      res.empty();
      for (var i = 0; i < matches.length && i < MAX_RESULTS; i++) {
        var match = matches[i];
        var name = escapeHtml(match.profile.name);
        var school = escapeHtml(match.profile.school);
        var contents = name + ' - ' + school;
        var node = $('<li>' + contents + '</li>');
        node.data('match', match);
        res.append(node);
      }
      var children = res.children();
      if (children.length > 0) {
        $(children[0]).addClass('selected');
      }
    }
  };

  function getUsers() {
    $.ajax({
      url: BASE_URL + '/users',
      type: 'GET',
      headers: { 'x-access-token': access_token },
      success:function(data) {
        users = data;
        console.log("Fetched users successfully")
      }
    }).fail(function(data, status) {
      alert('Error retrieving users. Did you enter the correct access token?');
    });
  }

  function promptAccessToken() {
    access_token = prompt("Please enter access token");
  }

  $(document).on('keydown', function(e) {
    if (e.which == 8) {
      //BACKSPACE
      //Disables going back a page
      e.preventDefault();
    }
  });

  $(document).on('keypress', function(e) {
    if (e.which == 13) {
      // ENTER
      if (!formSelected()) {
        var selected = $('.selected');
        if (selected.length > 0) {
          var match = $(selected[0]).data('match');
          $('#form').removeClass('hidden');
          var name = match.profile.name;
          var nameParts = $.grep(name.split(/[ ,]+/), function(part) {
            return part != '';
          });
          $('#form-name').val(nameParts[0] || '');
          $('#form-legal').val(name);
          var user_id = match.id
          $('#form-user-id').val(user_id);
          var school = match.profile.school;
          var parenLoc = school.indexOf('(');
          if (parenLoc != -1) {
            school = school.slice(0, parenLoc - 1);
          }
          $('#form-email').val(match.email)
          $('#form-school').val(school);
          if (match.learnathon) {
            $('#swag').text('Day 1 Swag Recipient');
          } else {
            $('#swag').text('Day 2 Swag Recipient');
          }
          $('#shirt-size').text('Shirt Size: ' + match.size);
          if (!match.laptop) {
            $('#laptop').text('Laptop Recipient');
          }
          if (!match.forms) {
            $('#forms').text('Warning: no forms!');
          }
          $('#form-name').focus();
        }
      } else {
        var selected = $('.selected');
        if (validateInput()) {
          checkin($(selected[0]).data('match') || {});
          reset();
        }
      }
    } else if (!formSelected()) {
      var c = String.fromCharCode(e.which);
      searchString = searchString.concat(c);
      updateSearch();
    }
  });

  function formSelected() {
    return $('#form-name').is(':focus') ||
      $('#form-legal').is(':focus') ||
      $('#form-email').is(':focus') ||
      $('#form-school').is(':focus');
  };

  $(document).on('keydown', function(e) {
    if (e.which == 8 && !formSelected()) {
      // BACKSPACE
      searchString = searchString.slice(0, -1);
      updateSearch();
    } else if (e.which == 27) {
      // ESCAPE
      if (!formSelected()) {
        reset();
      } else {
        $(':focus').blur();
        resetForm();
      }
    } else if (e.which == 40 && !formSelected()) {
      // DOWN ARROW
      var curr = $('.selected');
      var next = curr.next();
      if (next.length > 0) {
        curr.removeClass('selected');
        next.addClass('selected');
      }
    } else if (e.which == 38 && !formSelected()) {
      // UP ARROW
      var curr = $('.selected');
      var prev = curr.prev();
      if (prev.length > 0) {
        curr.removeClass('selected');
        prev.addClass('selected');
      }
    } else if (e.which == 39 && !formSelected()) {
      // RIGHT ARROW
      reset();
      $('#form').removeClass('hidden');
      $('#form-name').focus();
    }
  });

  $(document).ready(function() {
    while (access_token == null) {
      promptAccessToken();
    }
    getUsers();
    reset();
  });

  function escapeHtml(string) {
    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    };
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  };
} ());

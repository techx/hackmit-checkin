// HackMIT Check-In System
// Label is 2 5/16 x 2

(function() {
  $.support.cors = true;
  var MAX_RESULTS = 100;
  var MAX_LUGGAGE = 5;

  function printLabel(name, fullname, organization, sponsor) {
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
              <Name>organization</Name>\
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
                  <String>organization</String>\
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
              <Name>sponsor</Name>\
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
                  <String>sponsor</String>\
                  <Attributes>\
                    <Font Family="Montserrat" Size="18" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
                    <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                  </Attributes>\
                </Element>\
              </StyledText>\
            </TextObject>\
            <Bounds X="270" Y="2496" Width="2790" Height="384" />\
          </ObjectInfo>\
        </DieCutLabel>';

      var label = dymo.label.framework.openLabelXml(labelXml);

      label.setObjectText("name", name);
      label.setObjectText("fullname", fullname);
      label.setObjectText("organization", organization);
      label.setObjectText("sponsor", sponsor ? 'SPONSOR' : '');

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

  function logCheckin(person, name, legal, organization, luggage, sponsor) {
    var log = {
      database: person,
      printed: {
        name: name,
        legal: legal,
        organization: organization,
        sponsor: sponsor,
        luggage: luggage,
        time: (new Date()).toString()
      }
    };
    $.ajax({
      url: 'http://localhost:31337',
      type: 'POST',
      data: {
        json: JSON.stringify(log)
      }
    }).fail(function(data, status) {
      alert('Error saving check-in information to disk. Is the python server running?');
    });
  };

  function isTruthy(str) {
    return str == 't' || str == 'T' || str == 'true' || str == 'True' ||
      str == 'y' || str == 'Y' || str == 'yes' || str == 'Yes';
  };

  function validateInput() {
    var luggage = $('#form-luggage').val();
    if (!(/^\d+$/.test(luggage))) {
      alert('Invalid number for luggage (must be an integer)');
      return false;
    }
    return true;
  };

  function checkin(person) {
    var name = $('#form-name').val();
    var legal = $('#form-legal').val();
    var organization = $('#form-organization').val();
    var luggage = $('#form-luggage').val();
    var sponsor = (person.sponsor == '1') || isTruthy($('#form-sponsor').val());
    if (name == legal) legal = '';
    printLabel(name, legal, organization, sponsor);
    var numTags = parseInt(luggage);
    if (numTags < 0) numTags = 0;
    if (numTags > MAX_LUGGAGE) {
      alert('Max luggage count exceeded. Printing ' + MAX_LUGGAGE + ' tags.');
      numTags = MAX_LUGGAGE;
    }
    for (var i = 0; i < numTags; i++) {
      printLabel(legal || name, person.email_address || '', person.phone_number || '', false);
    }
    logCheckin(person, name, legal, organization, luggage, sponsor);
  };

  function resetForm() {
    $('#form').addClass('hidden');
    $('#form-name').val('');
    $('#form-legal').val('');
    $('#form-organization').val('');
    $('#form-luggage').val('0');
    $('#form-sponsor').val('');
    $('#card').text('');
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
    return $.grep(personData, function(elem) {
      for (var i = 0; i < queries.length; i++) {
        var terms = elem.badge_name.toLowerCase().split(/[ ,]+/)
          .concat(elem.legal_waiver.toLowerCase().split(/[ ,]+/))
          .concat(elem.organization.toLowerCase().split(/[ ,]+/));
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
        var name = escapeHtml(match.badge_name);
        var organization = escapeHtml(match.organization);
        var legal = escapeHtml(match.legal_waiver);
        var email = escapeHtml(match.email_address);
        var contents = name + ' (' + email + ') - ' + organization;
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

  $(document).on('keypress', function(e) {
    if (e.which == 13) {
      // ENTER
      if (!formSelected()) {
        var selected = $('.selected');
        if (selected.length > 0) {
          var match = $(selected[0]).data('match');
          $('#form').removeClass('hidden');
          var badgeName = match.badge_name;
          var nameParts = $.grep(badgeName.split(/[ ,]+/), function(part) {
            return part != '';
          });
          $('#form-name').val(nameParts[0] || '');
          $('#form-legal').val(match.legal_waiver);
          var organization = match.organization;
          var parenLoc = organization.indexOf('(');
          if (parenLoc != -1) {
            organization = organization.slice(0, parenLoc - 1);
          }
          $('#form-organization').val(organization);
          if (match.dietary_restriction == '1') {
            $('#card').text('TechCash Card Recipient');
          }
          $('#form-sponsor').val(match.sponsor == '1' ? 'Yes' : 'No');
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
      $('#form-organization').is(':focus') ||
      $('#form-luggage').is(':focus') ||
      $('#form-sponsor').is(':focus');
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
    reset();
  });

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  };
} ());

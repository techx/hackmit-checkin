// HackMIT Check-In System
// Label is 2 5/16 x 2

(function() {
  $.support.cors = true;
  var MAX_RESULTS = 100;
  var RETRY_INTERVAL = 10000; //Amount of time (ms) between checking for failed checkins
  var FETCH_INTERVAL = 300000; // five minutes
  var BASE_URL = 'https://my-staging.hackmit.org/api';

  // LocalStorage as DB
  // ------------------------------------
  window.userDB = {};
  var localDB = {};

  localDB.set = function(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  };

  localDB.get = function(key) {
    if (localStorage[key]){
      try {
        return JSON.parse(localStorage[key]);
      } catch (e) {
        return localStorage[key];
      }
    }
  };

  userDB.setToken = function(token) {
    localDB.set('jwt', token);
  };

  userDB.getToken = function() {
    return localDB.get('jwt');
  };

  userDB.getUsers = function() {
    return localDB.get('DB_users') || [];
  };

  userDB.setUsers = function(users) {
    localDB.set('DB_users', users);
    localDB.set('DB_users_lastUpdated', Date.now());
  };

  userDB.updateUser = function(user) {
    // Could be more efficient, but whatever.
    var users = userDB.getUsers();
    userDB.setUsers(users.map(function(u){
      if (u._id === user._id) {
        u = user;
      }
      return u;
    }));
  };

  userDB.getQueue = function() {
    return localDB.get('DB_queue') || {};
  };

  userDB.addToQueue = function(id) {
    var queue = localDB.get('DB_queue') || {};
    queue[id] = true;
    localDB.set('DB_queue', queue);
  };

  userDB.removeFromQueue = function(id) {
    // Skip if nobody in the queue.
    var queue = localDB.get('DB_queue') || {};
    if (!queue[id]) {
      return;
    }
    delete queue[id];
    localDB.set('DB_queue', queue);
  };

  userDB.updateQueue = function() {
    // Attempt to reconsolidate the items in the queue.
    var queue = localDB.get('DB_queue') || {};
    Object.keys(queue).forEach(function(key){
      postCheckin(key);
    });
  };

  userDB.isStale = function() {
    var timeToStale = 300000;
    if (!localStorage.DB_users_lastUpdated) {
      return true;
    } else {
      return Date.now() > parseInt(localStorage.DB_users_lastUpdated) + timeToStale;
    }
  };

  function postCheckin(user_id) {
    $.ajax({
      url: BASE_URL + '/users/' + user_id + '/checkin',
      type: 'POST',
      headers: { 'x-access-token': userDB.getToken() },
      success: function(data) {
        userDB.updateUser(data);
        userDB.removeFromQueue(data._id);
      }
    }).fail(function(data, status) {
      userDB.addToQueue(user_id);
    });
  }

  // ------------------------------------
  var failed_user_ids = []; //Stores failed checkin users' ids

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
            <Bounds X="270" Y="2496" Width="2790" Height="384" />\
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
    var userId = $('#form-user-id').val();
    if (name == legal) legal = '';
    printLabel(name, legal, email, school);
    postCheckin(userId); //Sends checkin to server
  };

  function resetForm() {
    $('#form').addClass('hidden');
    $('#form-name').val('');
    $('#form-legal').val('');
    $('#form-email').val('');
    $('#form-school').val('');
    $('#shirt-size').text('');
    $('#admitted').text('');
    $('#confirmed').text('');
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
    var users = userDB.getUsers();
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

  function fetchUsers() {
    if (!userDB.isStale()) {
      return userDB.getUsers();
    } else {
      var loadingMessage = $('#loading');
      loadingMessage.removeClass('hidden');
      $.ajax({
        url: BASE_URL + '/users',
        type: 'GET',
        headers: { 'x-access-token': userDB.getToken() },
        success:function(data) {
          loadingMessage.addClass('hidden');
          userDB.setUsers(data.filter(function(user){
            return user.verified;
          }));
          console.log("Fetched users successfully");
        }
      }).fail(function(data, status) {
        loadingMessage.addClass('hidden');
        alert('Error retrieving users. Did you enter the correct access token?');
      });
    }
  }

  function promptAccessToken() {
    userDB.setToken(prompt("Please enter access token"));
  }

  function checkFailedCheckin() {
    userDB.updateQueue();
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
          var shirt_size = match.confirmation.shirtSize
          if (!shirt_size) {
            $('#shirt-size').text('Shirt Size: Not Provided');
          } else {
            $('#shirt-size').text('Shirt Size: ' + shirt_size);
          }

          var admitted = match.status.admitted
          $('#admitted')
            .text('Admitted: ' + (admitted ? 'TRUE' : 'FALSE'))
            .removeClass()
            .addClass(admitted ? 'info' : 'warning');

          var confirmed = match.status.confirmed
          $('#confirmed')
            .text('Confirmed: ' + (confirmed ? 'TRUE' : 'FALSE'))
            .removeClass()
            .addClass(confirmed ? 'info' : 'warning');

          var checkedIn = match.status.checkedIn
          $('#checked-in')
            .text('Checked In: ' + (checkedIn ? 'TRUE' : 'FALSE'))
            .removeClass()
            .addClass(checkedIn ? 'info' : 'warning');

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
    if (!userDB.getToken()){
      promptAccessToken();
    }
    setInterval(checkFailedCheckin, RETRY_INTERVAL);
    setInterval(fetchUsers, FETCH_INTERVAL);
    fetchUsers();
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

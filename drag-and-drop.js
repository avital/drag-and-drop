Notes = new Meteor.Collection("notes");

/// CLIENT CODE
if (Meteor.isClient) {
  Template.allNotes.notes = function () {
    return Notes.find();
  };

  Template.draggableNote.events({
    'mousedown .note': function (evt, tmpl) {
      Session.set("activeNote", this._id);
      Session.set("offsetX", evt.pageX - parseInt(tmpl.find('.note').style.left, 10));
      Session.set("offsetY", evt.pageY - parseInt(tmpl.find('.note').style.top, 10));
    },

    'mouseup .note': function () {
      Session.set("activeNote", undefined);
    }
  });

  Template.allNotes.events({
    'mousemove': function (evt) {
      if (Session.get("activeNote")) {
        Notes.update(Session.get("activeNote"), {$set: {
          top: evt.pageY - Session.get("offsetY"),
          left: evt.pageX - Session.get("offsetX")
        }});
      }
    }
  });
}

/// SERVER CODE
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Notes.find().count() === 0) {
      Notes.insert({top: 100, left: 50});
      Notes.insert({top: 200, left: 300});
    }
  });
}

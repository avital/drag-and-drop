Meteor.methods({
  updateNote: function (id, top, left) {
    TransientNotes.update(id, {$set: {top: top, left: left}});
  }
});

/// CLIENT CODE
if (Meteor.isClient) {
  TransientNotes = new Meteor.Collection("transientNotes");
  Meteor.subscribe("transientNotes");

  Template.allNotes.notes = function () {
    return TransientNotes.find();
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
        Meteor.call(
          "updateNote",
          /*id=*/ Session.get("activeNote"),
          /*top=*/ evt.pageY - Session.get("offsetY"),
          /*left=*/ evt.pageX - Session.get("offsetX"));
      }
    }
  });
}

/// SERVER CODE
if (Meteor.isServer) {
  TransientNotes = new Meteor.Collection("transientNotes", {connection: null});
  Meteor.publish("transientNotes", function () {
    return TransientNotes.find();
  });

  Meteor.startup(function () {
    if (TransientNotes.find().count() === 0) {
      TransientNotes.insert({top: 100, left: 50});
      TransientNotes.insert({top: 200, left: 300});
    }
  });
}

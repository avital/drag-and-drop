Notes = new Meteor.Collection("notes");

Meteor.methods({
  updateNote: function (id, top, left) {
    if (TransientNotes.findOne(id))
      TransientNotes.update(id, {$set: {top: top, left: left}});
    else
      TransientNotes.insert({_id: id, top: top, left: left});
  }
});

/// CLIENT CODE
if (Meteor.isClient) {
  TransientNotes = new Meteor.Collection("transientNotes");
  Meteor.subscribe("transientNotes");

  Template.allNotes.notes = function () {
    return Notes.find();
  };

  Template.draggableNote.helpers({
    top: function () {
      var transientNote = TransientNotes.findOne(this._id);
      if (transientNote)
        return transientNote.top;
      else
        return this.top;
    },
    left: function () {
      var transientNote = TransientNotes.findOne(this._id);
      if (transientNote)
        return transientNote.left;
      else
        return this.left;
    }
  });

  Template.draggableNote.events({
    'mousedown .note': function (evt, tmpl) {
      Session.set("activeNote", this._id);
      Session.set("offsetX", evt.pageX - parseInt(tmpl.find('.note').style.left, 10));
      Session.set("offsetY", evt.pageY - parseInt(tmpl.find('.note').style.top, 10));
    },

    'mouseup .note': function () {
      var id = Session.get("activeNote");
      Notes.update(id, TransientNotes.findOne(id));
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
    if (Notes.find().count() === 0) {
      Notes.insert({top: 100, left: 50});
      Notes.insert({top: 200, left: 300});
    }
  });
}

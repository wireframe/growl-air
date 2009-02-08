/*
  Usage:
  new Notification("My Sweet Message");
*/
Notification = Class.create({
  initialize: function(title) {
    this.messageTitle = title;
    var visibleBounds = air.Screen.mainScreen.visibleBounds;

  	var margin = 10;
  	var height = 200;
  	var width = 400;
  	var top = visibleBounds.y + margin;
  	var left = visibleBounds.right - width - margin;
  	var bounds = new air.Rectangle(left, top, width, height);

  	var options = new air.NativeWindowInitOptions();
  	options.type = air.NativeWindowType.LIGHTWEIGHT;
  	options.transparent = true;
  	options.systemChrome = air.NativeWindowSystemChrome.NONE;

    var visible = false;
    var scrollbars = false;
  	this.htmlLoader = air.HTMLLoader.createRootWindow(visible, options, scrollbars, bounds);
  	this.htmlLoader.addEventListener(air.Event.COMPLETE, this.load.bind(this));
    this.htmlLoader.paintsDefaultBackground = false;
  	this.htmlLoader.load(new air.URLRequest("growl-air.html"));
  },
  load: function() {
    if (this.started) {
      return;
    }
    this.started = true;

    this.notificationWindow = this.htmlLoader.window;
    this.nativeWindow = this.htmlLoader.stage.nativeWindow;

    this.notificationWindow.document.getElementById('title').innerHTML = this.messageTitle;

    //Adjust the height in order to have the whole message inside
 		this.nativeWindow.height = this.notificationWindow.document.height;
  	this.htmlLoader.window.opener = window;

  	this.nativeWindow.visible = true;
    this.fadeIn();
    setTimeout(this.fadeOut.bind(this), 2000);
		window.addEventListener('unload', this.close.bind(this));
  },
  close: function() {
    if (this.htmlLoader) {
      this.nativeWindow.close();
      this.htmlLoader = null;
    }
  },
	fadeIn: function() {
    with (this.notificationWindow) {
      $('message').appear({duration: 1});
    }
	},
	fadeOut: function(callback){
    with (this.notificationWindow) {
         $('message').fade({duration: 1, afterFinish: this.close.bind(this)});
    }
	}
});

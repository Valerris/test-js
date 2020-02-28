(function() {
	// var sideNav = document.querySelector(".side-nav");

	// sideNav.addEventListener("click", function(e) {
	// 	var action = e.target.dataset.sidenavAction;

	// 	if (action !== "close") return;

	// 	document.body.classList.remove("sideNav-opened");
	// });

	// sideNavMain = sideNav.querySelector(".side-nav__main");

	// var pressed = false;

	// sideNavMain.addEventListener("pointerdown", function(e) {
	// 	this.setPointerCapture(e.pointerId);
	// 	pressed = true;
	// });

	// sideNavMain.addEventListener("pointermove", function(e) {
	// 	this.setPointerCapture(e.pointerId);
	// 	pressed = true;
	// });

	var _sidenav = (_sidenavMain = _linksList = _links = _paddingRight = null);

	function _create(options) {
		var sidenav = document.createElement("div");
		sidenav.className = "side-nav";
		sidenav.innerHTML = `
    <div class="backdrop" data-sidenav-action="close"></div>
    <div class="side-nav__main" touch-action="none">
      <div class="side-nav__header">
        <div class="side-nav__title">${
					options.title ? options.title : null
				}</div>
        <button class="side-nav__close" data-sidenav-action="close">
          Close
        </button>
      </div>
      <div class="side-nav__body">
        <ul class="side-nav__items">
        </ul>
      </div>
      <div class="side-nav__footer">
        <div class="side-nav__description">
          ${options.description ? options.description : null}
        </div>
      </div>
    </div>
    `;

		_sidenavMain = sidenav.querySelector(".side-nav__main");

		_linksList = sidenav.querySelector(".side-nav__items");

		options.links && (_links = _createLinks(options.links));

		_links.forEach(link => {
			_linksList.append(link);
		});

		return sidenav;
	}

	function _createLinks(links) {
		return links.map(function(link) {
			var li = document.createElement("li");
			li.className = "side-nav__item";
			li.innerHTML = `<a href="${link.href}">${link.text}</a>`;
			return li;
		});
	}

	function close() {
		_sidenav && document.body.classList.remove("sideNav-opened");
	}

	function open() {
		document.body.classList.add("sideNav-opened");
		document.body.style.paddingRight = _paddingRight + "px";
	}

	function _pos(e) {
		if (e.touches && e.touches.length >= 1) {
			return e.touches[0].clientX;
		}

		return e.clientX;
	}

	function _updatePos(offset) {
		requestAnimationFrame(function() {
			_sidenavMain.style.transform = `translateX(${offset}px)`;
		});
	}

	function _resetPos() {
		requestAnimationFrame(function() {
			_sidenavMain.style.transform = null;
		});
	}

	var gesture = {
		startPos: 0,
		pos: 0,
		delta: 0,
		pressed: false
	};

	function _tapHandler(e) {
		e.preventDefault();

		this.style.transition = "none";

		this.setPointerCapture(e.pointerId);

		gesture.pressed = true;

		gesture.pos = _pos(e);

		this.addEventListener("pointermove", _dragHandler, { passive: false });
		this.addEventListener("pointerup", _releaseHandler, { passive: false });
		this.addEventListener("pointercancel", _releaseHandler, { passive: false });
	}

	function _dragHandler(e) {
		if (!gesture.pressed) return;

		var currentPos = _pos(e);

		gesture.delta = currentPos - gesture.pos;

		_updatePos(gesture.startPos + gesture.delta);
	}

	function _releaseHandler(e) {
		if (!gesture.pressed) return;

		this.style.transition = null;

		gesture.pressed = false;

		_resetPos();

		gesture.delta < -50 ? close() : open();

		this.removeEventListener("pointermove", _dragHandler);
		this.removeEventListener("pointerup", _releaseHandler);
		this.removeEventListener("pointercancel", _releaseHandler);
	}

	function _closeHandler(e) {
		e.target.dataset && e.target.dataset.sidenavAction === "close" && close();
		document.body.style.paddingRight = null;
	}

	function _initHandlers() {
		_sidenav.addEventListener("click", _closeHandler);
		_sidenavMain.addEventListener("pointerdown", _tapHandler, {
			passive: false
		});
	}

	function init(container = document.body, options = {}) {
		_sidenav = _create(options);

		_initHandlers();

		_paddingRight = innerWidth - document.documentElement.clientWidth;

		container.append(_sidenav);
	}

	var $sidenav = {
		init: init,
		open: open,
		close: close
	};

	if (!window.$sidenav) {
		window.$sidenav = $sidenav;
	} else {
		window.$sidenav = Object.assign(window.$sidenav, $sidenav);
	}
})();

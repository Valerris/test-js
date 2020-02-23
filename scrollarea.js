(function() {
	var _scrollarea = (_scrollareaContent = _thumb = null);
	var _scrollTop = (_min = _max = 0),
		_ratio = (_y = _target = null),
		_pressed = true;

	function _create(options) {
		var scrollarea = document.createElement("div");
		scrollarea.className = "scrollarea";

		scrollarea.insertAdjacentHTML(
			"beforeend",
			`<div class="scrollarea__viewport">
    <div class="scrollarea__thumb"></div>
    <div class="scrollarea__content">
      ${options.content ? options.content : ""}
    </div>
  </div>`
		);

		return scrollarea;
	}

	function _yPos(e) {
		if (e.touches && e.touches.length >= 1) {
			return e.touches[0].clientY;
		}
		return e.clientY;
	}

	function _scroll(offset) {
		_scrollTop = offset > _max ? _max : offset < _min ? _min : offset;

		(_scrollareaContent.style.transform = `translateY(-${_scrollTop /
			_ratio}px)`) && (_thumb.style.transform = `translateY(${_scrollTop}px)`);
	}

	function _tap(e) {
		e.preventDefault();
		_target = e.target;
		_pressed = true;

		_target === _thumb && _thumb.classList.add("tapped");

		_y = _yPos(e);

		if (e.type === "mousedown") {
			document.addEventListener("mousemove", _drag, {
				passive: false
			});
			document.addEventListener("mouseup", _release, {
				passive: false
			});
		} else if (e.type === "touchstart") {
			_target.addEventListener("touchmove", _drag, {
				passive: false
			});
			_target.addEventListener("touchend", _release, {
				passive: false
			});
		} else if (e.type === "pointerdown") {
			document.addEventListener("pointermove", _drag, {
				passive: false
			});
			document.addEventListener("pointerup", _release, {
				passive: false
			});
		}
	}

	function _drag(e) {
		e.preventDefault();
		if (!_pressed) return;
		var y0 = _yPos(e);
		var delta = _y - y0;

		delta =
			_target === _scrollareaContent
				? delta
				: _target === _thumb
				? -delta
				: null;

		if (delta > 2 || delta < -2) {
			_scroll(_scrollTop + delta);
			_y = y0;
		}
	}

	function _release(e) {
		_thumb.classList.contains("tapped") && _thumb.classList.remove("tapped");

		if (e.type === "mouseup") {
			document.removeEventListener("mousemove", _drag);
			document.removeEventListener("mouseup", _release);
		} else if (e.type === "touchend") {
			_target.removeEventListener("mousemove", _drag);
			_target.removeEventListener("mouseup", _release);
		} else if (e.type === "pointerup") {
			document.removeEventListener("pointermove", _drag);
			document.removeEventListener("pointerup", _release);
		}

		_pressed = false;
		_target = null;
	}

	function _maxAndRatio() {
		_max =
			_scrollarea.offsetHeight -
			_thumb.offsetHeight -
			parseInt(getComputedStyle(_thumb).top) * 2;

		_ratio =
			_max / (_scrollareaContent.scrollHeight - _scrollarea.offsetHeight);
	}

	function _wheelHandler(e) {
		e.preventDefault();
		e.stopPropagation();
		_target = e.target;

		_scroll(_scrollTop + e.deltaY * 10);
	}

	function _initHandlers() {
		_scrollareaContent.addEventListener("mousedown", _tap, {
			passive: false
		});
		_thumb.addEventListener("mousedown", _tap, {
			passive: false
		});
		_scrollareaContent.addEventListener("wheel", _wheelHandler, {
			passive: false
		});

		if ("onpointerdown" in document) {
			_scrollareaContent.addEventListener("pointerdown", _tap, {
				passive: false
			});
			_thumb.addEventListener("pointerdown", _tap, {
				passive: false
			});
		} else if ("ontouchstart" in document) {
			_scrollareaContent.addEventListener("touchstart", _tap, {
				passive: false
			});
			_thumb.addEventListener("touchstart", _tap, {
				passive: false
			});
		}
	}

	function _removeHandlers() {
		_scrollareaContent.removeEventListener("mousedown", _tap);
		_thumb.removeEventListener("mousedown", _tap);
		_scrollareaContent.removeEventListener("wheel", _wheelHandler);

		if ("onpointerdown" in document) {
			_scrollareaContent.removeEventListener("pointerdown", _tap);
			_thumb.removeEventListener("pointerdown", _tap);
		} else if ("ontouchstart" in document) {
			_scrollareaContent.removeEventListener("touchstart", _tap);
			_thumb.removeEventListener("touchstart", _tap);
		}
	}

	function destroy() {
		_removeHandlers();
		console.log("Handlers have been removed.");

		_scrollarea.remove();
		console.log("Scrollarea has been removed.");
	}

	function init(container = document.body, options) {
		_scrollarea = _create(options);

		container.append(_scrollarea);

		_scrollareaContent = _scrollarea.querySelector(".scrollarea__content");
		_thumb = _scrollarea.querySelector(".scrollarea__thumb");

		_thumb.style.height =
			(_scrollareaContent.scrollHeight / _scrollarea.offsetHeight) * 3 + "rem";

		_maxAndRatio();

		_initHandlers();
	}

	$scrollarea = {
		init: init,
		destroy: destroy
	};

	if (!window.$scrollarea) {
		window.$scrollarea = $scrollarea;
	} else {
		window.$scrollarea = Object.assign(window.$scrollarea, $scrollarea);
	}
})();

(function() {
	// var style = document.createElement("style");
	// style.type = "text/css";
	// style.textContent =
	// 	".backdrop { position: absolute; top: 0; left: 0; width: 100%; height: 100%;background-color: rgba(255,255,255,0.9); } .modal-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; min-height: 100%; z-index: 99999; overflow-x: hidden; overflow-y: auto; display: none; opacity: 0; transition: opacity 0.25s ease; } .modal-opened .modal-container--block { display: block; pointer-events: auto; } .modal-opened modal-container--visible { opacity: 1; } .modal-wrapper { position: relative; width: 100%; min-height: 100%; display: flex; justify-content: center; align-items: center; } .modal { position: relative; max-width: 32rem; min-width: 25rem; margin: 3rem auto;padding:1.75rem 1.5rem;border-radius: 0.25rem;background-color:  #cfcfcf; z-index: 1; } button { cursor: pointer; } .modal__close { appearance: none; -webkit-appearance: none; position: absolute; top: -3rem; right: 0; width: 2.5rem; height: 2.5rem; border: none; background: none; line-height: 0.1; text-indent: -9999px; background-image: url('./cross-rounded.svg'); background-repeat: no-repeat; background-size: cover; background-position: center; } @media (min-width: 40em) { .modal__close { top: 0; right: -3rem; } } .modal__close::before { content: '';position: absolute; top: -0.5rem; left: -0.5rem; right: -0.5rem; bottom: -0.5rem; } .modal__body { margin: 0 0 1.25rem; } .modal__body:last-child { margin:0; } .modal-opened { overflow: hidden; pointer-events: none; }";

	// document.head.appendChild(style) ||
	// 	document.getElementsByTagName("head")[0].appendChild(style);

	var _modal = (_modalBody = _paddingRight = _buttons = _handlers = null);

	function _create(options) {
		var modalC = document.createElement("div");
		modalC.className = "modal-container";

		modalC.insertAdjacentHTML(
			"beforeend",
			`<div class="modal-wrapper">
			<div class="backdrop" data-modal-control="close"></div>
			<div class="modal">
				<button class="modal__close" data-modal-control="close"></button>
				<div class="modal__body">
					${options.content ? options.content : ""}
        </div>
			</div>
		</div>`
		);

		_modalBody = modalC.querySelector(".modal__body");

		options.buttons && (_buttons = _createButtons(options.buttons));
		_buttons.reverse().forEach(el => {
			_modalBody.insertAdjacentElement("afterend", el);
		});

		console.log("Modal has been created");

		return modalC;
	}

	function open() {
		if (!_modal) return;
		document.body.classList.add("modal-opened");
		_modal.classList.add("modal-container--block");
		setTimeout(function() {
			_modal.classList.add("modal-container--visible");
		}, 70);
		document.body.style.paddingRight = _paddingRight + "px";
	}

	function close() {
		if (!_modal) return;

		_modal.classList.remove("modal-container--visible");
		setTimeout(function() {
			_modal.classList.remove("modal-container--block");
			document.body.classList.remove("modal-opened");
			document.body.style.paddingRight = 0;
		}, 350);
	}

	function setContent(content) {
		_modalBody && (_modalBody.innerHTML = content);
	}

	function _initHandlers() {
		_modal.addEventListener("click", _closeHandler);

		_handlers.push({
			elem: _modal,
			type: "click",
			func: _closeHandler
		});
	}

	function _closeHandler(e) {
		e.target.dataset && e.target.dataset.modalControl === "close" && close();
	}

	function _createButtons(btns) {
		if (!btns) return;

		return btns.map(function(btn) {
			var button = document.createElement("button");
			button.className = "button" + (btn.className ? " " + btn.className : "");
			button.textContent = btn.text ? btn.text : "Click";
			button.addEventListener("click", btn.handler ? btn.handler : null);

			btn.handler &&
				_handlers.push({
					elem: button,
					type: "click",
					func: btn.handler
				});

			return button;
		});
	}

	function destroy() {
		close();

		_removeHandlers();

		_modal.remove();
		console.log("Modal has been removed.");
	}

	function _removeHandlers() {
		_handlers.forEach(function(handler) {
			handler.elem.removeEventListener(handler.type, handler.func);
		});

		console.log("Handlers have been removed.");
	}

	function init(container = document.body, options = {}) {
		_handlers = [];

		_modal = _create(options);

		_paddingRight = innerWidth - document.documentElement.clientWidth;

		_modal.firstElementChild.style.paddingRight = _paddingRight + "px";

		_initHandlers();

		container.append(_modal);
	}

	var $modal = {
		init: init,
		open: open,
		close: close,
		setContent: setContent,
		destroy: destroy
	};

	if (!window.$modal) {
		window.$modal = $modal;
	} else {
		window.$modal = Object.assign(window.$modal, $modal);
	}
})();

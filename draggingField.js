(function() {
	var DraggingField;

	function createField(container, options = {}) {
		var field = document.createElement("div");
		field.className = "dragging-field";
		container.append(field);

		var btnsCount = options.buttonsCount;
		var btnW = null;

		if (btnsCount) {
			for (var i = 0; i < btnsCount; i++) {
				var btn = document.createElement("div");
				btn.className = "dragging-field__btn dragging-field__btn--" + (i + 1);
				field.append(btn);
				btnW = btn.offsetWidth;
				btn.style.right = `${i * btnW}px`;
			}
		}

		var content = document.createElement("div");
		content.className = "dragging-field__content";
		content.innerHTML = options.content ? options.content : null;
		field.append(content);

		var nodeState = {
			startPos: 0,
			btnW: btnW
		};

		var currentGesture = null;

		function tap(e) {
			e.preventDefault();

			content.style.transition = "none";

			e.type === "pointerdown" && content.setPointerCapture(e.pointerId);

			currentGesture = {
				startX: e.type === "touchstart" ? e.touches[0].clientX : e.clientX,
				prevX: e.type === "touchstart" ? e.touches[0].clientX : e.clientX,
				prevTs: Date.now(),
				startPos: nodeState.startPos
			};

			content.classList.add("grabbing");

			if (e.type === "mousedown") {
				document.addEventListener("mousemove", drag, { passive: false });
				document.addEventListener("mouseup", release, { passive: false });
				document.addEventListener("mousecancel", release, { passive: false });
			} else if (e.type === "touchstart") {
				document.addEventListener("touchmove", drag, { passive: false });
				document.addEventListener("touchend", release, { passive: false });
				document.addEventListener("touchcancel", release, { passive: false });
			} else if (e.type === "pointerdown") {
				content.addEventListener("pointermove", drag, { passive: false });
				content.addEventListener("pointerup", release, { passive: false });
				content.addEventListener("pointercancel", release, { passive: false });
			}
		}

		function drag(e) {
			e.preventDefault();

			if (!currentGesture) return;

			var { startX, prevX, prevTs, startPos } = currentGesture;

			if (e.type === "touchmove") {
				var { clientX } = e.touches[0];
			} else {
				var { clientX } = e;
			}

			var dx = clientX - startX;

			content.style.transform = `translate(${startPos + dx}px)`;

			var ts = Date.now();
			var speed = Math.abs(clientX - prevX) / (ts - prevTs);

			if (speed > 5 && ts !== prevTs) {
				field.classList.add("dragging-field--moved");

				content.classList.add(
					`dragging-field__content--moved-${dx > 0 ? "right" : "left"}`
				);

				currentGesture = null;
				return;
			}

			currentGesture.prevTs = ts;
			currentGesture.prevX = clientX;
			if (btnsCount) {
				nodeState.startPos =
					dx < -(nodeState.btnW / 2) ? -btnsCount * nodeState.btnW : 0;
			}
		}

		function release(e) {
			if (!currentGesture) return;
			currentGesture = null;

			content.classList.remove("grabbing");

			content.style.transition = "transform 0.3s ease";
			content.style.transform = `translateX(${nodeState.startPos}px)`;

			if (e.type === "mousedown") {
				document.removeEventListener("mousemove", drag, { passive: false });
				document.removeEventListener("mouseup", release, { passive: false });
				document.removeEventListener("mousecancel", release, {
					passive: false
				});
			} else if (e.type === "touchstart") {
				document.removeEventListener("touchmove", drag, { passive: false });
				document.removeEventListener("touchend", release, { passive: false });
				document.removeEventListener("touchcancel", release, {
					passive: false
				});
			} else if (e.type === "pointerdown") {
				content.removeEventListener("pointermove", drag, { passive: false });
				content.removeEventListener("pointerup", release, { passive: false });
				content.removeEventListener("pointercancel", release, {
					passive: false
				});
			}
		}

		if ("onpointerdown" in document) {
			content.addEventListener("pointerdown", tap);
		} else {
			content.addEventListener("mousedown", tap, { passive: false });
			content.addEventListener("touchstart", tap, { passive: false });
		}
	}

	function init(container, options) {
		createField(container, options);
	}

	DraggingField = {
		init: init
	};

	if (!window.DraggingField) {
		window.DraggingField = DraggingField;
	} else {
		window.DraggingField = Object.assign(window.DraggingField, DraggingField);
	}
})();

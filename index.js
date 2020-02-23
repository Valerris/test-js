(function() {
	// menu items reveal

	var nav = document.querySelector(".nav");
	var navItems = nav.querySelectorAll(".nav__item");
	var navBackdraw = document.querySelector(".nav-backdraw");

	function getCoords(elem) {
		var box = elem.getBoundingClientRect();

		return {
			top: box.top,
			left: box.left,
			width: box.width,
			height: box.height
		};
	}

	var navCoords = getCoords(nav);

	navBackdraw.style.transform = `scaleY(1) translate(${
		navCoords.left
	}px, ${navCoords.top +
		navCoords.height +
		document.documentElement.scrollTop}px) `;

	navItems.forEach(item => {
		item.addEventListener("mouseenter", e => {
			item.classList.add("block");

			setTimeout(() => {
				item.classList.contains("block") && item.classList.add("visible");
			}, 69);
			var navDopdown = item.querySelector(".nav__dropdown");

			navBackdraw.classList.add("nav-backdraw--show");

			var itemCoords = getCoords(navDopdown);

			navBackdraw.style.width = itemCoords.width + "px";
			navBackdraw.style.height = itemCoords.height + "px";
			navBackdraw.style.transform = `scaleY(1) translate(${
				itemCoords.left
			}px, ${itemCoords.top + document.documentElement.scrollTop}px) `;
		});

		item.addEventListener("mouseleave", e => {
			item.classList.remove("block", "visible");
			navBackdraw.classList.remove("nav-backdraw--show");
		});
	});
})();

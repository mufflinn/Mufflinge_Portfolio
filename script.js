/* =========================================================
   JOE WELLER — CREATIVE PORTFOLIO
   JAVASCRIPT / PART 3
========================================================= */


/* =========================================================
   PROJECT DATA
========================================================= */

const projects = {

	"memory-viewer": {
		title: "Memory Viewer",
		category: "UI / WEB",
		description:
			"An experimental portfolio interface designed around the idea of exploring digital memories. Built with a focus on interaction, motion, and visual storytelling.",
		video: "videos/memory-viewer.mp4",
		tags: [
			"HTML",
			"CSS",
			"JavaScript",
			"UI Design",
			"Interaction"
		]
	},

	"holo-system": {
		title: "Holo System",
		category: "WEB / INTERACTION",
		description:
			"A holographic-inspired interface experiment combining layered visuals, motion, glow effects, and responsive interaction.",
		video: "videos/holo-system.mp4",
		tags: [
			"HTML",
			"CSS",
			"JavaScript",
			"Motion",
			"Experimental"
		]
	},

	"roblox-ui": {
		title: "Roblox Interface",
		category: "GAME UI",
		description:
			"A custom Roblox interface concept focused on strong visual hierarchy, game interaction, and an expressive visual identity.",
		video: "videos/roblox-ui.mp4",
		tags: [
			"Roblox",
			"UI Design",
			"Lua",
			"Game Design"
		]
	},

	"blagoo": {
		title: "Blagoo",
		category: "EXPERIMENTAL / 3D",
		description:
			"An experimental character and content concept built around a strange black goo character and the idea of social interaction becoming increasingly uncomfortable.",
		video: "videos/blagoo.mp4",
		tags: [
			"3D",
			"Blender",
			"Character Design",
			"Creative Direction"
		]
	},

	"project-five": {
		title: "Your Next Project",
		category: "WEB / UI / EXPERIMENTAL",
		description:
			"This space is waiting for the next experiment. Replace this project with another interface, game, animation, website, or whatever you build next.",
		video: "videos/project-five.mp4",
		tags: [
			"Web",
			"UI",
			"Creative Code",
			"Experimental"
		]
	}

};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const projectGrid =
	document.querySelector("#projectGrid");

const projectCards =
	document.querySelectorAll(".project-card");

const filterButtons =
	document.querySelectorAll(".filter");

const projectModal =
	document.querySelector("#projectModal");

const modalBackdrop =
	document.querySelector(".modal-backdrop");

const modalClose =
	document.querySelector(".modal-close");

const modalVideo =
	document.querySelector("#modalVideo");

const modalVideoSource =
	document.querySelector("#modalVideoSource");

const modalTitle =
	document.querySelector("#modalTitle");

const modalCategory =
	document.querySelector("#modalCategory");

const modalDescription =
	document.querySelector("#modalDescription");

const modalTags =
	document.querySelector("#modalTags");

const toast =
	document.querySelector("#toast");


/* =========================================================
   STATE
========================================================= */

let currentProject = null;

let toastTimeout = null;


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

	initializeProjectCards();

	initializeFilters();

	initializeRevealAnimations();

	initializeNavigation();

});


/* =========================================================
   PROJECT CARDS
========================================================= */

function initializeProjectCards() {

	projectCards.forEach((card) => {

		const video =
			card.querySelector(".project-video");

		/*
			HOVER VIDEO PREVIEW
		*/

		if (video) {

			card.addEventListener(
				"mouseenter",
				() => {

					video
						.play()
						.catch(() => {});

				}
			);

			card.addEventListener(
				"mouseleave",
				() => {

					video.pause();

					video.currentTime = 0;

				}
			);

		}


		/*
			OPEN PROJECT
		*/

		card.addEventListener(
			"click",
			() => {

				const projectId =
					card.dataset.project;

				openProject(projectId);

			}
		);

	});

}


/* =========================================================
   OPEN PROJECT MODAL
========================================================= */

function openProject(projectId) {

	const project =
		projects[projectId];

	if (!project) {

		console.warn(
			`Project "${projectId}" was not found.`
		);

		return;

	}


	currentProject = projectId;


	/*
		UPDATE TEXT
	*/

	modalTitle.textContent =
		project.title;

	modalCategory.textContent =
		project.category;

	modalDescription.textContent =
		project.description;


	/*
		UPDATE TAGS
	*/

	modalTags.innerHTML = "";

	project.tags.forEach(
		(tag) => {

			const tagElement =
				document.createElement("span");

			tagElement.className =
				"modal-tag";

			tagElement.textContent =
				tag;

			modalTags.appendChild(
				tagElement
			);

		}
	);


	/*
		UPDATE VIDEO
	*/

	modalVideo.pause();

	modalVideoSource.src =
		project.video;

	modalVideo.load();


	/*
		OPEN MODAL
	*/

	projectModal.classList.add("open");

	projectModal.setAttribute(
		"aria-hidden",
		"false"
	);

	document.body.classList.add(
		"modal-open"
	);


	/*
		PLAY VIDEO
	*/

	setTimeout(() => {

		modalVideo
			.play()
			.catch(() => {});

	}, 350);


	showToast(
		`${project.title} opened`
	);

}


/* =========================================================
   CLOSE PROJECT MODAL
========================================================= */

function closeProject() {

	projectModal.classList.remove(
		"open"
	);

	projectModal.setAttribute(
		"aria-hidden",
		"true"
	);

	document.body.classList.remove(
		"modal-open"
	);


	/*
		STOP VIDEO
	*/

	modalVideo.pause();

	modalVideo.currentTime = 0;

	modalVideoSource.src = "";

	modalVideo.load();


	currentProject = null;

}


/* =========================================================
   CLOSE EVENTS
========================================================= */

if (modalClose) {

	modalClose.addEventListener(
		"click",
		closeProject
	);

}


if (modalBackdrop) {

	modalBackdrop.addEventListener(
		"click",
		closeProject
	);

}


/*
	ESC KEY
*/

document.addEventListener(
	"keydown",
	(event) => {

		if (
			event.key === "Escape" &&
			projectModal.classList.contains("open")
		) {

			closeProject();

		}

	}
);


/* =========================================================
   PROJECT FILTERS
========================================================= */

function initializeFilters() {

	filterButtons.forEach(
		(button) => {

			button.addEventListener(
				"click",
				() => {

					const filter =
						button.dataset.filter;


					/*
						UPDATE ACTIVE BUTTON
					*/

					filterButtons.forEach(
						(item) => {

							item.classList.remove(
								"active"
							);

						}
					);

					button.classList.add(
						"active"
					);


					/*
						FILTER PROJECTS
					*/

					filterProjects(filter);

				}
			);

		}
	);

}


/* =========================================================
   FILTER PROJECTS
========================================================= */

function filterProjects(filter) {

	projectCards.forEach(
		(card) => {

			const categories =
				card.dataset.category
					.toLowerCase()
					.split(" ");


			const shouldShow =
				filter === "all" ||
				categories.includes(
					filter.toLowerCase()
				);


			if (shouldShow) {

				card.classList.remove(
					"hidden"
				);

				/*
					Small entrance animation
				*/

				card.animate(
					[
						{
							opacity: 0,
							transform:
								"translateY(20px) scale(.97)"
						},

						{
							opacity: 1,
							transform:
								"translateY(0) scale(1)"
						}
					],
					{
						duration: 400,
						easing:
							"cubic-bezier(.2,.8,.2,1)"
					}
				);

			} else {

				card.classList.add(
					"hidden"
				);

			}

		}
	);

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function initializeRevealAnimations() {

	const revealElements =
		document.querySelectorAll(
			".reveal"
		);


	if (
		!("IntersectionObserver" in window)
	) {

		revealElements.forEach(
			(element) => {

				element.classList.add(
					"visible"
				);

			}
		);

		return;

	}


	const observer =
		new IntersectionObserver(
			(entries) => {

				entries.forEach(
					(entry) => {

						if (
							entry.isIntersecting
						) {

							entry.target.classList.add(
								"visible"
							);

							observer.unobserve(
								entry.target
							);

						}

					}
				);

			},
			{
				threshold: 0.12,

				rootMargin:
					"0px 0px -50px 0px"
			}
		);


	revealElements.forEach(
		(element) => {

			observer.observe(
				element
			);

		}
	);

}


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

	const navigationLinks =
		document.querySelectorAll(
			'.nav-links a, .brand-mark, .hero-button, .contact-pill'
		);


	navigationLinks.forEach(
		(link) => {

			link.addEventListener(
				"click",
				(event) => {

					const href =
						link.getAttribute("href");


					/*
						Only handle
						internal anchors
					*/

					if (
						!href ||
						!href.startsWith("#")
					) {

						return;

					}


					const target =
						document.querySelector(
							href
						);


					if (!target) {

						return;

					}


					event.preventDefault();


					target.scrollIntoView(
						{
							behavior:
								"smooth",

							block:
								"start"
						}
					);

				}
			);

		}
	);

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

	if (!toast) {
		return;
	}


	toast.textContent =
		message;

	toast.classList.add(
		"show"
	);


	clearTimeout(
		toastTimeout
	);


	toastTimeout =
		setTimeout(
			() => {

				toast.classList.remove(
					"show"
				);

			},
			1800
		);

}


/* =========================================================
   MOUSE PARALLAX
========================================================= */

const heroArt =
	document.querySelector(".hero-art");

const heroCore =
	document.querySelector(".hero-core");


if (
	heroArt &&
	heroCore &&
	window.matchMedia(
		"(pointer: fine)"
	).matches
) {

	heroArt.addEventListener(
		"mousemove",
		(event) => {

			const rect =
				heroArt.getBoundingClientRect();


			const x =
				event.clientX -
				rect.left;

			const y =
				event.clientY -
				rect.top;


			const centerX =
				rect.width / 2;

			const centerY =
				rect.height / 2;


			const rotateX =
				(y - centerY) /
				30;

			const rotateY =
				(centerX - x) /
				30;


			heroCore.style.transform =
				`
				rotateX(${rotateX}deg)
				rotateY(${rotateY}deg)
				rotate(-2deg)
				scale(1.03)
				`;

		}
	);


	heroArt.addEventListener(
		"mouseleave",
		() => {

			heroCore.style.transform =
				"";

		}
	);

}


/* =========================================================
   PROJECT CARD TILT
========================================================= */

if (
	window.matchMedia(
		"(pointer: fine)"
	).matches
) {

	projectCards.forEach(
		(card) => {

			card.addEventListener(
				"mousemove",
				(event) => {

					/*
						Don't tilt excessively.
					*/

					const rect =
						card.getBoundingClientRect();


					const x =
						event.clientX -
						rect.left;

					const y =
						event.clientY -
						rect.top;


					const centerX =
						rect.width / 2;

					const centerY =
						rect.height / 2;


					const rotateX =
						(y - centerY) /
						35;

					const rotateY =
						(centerX - x) /
						35;


					card.style.transform =
						`
						perspective(1000px)
						rotateX(${rotateX}deg)
						rotateY(${rotateY}deg)
						translateY(-8px)
						`;

				}
			);


			card.addEventListener(
				"mouseleave",
				() => {

					card.style.transform =
						"";

				}
			);

		}
	);

}


/* =========================================================
   VIDEO ERROR HANDLING
========================================================= */

document
	.querySelectorAll(".project-video")
	.forEach(
		(video) => {

			video.addEventListener(
				"error",
				() => {

					console.warn(
						"Project preview could not be loaded:",
						video.currentSrc
					);

				}
			);

		}
	);


/* =========================================================
   MODAL VIDEO ERROR
========================================================= */

if (modalVideo) {

	modalVideo.addEventListener(
		"error",
		() => {

			showToast(
				"Video could not be loaded"
			);

		}
	);

}


/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener(
	"load",
	() => {

		document.body.classList.add(
			"page-loaded"
		);

	}
);


/* =========================================================
   CONSOLE SIGNATURE
========================================================= */

console.log(
	"%c JW. ",
	"background:#171311;color:#c7ff4d;font-size:20px;font-weight:900;padding:8px;"
);

console.log(
	"%c Creative Portfolio // 2026 ",
	"color:#ff4fa3;font-weight:900;"
);
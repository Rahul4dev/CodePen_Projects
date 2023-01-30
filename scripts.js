// environment variable

//require('dotenv').config();

// DOM manipulation
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

// out photos will change every time we make request so, global variable
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API

let count = 5;
const apiKey = window.process.env.API_KEY;

const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// Check if all images were loaded
function imageLoaded() {
	imagesLoaded++;
	if (imagesLoaded === totalImages) {
		ready = true;
		loader.hidden = true;
		count = 20;
	}
}

// helper function to set Attributes: following DRY (don't repeat yourself) idea.
function setAttribute(element, attributes) {
	for (const key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
}

// create elements for Links, photos and Add to DOM

function displayPhotos() {
	imagesLoaded = 0;
	totalImages = photosArray.length;
	// run function forEach method in photosArray
	photosArray.forEach((photo) => {
		// create <a> to link to unsplash on blank window
		const item = document.createElement('a');
		//item.setAttribute('href', photo.links.html);
		//item.setAttribute('target', '_blank');  OR
		setAttribute(item, {
			href: photo.links.html,
			target: '_blank',
		});

		// Create <image></image> for photo and add attribute of src, alt and title
		const img = document.createElement('img');
		// img.setAttribute('src', photo.urls.regular);
		// img.setAttribute('alt', photo.alt_description);
		// img.setAttribute('title', photo.alt_description);  OR
		setAttribute(img, {
			src: photo.urls.regular,
			alt: photo.alt_description,
			title: photo.alt_description,
		});

		//Event listener, check when each img is finished loading
		img.addEventListener('load', imageLoaded);

		// create twitter and Instagram buttons and show Photographer's name

		const photographerDescription = document.createElement('div');
		const btnContainer = document.createElement('div');

		const twitterBtn = document.createElement('a');
		const instagramBtn = document.createElement('a');
		const photographerDetails = document.createElement('a');
		const photographerName = document.createElement('h6');

		// container attribute: added class to containers
		setAttribute(photographerDescription, {
			class: 'photo',
		});

		setAttribute(btnContainer, {
			class: 'btn',
		});

		setAttribute(photographerDetails, {
			href: photo.user.links.html,
			target: '_blank',
			title: photo.user.bio,
		});

		// buttons attributes: added class to buttons
		setAttribute(twitterBtn, {
			class: 'fab fa-twitter',
			href: `https://twitter.com/${photo.user.social.twitter_username}`,
			target: '_blank',
			title: `follow ${photo.user.name} on twitter`,
		});

		setAttribute(instagramBtn, {
			class: 'fab fa-instagram',
			href: `http://instagram.com/${photo.user.social.instagram_username}`,
			target: '_blank',
			title: `follow ${photo.user.name} on instagram`,
		});
		// Other fields to add like: PhotographerName,
		setAttribute(photographerName, {
			class: 'photographerName',
		});

		photographerName.innerText = photo.user.name;
		// put <img> inside <a>, <buttons> will be then put both inside our image container element
		btnContainer.appendChild(twitterBtn);
		btnContainer.appendChild(instagramBtn);
		item.appendChild(img);
		imageContainer.appendChild(item);
		photographerDescription.appendChild(btnContainer);
		photographerDetails.appendChild(photographerName);
		photographerDescription.appendChild(photographerDetails);
		imageContainer.appendChild(photographerDescription);

		// eventListeners

		// twitterBtn.addEventListener('click', twitterClick);
		// instagramBtn.addEventListener('click', instagramClick);
	});
}

// get photos from unsplash API

async function getPhotos() {
	try {
		const response = await fetch(apiUrl);
		photosArray = await response.json();
		displayPhotos();
	} catch (error) {
		// catch error
	}
}

// check to see if scrolling near bottom of page, Load more Photos

window.addEventListener('scroll', () => {
	if (
		window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
		ready
	) {
		ready = false;
		getPhotos();
	}
});

// on load

getPhotos();

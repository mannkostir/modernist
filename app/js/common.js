'use strict';

const $ = require('jquery');

$(document).on("DOMContentLoaded", () => {
	slider();
	elemFadeIn();
	imgLazyLoad();
});

const hamburgerNav = new Dropdown('navbar-toggle', 'menu', 'navbar-toggle-icon');
const dropdownMenu = new Dropdown('dropdown-toggle', 'dropdown-menu', 'dropdown-toggle-icon');

function elemFadeIn() {
	const fadingElem = $('.fading');

	if ('IntersectionObserver' in window) {
		const elemFadeObserver = new IntersectionObserver((entries, elemObserver) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const elem = $(entry.target);
					elem.addClass('fade');
				}
			})
		});

		for (let i = 0; i < fadingElem.length; i++) {
			elemFadeObserver.observe(fadingElem[i]);
		}	
	} else {
		fadingElem.addClass('fade');
	}
};

function imgLazyLoad() {
	let lazyImg = $('img.lazy-img');

	if ('IntersectionObserver' in window) {
		const lazyLoadObserver = new IntersectionObserver((entries, imgObserver) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					let img = $(entry.target);
					let src = img.attr('data-lazy');
					img.attr('src', src);
				}
			})
		});

		for (let i = 0; i < lazyImg.length; i++) {
			lazyLoadObserver.observe(lazyImg[i])
		}	
	} else {
		for (let i = 0; i < lazyImg.length; i++) {
			let img = $(lazyImg[i]);
			let src = img.attr('data-lazy');
			img.attr('src', src);
		}
	}

};

function Dropdown(toggle, menu, icon) {
	this.toggle = $('.' + toggle);
	this.menu = $('.' + menu);
	this.icon = $('.' + icon);

	this.toggle.click( () => {
		if (this.icon.hasClass('active')) {
			this.icon.removeClass('active');
			this.menu.slideUp();
		} else {
			this.icon.addClass('active');
			this.menu.slideDown();
		};
	});
};

function slider() {
	const slick = require('slick-carousel');

	$('.slider').css('display', 'block');

	let slickOptions = {
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			fade: true,
			dots: false,
			arrows: true,
			autoplay: true,
			speed: 1000,
			pauseOnHover: false,
			pauseOnFocus: false,
			autoplaySpeed: 5000,
			adaptiveHeight: true,
			mobileFirst: true
		};
	const $slider = $('.slides-list');
	const $trafficLight = $('.slider .traffic-light');
	const $lightSignal = $('.slider .traffic-light .signal');
	const $controlButton = $('.slider .control-button');

	$slider.slick(slickOptions);

	$controlButton.on('click', () => {
		if ($slider.hasClass('launched')) {
			sliderStop();
		} else if ($slider.hasClass('stopped')) {
			sliderGo();
		} else {
			sliderGo();
		}

		$trafficLight.addClass('visible');
		$controlButton.attr('disabled', true);
		$controlButton.addClass('disabled');
		setTimeout( () => {
			$trafficLight.removeClass('visible');
			$controlButton.removeAttr('disabled');
			$controlButton.removeClass('disabled');
		}, 1500);
	});

	let sliderStop = () => {
		$slider.slick('slickSetOption', {
			'autoplay': false
		}, true);
		$slider.removeClass('launched');
		$slider.addClass('stopped');
		$lightSignal.removeClass('go');
		$lightSignal.addClass('stop');
		$controlButton.html('Go');
	};

	let sliderGo = () => {
		$slider.slick('slickSetOption', {
			'autoplay': true
		}, true);
		$slider.removeClass('stopped');
		$slider.addClass('launched');
		$lightSignal.removeClass('stop');
		$lightSignal.addClass('go');
		$controlButton.html('Stop');
	};
};
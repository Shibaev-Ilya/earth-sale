export const initPopup = (block) => {
	const popupButtons = block.querySelectorAll('.js-popup');

	const body = document.querySelector('body');
	const header = document.querySelector('.header');
	let scrollWidth = window.innerWidth - body.clientWidth;

	popupButtons.forEach(function (el) {
		el.addEventListener('click', popupButtonClickHandler);
	})

	function popupButtonClickHandler(e) {
		e.preventDefault();
		const target = e.target.dataset.target || '#popup';
		$('body').addClass('o-hidden');
		$(target).addClass('popup_active');
		document.addEventListener('keydown', documentKeydownHandler);
		document.addEventListener('click', modalClickHandler);
		body.style.paddingRight = `${scrollWidth}px`;
		header.style.paddingRight = `${scrollWidth}px`;
	}

	$('.js-popup-close').click(function (e) {
		closeModal(e);
	});

	function closeModal(e) {
		e.preventDefault();
		$('body').removeClass('o-hidden');
		$('.popup').removeClass('popup_active');
		$('form').trigger('reset');
		document.removeEventListener('keydown', documentKeydownHandler);
		document.removeEventListener('click', modalClickHandler);


		body.style.paddingRight = `0px`;
		header.style.paddingRight = `0px`;

	}

	function documentKeydownHandler(evt) {
		const isEscKey = evt.key === 'Escape' || evt.key === 'Esc';

		if (isEscKey) {
			evt.preventDefault();
			closeModal(evt)
		}
	}

	function modalClickHandler(evt) {
		const target = evt.target;

		if (!target.closest('[data-close-modal]')) {
			return;
		}

		closeModal(evt)
	}

}

initPopup(document);

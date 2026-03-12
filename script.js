const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');

function syncHeaderTheme() {
	if (!header || !hero) return;

	const headerHeight = header.offsetHeight;
	const switchPoint = hero.offsetTop + hero.offsetHeight - headerHeight;
	const isPastHero = window.scrollY >= switchPoint;

	header.classList.toggle('is-past-hero', isPastHero);
}

window.addEventListener('scroll', syncHeaderTheme, { passive: true });
window.addEventListener('resize', syncHeaderTheme);
window.addEventListener('load', syncHeaderTheme);

syncHeaderTheme();

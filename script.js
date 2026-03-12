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

/* =========================================
   INTERNATIONALISATION (i18n)
   ========================================= */

let currentLocale = localStorage.getItem('locale') || 'pt-BR';
let translations = {};

function getVal(obj, path) {
	return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function applyTranslations() {
	document.querySelectorAll('[data-i18n]').forEach(el => {
		const val = getVal(translations, el.dataset.i18n);
		if (val !== undefined) el.textContent = val;
	});
	document.querySelectorAll('[data-i18n-html]').forEach(el => {
		const val = getVal(translations, el.dataset.i18nHtml);
		if (val !== undefined) el.innerHTML = val;
	});
	document.querySelectorAll('[data-i18n-attr]').forEach(el => {
		el.dataset.i18nAttr.split(';').forEach(pair => {
			const [attr, key] = pair.split(':');
			const val = getVal(translations, key);
			if (val !== undefined) el.setAttribute(attr, val);
		});
	});
}

function updateLangToggle() {
	const btn = document.querySelector('.lang-toggle');
	if (!btn) return;
	const flag = btn.querySelector('.lang-flag');
	if (currentLocale === 'pt-BR') {
		flag.classList.replace('fi-br', 'fi-us');
		btn.setAttribute('aria-label', 'Switch to English');
	} else {
		flag.classList.replace('fi-us', 'fi-br');
		btn.setAttribute('aria-label', 'Mudar para Português');
	}
}

async function loadLocale(locale) {
	try {
		const res = await fetch(`locales/${locale}.json`);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		translations = await res.json();
	} catch (e) {
		console.warn('i18n: could not load locale', locale, e);
		return;
	}
	currentLocale = locale;
	localStorage.setItem('locale', locale);
	document.documentElement.lang = locale;
	applyTranslations();
	updateLangToggle();
}

document.querySelector('.lang-toggle')?.addEventListener('click', () => {
	loadLocale(currentLocale === 'pt-BR' ? 'en' : 'pt-BR');
});

/* =========================================
   MOBILE MENU
   ========================================= */

const mobileToggle = document.querySelector('.nav-mobile-toggle');
const mobileMenu = document.querySelector('.nav-mobile-menu');

function closeMobileMenu() {
	header.classList.remove('is-mobile-open');
	mobileToggle?.setAttribute('aria-expanded', 'false');
	mobileToggle?.setAttribute('aria-label', 'Abrir menu');
}

mobileToggle?.addEventListener('click', () => {
	const isOpen = header.classList.toggle('is-mobile-open');
	mobileToggle.setAttribute('aria-expanded', String(isOpen));
	mobileToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

// Close when a mobile nav link is clicked
mobileMenu?.querySelectorAll('a').forEach(link => {
	link.addEventListener('click', closeMobileMenu);
});

// Close on ESC key
document.addEventListener('keydown', e => {
	if (e.key === 'Escape') closeMobileMenu();
});

loadLocale(currentLocale);

const nav = document.querySelector('.site-nav')
const hamburger = document.querySelector('.nav-hamburger')
const mobileMenu = document.querySelector('.nav-mobile-menu')

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open')
    mobileMenu.classList.toggle('is-open', isOpen)
    hamburger.setAttribute('aria-expanded', isOpen)
    if (isOpen) trapFocus(mobileMenu)
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) close()
  })

  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && nav.classList.contains('is-open')) close()
  })
}

function close() {
  nav.classList.remove('is-open')
  mobileMenu.classList.remove('is-open')
  hamburger.setAttribute('aria-expanded', 'false')
  hamburger.focus()
}

function trapFocus(el) {
  const focusable = el.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')
  if (!focusable.length) return
  focusable[0].focus()
}

// Mark active nav link
const current = location.pathname.replace(/\/$/, '') || '/'
document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(a => {
  const href = a.getAttribute('href').replace(/\/$/, '') || '/'
  if (href === current || (current === '/' && href === 'index.html')) {
    a.setAttribute('aria-current', 'page')
  }
})

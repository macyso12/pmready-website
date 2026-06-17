const form = document.getElementById('contact-form')
if (!form) throw new Error('contact-form not found')

const fields = {
  name: { el: form.querySelector('#name'), error: form.querySelector('#name-error') },
  email: { el: form.querySelector('#email'), error: form.querySelector('#email-error') },
  message: { el: form.querySelector('#message'), error: form.querySelector('#message-error') },
}
const submitBtn = form.querySelector('.form-submit')
const formMessage = form.querySelector('.form-message')

function validate() {
  let valid = true
  const { name, email, message } = fields

  clearError(name)
  clearError(email)
  clearError(message)

  if (!name.el.value.trim()) {
    showError(name, 'Please enter your name.')
    valid = false
  }
  if (!email.el.value.trim()) {
    showError(email, 'Please enter your email address.')
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.el.value.trim())) {
    showError(email, 'Please enter a valid email address.')
    valid = false
  }
  if (!message.el.value.trim()) {
    showError(message, 'Please enter a message.')
    valid = false
  }
  return valid
}

function showError(field, msg) {
  field.el.classList.add('is-error')
  field.error.textContent = msg
  field.error.classList.add('visible')
}

function clearError(field) {
  field.el.classList.remove('is-error')
  field.error.classList.remove('visible')
}

form.addEventListener('submit', async e => {
  e.preventDefault()
  formMessage.className = 'form-message'

  if (!validate()) return

  submitBtn.disabled = true
  submitBtn.textContent = 'Sending…'

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })

    if (res.ok) {
      form.reset()
      formMessage.textContent = "Message sent! We’ll get back to you soon."
      formMessage.classList.add('success')
    } else {
      formMessage.textContent = 'Something went wrong. Please try again or email us directly.'
      formMessage.classList.add('error')
    }
  } catch {
    formMessage.textContent = 'Network error. Please check your connection and try again.'
    formMessage.classList.add('error')
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = 'Send Message'
  }
})

// Clear errors on input
Object.values(fields).forEach(({ el, error }) => {
  el.addEventListener('input', () => {
    el.classList.remove('is-error')
    error.classList.remove('visible')
  })
})

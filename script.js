document.addEventListener('DOMContentLoaded', function () {
    // All service sections are open by default.
    // Clicking a header keeps it open/closed independently.
    document.querySelectorAll('.accordion-header').forEach(function (button) {
        button.addEventListener('click', function () {
            const item = button.parentElement;
            item.classList.toggle('collapsed');
            const content = item.querySelector('.accordion-content');
            if (item.classList.contains('collapsed')) {
                content.style.display = 'none';
                button.setAttribute('aria-expanded', 'false');
            } else {
                content.style.display = '';
                button.setAttribute('aria-expanded', 'true');
            }
        });
        button.setAttribute('aria-expanded', 'true');
    });

    // Requisites
    const reqToggle = document.getElementById('reqToggle');
    const reqContent = document.getElementById('reqContent');
    if (reqToggle && reqContent) {
        reqToggle.addEventListener('click', function () {
            reqContent.classList.toggle('open');
            reqToggle.textContent = reqContent.classList.contains('open')
                ? '▼ Скрыть реквизиты предприятия'
                : '▶ Показать официальные реквизиты предприятия';
        });
    }

    // Contact modal
    const modal = document.getElementById('contactModal');
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const consentInput = document.getElementById('personalDataConsent');
    const status = document.getElementById('formStatus');

    function openModal() {
        if (!modal) return;
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        setTimeout(function () { if (nameInput) nameInput.focus(); }, 50);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        if (status) {
            status.textContent = '';
            status.className = 'form-status';
        }
    }

    document.querySelectorAll('[data-open-contact]').forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            openModal();
        });
    });

    document.querySelectorAll('[data-close-modal]').forEach(function (button) {
        button.addEventListener('click', closeModal);
    });

    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // EmailJS form submission.
    // Replace these three values after creating the EmailJS service/template.
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

    if (form && typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Отправка…';
            }
            if (status) {
                status.textContent = 'Отправляем заявку…';
                status.className = 'form-status';
            }

            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
                .then(function () {
                    window.location.href = 'thanks.html';
                })
                .catch(function (error) {
                    console.error('EmailJS error:', error);
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Отправить заявку';
                    }
                    if (status) {
                        status.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.';
                        status.className = 'form-status error';
                    }
                });
        });
    }

    // Cookie notice: shown once until the visitor accepts it.
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');

    try {
        if (localStorage.getItem('yuristkrd23_cookie_accepted') === '1') {
            cookieBanner.style.display = 'none';
        }
        cookieAccept.addEventListener('click', function () {
            localStorage.setItem('yuristkrd23_cookie_accepted', '1');
            cookieBanner.style.display = 'none';
        });
    } catch (e) {
        // If localStorage is unavailable, the banner remains visible.
    }
});

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

    // FormSubmit AJAX. The first submission triggers one-time email activation.
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (!consentInput.checked) {
                consentInput.focus();
                return;
            }

            status.textContent = 'Отправка заявки…';
            status.className = 'form-status';

            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());

            fetch('https://formsubmit.co/ajax/yurist.krd.23@mail.ru', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(function (response) {
                return response.json().then(function (data) {
                    return { ok: response.ok, data: data };
                });
            })
            .then(function (result) {
                if (!result.ok || result.data.success === false) {
                    throw new Error('Form submission failed');
                }

                status.textContent = 'Спасибо! Заявка отправлена. Мы свяжемся с вами.';
                status.className = 'form-status success';
                form.reset();

                setTimeout(function () {
                    closeModal();
                }, 1800);
            })
            .catch(function () {
                status.textContent = 'Не удалось отправить заявку. Позвоните по номеру +7 (988) 247-87-97.';
                status.className = 'form-status error';
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

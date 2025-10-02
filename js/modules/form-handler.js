// form-handler.js — ГЛОБАЛЬНАЯ ВЕРСИЯ (без import/export)
(function (w) {
    const validateEmail = w.validateEmail || (() => true);
    const escapeHtml = w.escapeHtml || ((s) => s);
    const initCaptcha = w.initCaptcha || null;

    class FormHandler {
        constructor() {
            this.form = document.getElementById('contactForm');
            this.statusEl = document.getElementById('formStatus');
            this.submitBtn = document.getElementById('submitBtn');
            this.captchaManager = null;
            this.attempts = 0;
            this.maxAttempts = 3;
            this.init();
        }

        init() {
            if (!this.form) return;
            this.captchaManager = initCaptcha ? initCaptcha() : null;
            this.setupFormValidation();
            this.setupSubmissionHandler();
            this.setupSpamProtection();
        }

        setupFormValidation() {
            const inputs = this.form.querySelectorAll('input, textarea');
            inputs.forEach((input) => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }

        validateField(field) {
            const value = (field.value || '').trim();

            if (field.tagName === 'TEXTAREA') {
                if (!value) this.showFieldError(field, 'Message is required');
                else if (value.length < 10) this.showFieldError(field, 'Please enter at least 10 characters');
                else this.clearFieldError(field);
                return;
            }

            switch (field.type) {
                case 'email':
                    if (!value) this.showFieldError(field, 'Email is required');
                    else if (!validateEmail(value)) this.showFieldError(field, 'Please enter a valid email');
                    else this.clearFieldError(field);
                    break;

                default:
                    if (!value) this.showFieldError(field, 'This field is required');
                    else if (value.length < 2) this.showFieldError(field, 'Please enter at least 2 characters');
                    else this.clearFieldError(field);
            }
        }

        showFieldError(field, message) {
            this.clearFieldError(field);
            field.style.borderColor = 'var(--error)';

            let errorEl = field.parentNode.querySelector('.field-error');
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'field-error';
                errorEl.style.color = 'var(--error)';
                errorEl.style.fontSize = '0.8rem';
                errorEl.style.marginTop = '0.5rem';
                field.parentNode.appendChild(errorEl);
            }
            errorEl.textContent = message;
        }


        clearFieldError(field) {
            field.style.borderColor = '';
            const existing = field.parentNode.querySelector('.field-error');
            if (existing) existing.remove();
        }

        setupSubmissionHandler() {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!this.validateForm()) return;
                if (this.attempts >= this.maxAttempts) {
                    this.showStatus('Too many submission attempts. Please try again later.', 'error');
                    return;
                }
                await this.submitForm();
            });
        }

        validateForm() {
            let isValid = true;
            const inputs = this.form.querySelectorAll('input[required], textarea[required]');
            inputs.forEach((input) => {
                this.validateField(input);
                if (input.style.borderColor === 'var(--error)') isValid = false;
            });

            const captchaInput = document.getElementById('captchaInput');
            if (captchaInput && this.captchaManager && !this.captchaManager.validate(captchaInput.value)) {
                this.showFieldError(captchaInput, 'Please enter the correct CAPTCHA');
                isValid = false;
            }
            return isValid;
        }

        async submitForm() {
            this.attempts++;
            this.setSubmitState(true);
            try {
                const formData = new FormData(this.form);
                formData.set('_subject', formData.get('subject') || 'New message from portfolio');
                formData.set('_replyto', formData.get('_replyto'));
                formData.set('to', atob('YXJ0dXIubWFuZ29AZXhhbXBsZS5jb20=')); // твой base64 email

                const response = await fetch(this.form.action, {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                    body: formData
                });

                if (response.ok) {
                    this.showStatus('Thank you! Your message has been sent successfully.', 'success');
                    this.form.reset();
                    this.captchaManager?.refresh();
                    this.attempts = 0;
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                console.error('Form submission error:', err);
                this.showStatus('Oops! Something went wrong. Please try again later.', 'error');
            } finally {
                this.setSubmitState(false);
            }
        }

        setSubmitState(isSubmitting) {
            if (!this.submitBtn) return;
            if (isSubmitting) {
                this.submitBtn.disabled = true;
                this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            } else {
                this.submitBtn.disabled = false;
                this.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Secure Message';
            }
        }

        showStatus(message, type) {
            if (!this.statusEl) return;
            this.statusEl.textContent = message;
            this.statusEl.className = type;
            if (type === 'success') {
                setTimeout(() => {
                    this.statusEl.textContent = '';
                    this.statusEl.className = '';
                }, 5000);
            }
        }

        setupSpamProtection() {
            setInterval(() => (this.attempts = 0), 300000); // 5 минут

            const honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = 'website';
            honeypot.style.display = 'none';
            honeypot.className = 'hp-field';
            this.form.appendChild(honeypot);

            this.form.addEventListener('submit', (e) => {
                if (honeypot.value) {
                    e.preventDefault();
                    console.log('Spam detected');
                    return false;
                }
            });
        }
    }

    w.FormHandler = FormHandler;
})(window);

/**
 * PayFlux — Global Finance & FinTech Platform
 * Core JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Mobile Menu Drawer Navigation
    // ----------------------------------------------------
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBackdrop = document.getElementById('mobile-menu-backdrop');
    const mobileClose = document.getElementById('mobile-menu-close');

    const toggleMobileMenu = (isOpen) => {
        if (!mobileMenu || !mobileBackdrop) return;
        if (isOpen) {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            mobileBackdrop.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            mobileBackdrop.classList.add('opacity-100', 'pointer-events-auto');
            document.body.classList.add('overflow-hidden');
        } else {
            mobileMenu.classList.add('translate-x-full');
            mobileMenu.classList.remove('translate-x-0');
            mobileBackdrop.classList.add('opacity-0', 'pointer-events-none');
            mobileBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
            document.body.classList.remove('overflow-hidden');
            setTimeout(() => {
                if (mobileMenu.classList.contains('translate-x-full')) {
                    mobileBackdrop.classList.add('hidden');
                }
            }, 300);
        }
    };

    if (mobileBtn) mobileBtn.addEventListener('click', () => toggleMobileMenu(true));
    if (mobileClose) mobileClose.addEventListener('click', () => toggleMobileMenu(false));
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));

    // ----------------------------------------------------
    // 2. Animated Counter Numbers
    // ----------------------------------------------------
    const animateValue = (obj, start, end, duration, prefix = '', suffix = '') => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = Math.floor(progress * (end - start) + start);
            obj.innerHTML = `${prefix}${currentVal.toLocaleString()}${suffix}`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.counter-up');
                if (counter && !counter.classList.contains('animated')) {
                    const target = parseFloat(counter.dataset.target) || 0;
                    const prefix = counter.dataset.prefix || '';
                    const suffix = counter.dataset.suffix || '';
                    animateValue(counter, 0, target, 2000, prefix, suffix);
                    counter.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.metric-card, .counter-trigger').forEach(el => counterObserver.observe(el));

    // ----------------------------------------------------
    // 3. Scroll Reveal Animations
    // ----------------------------------------------------
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

    // ----------------------------------------------------
    // 4. Back To Top Button
    // ----------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ----------------------------------------------------
    // 5. Interactive FX Currency Converter
    // ----------------------------------------------------
    const fxAmount = document.getElementById('fx-amount');
    const fxFrom = document.getElementById('fx-from');
    const fxTo = document.getElementById('fx-to');
    const fxResult = document.getElementById('fx-result');
    const fxSavings = document.getElementById('fx-savings');
    const fxRateNotice = document.getElementById('fx-rate-notice');

    const ratesAgainstUSD = {
        USD: 1.0,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 154.5,
        CAD: 1.36,
        AUD: 1.52,
        SGD: 1.34,
        INR: 83.4
    };

    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        CAD: 'CA$',
        AUD: 'A$',
        SGD: 'S$',
        INR: '₹'
    };

    const updateFXCalculation = () => {
        if (!fxAmount || !fxFrom || !fxTo || !fxResult) return;
        const sendVal = parseFloat(fxAmount.value) || 0;
        const fromCurr = fxFrom.value;
        const toCurr = fxTo.value;

        // Convert sendVal to USD, then to target currency
        const amountInUSD = sendVal / (ratesAgainstUSD[fromCurr] || 1);
        const targetAmount = amountInUSD * (ratesAgainstUSD[toCurr] || 1);
        const exchangeRate = (ratesAgainstUSD[toCurr] || 1) / (ratesAgainstUSD[fromCurr] || 1);

        const sym = currencySymbols[toCurr] || '';
        fxResult.textContent = `${sym}${targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        if (fxRateNotice) {
            fxRateNotice.textContent = `1 ${fromCurr} = ${exchangeRate.toFixed(4)} ${toCurr} (Real-time Interbank Rate)`;
        }

        if (fxSavings) {
            // Traditional bank fee averages 3.8% spread + $25 wire fee
            const bankCharge = (sendVal * 0.038) + 25;
            const payfluxFee = (sendVal * 0.0035) + 0.5; // 0.35%
            const totalSaved = Math.max(0, bankCharge - payfluxFee);
            fxSavings.textContent = `Save ~$${totalSaved.toFixed(2)} compared to traditional wire transfers`;
        }
    };

    if (fxAmount) fxAmount.addEventListener('input', updateFXCalculation);
    if (fxFrom) fxFrom.addEventListener('change', updateFXCalculation);
    if (fxTo) fxTo.addEventListener('change', updateFXCalculation);
    updateFXCalculation();

    // ----------------------------------------------------
    // 6. Interactive Pricing Volume Slider
    // ----------------------------------------------------
    const volumeSlider = document.getElementById('volume-slider');
    const volumeDisplay = document.getElementById('volume-display');
    const calculatedFee = document.getElementById('calculated-fee');
    const estimatedSavings = document.getElementById('estimated-savings');

    const updateVolumeCalculator = () => {
        if (!volumeSlider || !volumeDisplay) return;
        const volume = parseInt(volumeSlider.value);
        volumeDisplay.textContent = `$${volume.toLocaleString()}`;

        // Rate scales downwards with higher volume
        let feePercentage = 1.2;
        if (volume > 500000) feePercentage = 0.6;
        else if (volume > 200000) feePercentage = 0.8;
        else if (volume > 50000) feePercentage = 1.0;

        const monthlyFee = (volume * (feePercentage / 100));
        const bankFee = (volume * 0.032) + 350; // Bank avg 3.2% + fees
        const annualSavings = Math.max(0, (bankFee - monthlyFee) * 12);

        if (calculatedFee) {
            calculatedFee.textContent = `${feePercentage}% + $0.20 per txn`;
        }
        if (estimatedSavings) {
            estimatedSavings.textContent = `$${Math.round(annualSavings).toLocaleString()}/year`;
        }
    };

    if (volumeSlider) {
        volumeSlider.addEventListener('input', updateVolumeCalculator);
        updateVolumeCalculator();
    }

    // ----------------------------------------------------
    // 7. Institutional Treasury & FX Desk Tab Switcher
    // ----------------------------------------------------
    const deskTabs = document.querySelectorAll('.desk-tab-btn');
    const deskPanels = document.querySelectorAll('.desk-panel');

    deskTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const deskView = tab.getAttribute('data-desk');
            deskTabs.forEach(t => t.classList.remove('active', 'bg-slate-800', 'text-sky-400', 'border-sky-400'));
            tab.classList.add('active', 'bg-slate-800', 'text-sky-400', 'border-sky-400');

            deskPanels.forEach(panel => {
                if (panel.getAttribute('data-desk') === deskView) {
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            });
        });
    });

    // ----------------------------------------------------
    // 8. Copy Financial Desk Summary Helper
    // ----------------------------------------------------
    const copyButtons = document.querySelectorAll('.btn-copy-report');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const activePanel = document.querySelector('.desk-panel:not(.hidden)');
            if (activePanel) {
                navigator.clipboard.writeText(activePanel.innerText.trim()).then(() => {
                    const originalHtml = btn.innerHTML;
                    btn.innerHTML = `<i class="fas fa-check text-emerald-400 mr-1"></i> Summary Copied!`;
                    setTimeout(() => {
                        btn.innerHTML = originalHtml;
                    }, 2000);
                });
            }
        });
    });

    // ----------------------------------------------------
    // 9. FAQ Accordions
    // ----------------------------------------------------
    const faqButtons = document.querySelectorAll('.faq-toggle');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.faq-icon');
            const isOpen = !content.classList.contains('hidden');

            // Close all first in same group if desired, or toggle
            if (isOpen) {
                content.classList.add('hidden');
                if (icon) icon.classList.remove('rotate-180');
            } else {
                content.classList.remove('hidden');
                if (icon) icon.classList.add('rotate-180');
            }
        });
    });

    // ----------------------------------------------------
    // 10. Footer Newsletter Subscription
    // ----------------------------------------------------
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const feedback = form.querySelector('.newsletter-feedback');
            if (emailInput && emailInput.value.trim()) {
                emailInput.value = '';
                if (feedback) {
                    feedback.classList.remove('hidden');
                    setTimeout(() => {
                        feedback.classList.add('hidden');
                    }, 4000);
                }
            }
        });
    });
});

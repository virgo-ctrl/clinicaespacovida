/**
 * Espaço Vida — Main JavaScript
 * Interatividade, Accordion FAQ, Rolagem Suave e Rastreamento Google Ads
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accordion FAQ
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fechar todos os outros accordions (opção 1 por vez aberta)
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle do item clicado
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Abrir a primeira pergunta por padrão para dar pista visual ao usuário
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAnswer = firstItem.querySelector('.faq-answer');
    firstItem.classList.add('active');
    if (firstAnswer) {
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
  }

  // 2. Disparo de Conversão Google Ads nos botões de CTA (WhatsApp e Telefone)
  const trackConversion = (eventName, label) => {
    console.log(`[Google Ads Tracking] Disparando evento de conversão: ${eventName} (${label})`);
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION-ID/label-placeholder', // Inserir ID real da conta
        'event_callback': function() {
          console.log('[Google Ads Tracking] Evento enviado com sucesso.');
        }
      });
    }
  };

  const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"], .js-track-whatsapp');
  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      trackConversion('click_whatsapp', e.currentTarget.textContent.trim());
    });
  });

  const phoneButtons = document.querySelectorAll('a[href^="tel:"], .js-track-phone');
  phoneButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      trackConversion('click_phone', e.currentTarget.textContent.trim());
    });
  });

  // 3. Efeito de Sombra no Navbar Sticky durante Scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 10px 30px rgba(0, 101, 62, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // 4. Suporte a rolagem suave ao carregar com hash na URL (ex: #servico-pre-natal)
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }

  // 5. Splash cards — scroll-triggered com IntersectionObserver (fiel à referência)
  const splashCards = Array.from(document.querySelectorAll('[data-splash-card]'));

  if (splashCards.length > 0 && 'IntersectionObserver' in window) {
    // Respeitar prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      const splashObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const inner = entry.target.querySelector('[data-splash-inner]');
            if (!inner) return;
            if (entry.intersectionRatio >= 0.8) {
              inner.classList.add('is-onscreen');
            } else {
              inner.classList.remove('is-onscreen');
            }
          });
        },
        { threshold: [0, 0.2, 0.5, 0.8, 1] }
      );
      splashCards.forEach((c) => splashObserver.observe(c));
    } else {
      // Sem animação: mostrar todos na posição final imediatamente
      splashCards.forEach((c) => {
        const inner = c.querySelector('[data-splash-inner]');
        if (inner) inner.classList.add('is-onscreen');
      });
    }
  } else {
    // Fallback: sem suporte a IntersectionObserver
    splashCards.forEach((c) => {
      const inner = c.querySelector('[data-splash-inner]');
      if (inner) inner.classList.add('is-onscreen');
    });
  }
});

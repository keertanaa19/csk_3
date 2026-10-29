/* CSKPF Consulting Services - site behaviour (vanilla JS, no dependencies) */
(function () {
  'use strict';
  var S = window.SITE_CONFIG || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var digits = function (v) { return String(v || '').replace(/\D/g, ''); };
  var waBase = 'https://wa.me/' + digits(S.whatsapp) + '?text=';

  /* 1. Fill contact details from config.js */
  var text = { phone: S.phoneDisplay, phone2: S.phone2Display, phone2: S.phone2Display, email: S.email, address: S.address, hours: S.hours };
  $$('[data-bind]').forEach(function (el) { var v = text[el.getAttribute('data-bind')]; if (v) el.textContent = v; });
  var links = {
    google: S.googlePage, facebook: S.facebook, instagram: S.instagram, linkedin: S.linkedin,
    tel: 'tel:' + String(S.phoneTel || '').replace(/[^\d+]/g, ''),
    tel2: 'tel:' + String(S.phone2Tel || '').replace(/[^\d+]/g, ''),
    tel2: 'tel:' + String(S.phone2Tel || '').replace(/[^\d+]/g, ''),
    mail: 'mailto:' + (S.email || ''),
    wa: waBase + encodeURIComponent('Hello CSKPF Consulting Services, I would like to enquire about your services.'),
    map: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(S.address || '')
  };
  $$('[data-link]').forEach(function (el) { var h = links[el.getAttribute('data-link')]; if (h) el.setAttribute('href', h); });
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* 2. Mobile menu */
  var btn = $('.menu-btn'), nav = $('#nav');
  if (btn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      btn.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.site-header')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function () { setMenu(false); });
  }

  /* Marquee pause button */
  var mq = $('[data-marquee]'), mqBtn = $('#mq-toggle');
  if (mq && mqBtn) {
    mqBtn.addEventListener('click', function () {
      var p = mq.classList.toggle('paused');
      mqBtn.textContent = p ? 'Play' : 'Pause';
      mqBtn.setAttribute('aria-pressed', String(p));
    });
  }

  /* 3. Enquiry form */
  var form = $('#enquiry-form');
  if (!form) return;
  var statusBox = $('#form-status');
  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Enter your full name.'; },
    phone: function (v) { var n = digits(v).length; return n >= 10 && n <= 15 ? '' : 'Enter a valid phone number with at least 10 digits.'; },
    email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address, or leave it blank.'; },
    service: function (v) { return v ? '' : 'Choose a service.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Tell us a little more (at least 10 characters).'; }
  };
  var check = function (name) {
    var field = form.elements[name], msg = rules[name](field.value);
    $('#err-' + name).textContent = msg;
    if (msg) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
    return !msg;
  };
  Object.keys(rules).forEach(function (n) {
    form.elements[n].addEventListener('blur', function () { check(n); });
    form.elements[n].addEventListener('input', function () { if (this.getAttribute('aria-invalid')) check(n); });
  });
  var pre = new URLSearchParams(location.search).get('service');
  if (pre) { var opt = $('option[value="' + pre.replace(/[^\w-]/g, '') + '"]', form); if (opt) form.elements.service.value = opt.value; }

  var show = function (type, msg, actions) {
    statusBox.hidden = false;
    statusBox.className = 'status ' + type;
    statusBox.textContent = '';
    var p = document.createElement('p'); p.style.margin = '0'; p.textContent = msg; statusBox.appendChild(p);
    if (actions && actions.length) {
      var row = document.createElement('div'); row.className = 'btn-row';
      actions.forEach(function (a) {
        var l = document.createElement('a'); l.className = 'btn ' + a.cls; l.href = a.href; l.textContent = a.label;
        if (a.ext) { l.target = '_blank'; l.rel = 'noopener'; }
        row.appendChild(l);
      });
      statusBox.appendChild(row);
    }
    statusBox.focus();
  };
  var collect = function () {
    var f = form.elements;
    return { name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(),
      service: f.service.options[f.service.selectedIndex].text, message: f.message.value.trim() };
  };
  var summary = function (d) {
    return 'Enquiry for CSKPF Consulting Services\nName: ' + d.name + '\nPhone: ' + d.phone +
      (d.email ? '\nEmail: ' + d.email : '') + '\nService: ' + d.service + '\nMessage: ' + d.message;
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null;
    Object.keys(rules).forEach(function (n) { if (!check(n) && !first) first = form.elements[n]; });
    if (first) { first.focus(); return; }
    if (form.elements.botcheck.checked) return;               // spam trap
    var d = collect();
    if (!S.web3formsAccessKey || /YOUR_/i.test(S.web3formsAccessKey)) {
      /* No form service configured: be honest, offer working alternatives. */
      show('info', 'This form is not connected to an email service yet, so nothing has been sent. Your details are valid; send them now by WhatsApp or email instead.', [
        { cls: 'btn-wa', label: 'Send on WhatsApp', href: waBase + encodeURIComponent(summary(d)), ext: true },
        { cls: 'btn-navy', label: 'Send by email', href: 'mailto:' + (S.email || '') + '?subject=' + encodeURIComponent('Enquiry: ' + d.service) + '&body=' + encodeURIComponent(summary(d)) }
      ]);
      return;
    }
    var submit = $('button[type=submit]', form);
    submit.disabled = true; submit.textContent = 'Sending...';
    var body = { access_key: S.web3formsAccessKey, subject: 'New website enquiry: ' + d.service, from_name: 'CSKPF website',
      name: d.name, phone: d.phone, service: d.service, message: d.message, botcheck: '' };
    if (d.email) body.email = d.email;
    fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.success) throw new Error(j.message || 'failed');
        form.reset(); show('ok', 'Thank you. Your enquiry has been sent and we will get back to you soon.');
      })
      .catch(function () {
        show('bad', 'The enquiry could not be sent. Please try again, or contact us directly by phone, WhatsApp or email.', [
          { cls: 'btn-wa', label: 'Send on WhatsApp', href: waBase + encodeURIComponent(summary(d)), ext: true }]);
      })
      .then(function () { submit.disabled = false; submit.textContent = 'Send enquiry'; });
  });
})();

/**
 * Latin / Cyrillic / English language switcher.
 * Content keys and localStorage persistence (script=latn | script=cyrl | script=eng).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'script';
  var LATN = 'latn';
  var CYRL = 'cyrl';
  var ENG = 'eng';

  var content = {
    'sr-Latn': {
      metaTitle: 'Nebgradnja — Građevinska firma | Radnici i poslodavci, Beograd',
      logo: 'NEBGRADNJA',
      navHome: 'Početna',
      navServices: 'Usluge',
      navAbout: 'O nama',
      navGallery: 'Galerija',
      navContact: 'Kontakt',
      heroTitle: 'Tražite posao ili radnike? Mi povezujemo.',
      heroSubtitle: 'Povezujemo građevinske radnike i poslodavce. Jednostavno, brzo, pouzdano.',
      heroCtaJobs: 'Tražim posao',
      heroCtaWorkers: 'Treba vam usluga?',
      servicesTitle: 'Usluge',
      cardJobTitle: 'Tražite posao?',
      cardJobText: 'Tražite posao u građevini? Prijavite se kod nas. Povezujemo radnike sa poslodavcima širom regiona.',
      cardJobCta: 'Prijavi se',
      cardWorkersTitle: 'Treba vam usluga?',
      cardWorkersText: 'Potrebna vam je građevinska usluga ili pomoć? Javite nam se i dogovorimo detalje.',
      cardWorkersCta: 'Kontaktirajte nas',
      cardServicesTitle: 'Građevinske usluge',
      cardServicesText: 'Kompletne građevinske usluge — od projekta do realizacije. Kontaktirajte nas za ponudu.',
      cardServicesCta: 'Kontakt',
      aboutTitle: 'O nama',
      aboutText1: 'Nebgradnja je građevinska firma sa dugogodišnjim iskustvom u povezivanju radnika i poslodavaca, kao i u pružanju građevinskih usluga.',
      aboutText2: 'Posvećeni smo kvalitetu, pouzdanosti i transparentnosti. Naš cilj je da svaki projekat bude uspešno završen, a svi učesnici zadovoljni.',
      aboutTrust: 'Nebgradnja je građevinska firma sa deset godina iskustva u povezivanju radnika i poslodavaca i u pružanju građevinskih usluga. Našu pouzdanost stežemo kroz iskren odnos, jasan dogovor i isporuku obećanog — nismo kao drugi koji obećavaju a ne ispunjavaju. Radnici i investitori nam veruju jer dugo radimo u struci, poznajemo teren i stojimo iza svake reči.',
      aboutPro1Title: 'Profesionalizam',
      aboutPro1Text: 'Posedujemo svo znanje i alate za pravilno izračunavanje parametara skele; uvek se trudimo da ispunimo očekivanja naših kupaca.',
      aboutPro1TextDesktop: 'Stručno izračunavanje parametara skele i građevinske usluge po meri. Znanje i alati za preciznost; uvek ispunjavamo očekivanja investitora i kupaca.',
      aboutPro2Title: 'Sigurnost i standardi',
      aboutPro2Text: 'Stabilna konstrukcija skele sigurna je za osobe koje rade na visini. Skele poseduju sve potrebne sertifikate i zadovoljavaju bezbednosne standarde.',
      aboutPro2TextDesktop: 'Bezbednost na radu i rad na visini: sertifikovane skele, stabilna konstrukcija i usklađenost sa bezbednosnim standardima.',
      aboutPro3Title: 'Fleksibilnost',
      aboutPro3Text: 'Naši kupci mogu da biraju u okviru širokog spektra proizvoda kako bi zadovoljili svoje potrebe i očekivanja.',
      aboutPro3TextDesktop: 'Širok asortiman i prilagodljivost: građevinski materijali i usluge po vašim potrebama. Birajte opcije koje odgovaraju projektu.',
      aboutPro4Title: 'Garancija kvaliteta',
      aboutPro4Text: 'Nudimo skele odličnog kvaliteta napravljene sa velikom pažnjom prema detaljima po pristupačnim cenama.',
      aboutPro4TextDesktop: 'Kvalitet materijala i dugotrajnost: skele i građevinske usluge sa pažnjom prema detaljima, po povoljnim cenama.',
      galleryTitle: 'Galerija',
      galleryCap1: 'Projekat 1',
      galleryCap2: 'Projekat 2',
      galleryCap3: 'Projekat 3',
      galleryCap4: 'Projekat 4',
      galleryCap5: 'Projekat 5',
      galleryCap6: 'Projekat 6',
      videoPlaceholder: 'Video će biti dodato',
      contactTitle: 'Kontakt',
      formName: 'Ime i prezime',
      formEmail: 'Email',
      formPhone: 'Telefon',
      formMessage: 'Poruka',
      formSubmit: 'Pošalji',
      formSuccess: 'Hvala, javićemo vam se uskoro.',
      formError: 'Došlo je do greške. Pokušajte ponovo.',
      contactDirect: 'Ili nas pozovite / pišite direktno',
      contactAddress: 'Beograd, Srbija',
      footerCopy: '© 2026 Nebgradnja. Sva prava zadržana.'
    },
    'sr-Cyrl': {
      metaTitle: 'Небградња — Грађевинска фирма | Радници и послодавци, Београд',
      logo: 'Небградња',
      navHome: 'Почетна',
      navServices: 'Услуге',
      navAbout: 'О нама',
      navGallery: 'Галерија',
      navContact: 'Контакт',
      heroTitle: 'Тражите посао или раднике? Ми повезујемо.',
      heroSubtitle: 'Повезујемо грађевинске раднике и послодавце. Једноставно, брзо, поуздано.',
      heroCtaJobs: 'Тражим посао',
      heroCtaWorkers: 'Треба вам услуга?',
      servicesTitle: 'Услуге',
      cardJobTitle: 'Тражите посао?',
      cardJobText: 'Тражите посао у грађевини? Пријавите се код нас. Повезујемо раднике са послодавцима широм региона.',
      cardJobCta: 'Пријави се',
      cardWorkersTitle: 'Треба вам услуга?',
      cardWorkersText: 'Потребна вам је грађевинска услуга или помоћ? Јавите нам се и договоримо детаље.',
      cardWorkersCta: 'Контактирајте нас',
      cardServicesTitle: 'Грађевинске услуге',
      cardServicesText: 'Комплетне грађевинске услуге — од пројекта до реализације. Контактирајте нас за понуду.',
      cardServicesCta: 'Контакт',
      aboutTitle: 'О нама',
      aboutText1: 'Небградња је грађевинска фирма са дугогодишњим искуством у повезивању радника и послодаваца, као и у пружању грађевинских услуга.',
      aboutText2: 'Посвећени смо квалитету, поузданости и транспарентности. Наш циљ је да сваки пројекат буде успешно завршен, а сви учесници задовољни.',
      aboutTrust: 'Небградња је грађевинска фирма са десет година искуства у повезивању радника и послодаваца и у пружању грађевинских услуга. Нашу поузданост стежемо кроз искрен однос, јасан договор и испоруку обећаног — нисмо као други који обећавају а не испуњавају. Радници и инвеститори нам верују јер дуго радимо у струци, познајемо терен и стојимо иза сваке речи.',
      aboutPro1Title: 'Професионализам',
      aboutPro1Text: 'Поседујемо сво знање и алате за правилно израчунавање параметара скеле; увек се трудимо да испунимо очекивања наших купаца.',
      aboutPro1TextDesktop: 'Стручно израчунавање параметара скеле и грађевинске услуге по мери. Знање и алати за прецизност; увек испуњавамо очекивања инвеститора и купаца.',
      aboutPro2Title: 'Сигурност и стандарди',
      aboutPro2Text: 'Стабилна конструкција скеле сигурна је за особе које раде на висини. Скеле поседују све потребне сертификате и задовољавају безбедносне стандарде.',
      aboutPro2TextDesktop: 'Безбедност на раду и рад на висини: сертификоване скеле, стабилна конструкција и усклађеност са безбедносним стандардима.',
      aboutPro3Title: 'Флексибилност',
      aboutPro3Text: 'Наши купци могу да бирају у оквиру широког спектра производа како би задовољили своје потребе и очекивања.',
      aboutPro3TextDesktop: 'Широк асортиман и прилагодљивост: грађевински материјали и услуге по вашим потребама. Бирајте опције које одговарају пројекту.',
      aboutPro4Title: 'Гаранција квалитета',
      aboutPro4Text: 'Нудимо скеле одличног квалитета направљене са великом пажњом према детаљима по приступачним ценама.',
      aboutPro4TextDesktop: 'Квалитет материјала и дуготрајност: скеле и грађевинске услуге са пажњом према детаљима, по повољним ценама.',
      galleryTitle: 'Галерија',
      galleryCap1: 'Пројекат 1',
      galleryCap2: 'Пројекат 2',
      galleryCap3: 'Пројекат 3',
      galleryCap4: 'Пројекат 4',
      galleryCap5: 'Пројекат 5',
      galleryCap6: 'Пројекат 6',
      videoPlaceholder: 'Видео ће бити додато',
      contactTitle: 'Контакт',
      formName: 'Име и презиме',
      formEmail: 'Емаил',
      formPhone: 'Телефон',
      formMessage: 'Порука',
      formSubmit: 'Пошаљи',
      formSuccess: 'Хвала, јавићемо вам се ускоро.',
      formError: 'Дошло је до грешке. Покушајте поново.',
      contactDirect: 'Или нас позовите / пишите директно',
      contactAddress: 'Београд, Србија',
      footerCopy: '© 2026 Небградња. Сва права задржана.'
    },
    'en': {
      metaTitle: 'Nebgradnja — Construction Company | Workers & Employers, Belgrade',
      logo: 'NEBGRADNJA',
      navHome: 'Home',
      navServices: 'Services',
      navAbout: 'About us',
      navGallery: 'Gallery',
      navContact: 'Contact',
      heroTitle: 'Looking for a job or workers? We connect you.',
      heroSubtitle: 'We connect construction workers and employers. Simple, fast, reliable.',
      heroCtaJobs: 'I\'m looking for work',
      heroCtaWorkers: 'Need a service?',
      servicesTitle: 'Services',
      cardJobTitle: 'Looking for a job?',
      cardJobText: 'Looking for work in construction? Register with us. We connect workers with employers across the region.',
      cardJobCta: 'Register',
      cardWorkersTitle: 'Need a service?',
      cardWorkersText: 'Need a construction service or assistance? Get in touch and we\'ll work out the details.',
      cardWorkersCta: 'Contact us',
      cardServicesTitle: 'Construction services',
      cardServicesText: 'Full construction services — from design to completion. Contact us for a quote.',
      cardServicesCta: 'Contact',
      aboutTitle: 'About us',
      aboutText1: 'Nebgradnja is a construction company with years of experience connecting workers and employers, and providing construction services.',
      aboutText2: 'We are committed to quality, reliability and transparency. Our goal is for every project to be completed successfully and everyone involved to be satisfied.',
      aboutTrust: 'Nebgradnja is a construction company with ten years of experience connecting workers and employers and delivering construction services. We build trust through honest relationships, clear agreements, and delivering on our word — we are not like others who promise and don’t follow through. Workers and clients trust us because we have been in the industry for a long time, we know the field, and we stand behind everything we say.',
      aboutPro1Title: 'Professionalism',
      aboutPro1Text: 'We have the knowledge and tools for proper calculation of scaffolding parameters; we always strive to meet our clients\' expectations.',
      aboutPro1TextDesktop: 'Expert calculation of scaffolding parameters and tailored construction services. Knowledge and tools for precision; we always meet investors\' and clients\' expectations.',
      aboutPro2Title: 'Safety and standards',
      aboutPro2Text: 'A stable scaffolding structure is safe for people working at height. Our scaffolding has all required certificates and meets safety standards.',
      aboutPro2TextDesktop: 'Work safety and working at height: certified scaffolding, stable structure, and compliance with safety standards.',
      aboutPro3Title: 'Flexibility',
      aboutPro3Text: 'Our clients can choose from a wide range of products to meet their needs and expectations.',
      aboutPro3TextDesktop: 'Wide range and adaptability: construction materials and services to suit your needs. Choose options that fit your project.',
      aboutPro4Title: 'Quality guarantee',
      aboutPro4Text: 'We offer high-quality scaffolding made with great attention to detail at affordable prices.',
      aboutPro4TextDesktop: 'Material quality and durability: scaffolding and construction services with attention to detail at competitive prices.',
      galleryTitle: 'Gallery',
      galleryCap1: 'Project 1',
      galleryCap2: 'Project 2',
      galleryCap3: 'Project 3',
      galleryCap4: 'Project 4',
      galleryCap5: 'Project 5',
      galleryCap6: 'Project 6',
      videoPlaceholder: 'Video coming soon',
      contactTitle: 'Contact',
      formName: 'Full name',
      formEmail: 'Email',
      formPhone: 'Phone',
      formMessage: 'Message',
      formSubmit: 'Send',
      formSuccess: 'Thank you, we\'ll get back to you soon.',
      formError: 'Something went wrong. Please try again.',
      contactDirect: 'Or call / email us directly',
      contactAddress: 'Belgrade, Serbia',
      footerCopy: '© 2026 Nebgradnja. All rights reserved.'
    }
  };

  function getStoredScript() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === CYRL || stored === ENG) return stored;
      return LATN;
    } catch (e) {
      return LATN;
    }
  }

  function setStoredScript(script) {
    try {
      localStorage.setItem(STORAGE_KEY, script);
    } catch (e) {}
  }

  function getLocale(script) {
    if (script === CYRL) return 'sr-Cyrl';
    if (script === ENG) return 'en';
    return 'sr-Latn';
  }

  function applyContent(script) {
    var locale = getLocale(script);
    var strings = content[locale];
    if (!strings) return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (strings[key] !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.placeholder !== undefined) el.placeholder = strings[key];
        } else {
          el.textContent = strings[key];
        }
      }
    });

    var titleEl = document.querySelector('title');
    if (titleEl && strings.metaTitle) titleEl.textContent = strings.metaTitle;

    var lang = script === CYRL ? 'sr-Cyrl' : script === ENG ? 'en' : 'sr';
    document.documentElement.setAttribute('lang', lang);
  }

  function setActiveButton(script) {
    var select = document.getElementById('script-select');
    if (select) select.value = script;
  }

  function switchScript(script) {
    setStoredScript(script);
    applyContent(script);
    setActiveButton(script);
  }

  function attachSelectListener() {
    var select = document.getElementById('script-select');
    if (!select || select.getAttribute('data-i18n-bound')) return;
    select.setAttribute('data-i18n-bound', 'true');
    select.addEventListener('change', function () {
      var s = this.value;
      if (s === LATN || s === CYRL || s === ENG) switchScript(s);
    });
  }

  function initSwitcher() {
    var script = getStoredScript();
    applyContent(script);
    setActiveButton(script);
    attachSelectListener();
  }

  function runInit() {
    initSwitcher();
    if (!document.getElementById('script-select')) setTimeout(initSwitcher, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }

  function getString(key) {
    var script = getStoredScript();
    var strings = content[getLocale(script)];
    return (strings && strings[key]) || '';
  }

  window.i18nSwitch = switchScript;
  window.i18nGetScript = getStoredScript;
  window.i18nGetString = getString;
})();

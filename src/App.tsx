import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

function containDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const targets = event.currentTarget.querySelectorAll<HTMLElement>(
    'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
  );
  const first = targets[0];
  const last = targets[targets.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

const photos = {
  hero: "photo-1600210492486-724fe5c67fb0",
  kitchen: "photo-1556912172-45b7abe8b7e1",
  light: "photo-1556911220-bff31c812dba",
  wood: "photo-1556912167-f556f1f39fdf",
  interior: "photo-1600607687920-4e2a09cf159d",
};
const imageUrl = (photo: string, width: number) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85`;

function Photo({
  photo,
  alt,
  className = "",
  eager = false,
}: {
  photo: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`photo ${className} ${failed ? "photo-unavailable" : ""}`}>
      {!failed && (
        <img
          src={imageUrl(photo, 1600)}
          srcSet={`${imageUrl(photo, 640)} 640w, ${imageUrl(photo, 1000)} 1000w, ${imageUrl(photo, 1600)} 1600w`}
          sizes="(max-width: 700px) 100vw, 75vw"
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <span className="photo-fallback">
          <span className="fallback-mark" aria-hidden="true">
            V
          </span>
          <span>Интерьер VELORA</span>
          <small>Фотография временно недоступна</small>
        </span>
      )}
    </div>
  );
}
function Arrow() {
  return (
    <span aria-hidden="true">
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        style={{ display: "block" }}
      >
        <path
          d="M5 19 19 5M5 5h14v14"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    </span>
  );
}
const nav = [
  ["Коллекции", "#collections"],
  ["Проекты", "#projects"],
  ["Подход", "#approach"],
  ["Контакты", "#contact"],
];
const collections = [
  {
    name: "Тихий минимализм",
    english: "PURE",
    number: "01",
    photo: photos.kitchen,
    text: "Чистые линии. Мягкий свет. Ничего лишнего — только пространство, в котором легко быть собой.",
    materials: ["Матовые фасады", "Светлый камень", "Скрытые ручки"],
  },
  {
    name: "Тепло природы",
    english: "NATURA",
    number: "02",
    photo: photos.wood,
    text: "Выразительная текстура дерева и природные оттенки. Тактильная кухня, которая становится теплее с каждым днём.",
    materials: ["Натуральный шпон", "Тёплые оттенки", "Тактильные фактуры"],
  },
  {
    name: "Архитектура контраста",
    english: "FORMA",
    number: "03",
    photo: photos.interior,
    text: "Глубокие оттенки и скульптурные формы. Пространство с характером, где каждая деталь на своём месте.",
    materials: ["Графитовые акценты", "Каменная текстура", "Чёткая геометрия"],
  },
];
const projects = [
  {
    name: "Свет и тишина",
    category: "Светлые",
    label: "Молочный · минимализм",
    photo: photos.light,
    area: "18 м²",
    text: "Концепция открытой кухни с мягкой светлой палитрой. Лаконичные поверхности и свободная рабочая зона оставляют место для повседневной жизни.",
  },
  {
    name: "Природа внутри",
    category: "Дерево",
    label: "Дуб · природные оттенки",
    photo: photos.wood,
    area: "24 м²",
    text: "Концепция кухни, в которой дерево задаёт настроение. Тёплая палитра объединяет обеденную зону и место для приготовления еды.",
  },
  {
    name: "Чистая форма",
    category: "Светлые",
    label: "Камень · современная классика",
    photo: photos.kitchen,
    area: "16 м²",
    text: "Исследование простых форм и светлых материалов. Продуманная композиция помогает визуально раскрыть небольшое пространство.",
  },
  {
    name: "Тёплый ритм",
    category: "Дерево",
    label: "Орех · архитектурные линии",
    photo: photos.interior,
    area: "22 м²",
    text: "Концепция единого жилого пространства с натуральными фактурами. Мягкие контрасты и повторяющиеся линии создают спокойный ритм.",
  },
];
const faqs = [
  [
    "Можно ли адаптировать кухню под моё пространство?",
    "В концепции VELORA кухня проектируется под планировку, привычки и пожелания владельца. Представленные коллекции — отправная точка для выбора материалов и настроения, а не ограничение готовыми размерами.",
  ],
  [
    "Из чего складывается стоимость кухни?",
    "На стоимость влияют размеры, материалы фасадов и столешницы, фурнитура, наполнение и техника. Этот сайт демонстрационный: цены не рассчитываются, коммерческие предложения не формируются.",
  ],
  [
    "Как проходит работа над проектом?",
    "Предлагаемый процесс включает знакомство, разработку концепции, подбор материалов и реализацию. Этапы ниже показывают возможный сценарий работы студии и не являются обещанием действующей услуги.",
  ],
  [
    "Можно ли увидеть материалы вживую?",
    "У вымышленной студии VELORA нет реального шоурума. Палитры и фотографии на сайте служат визуальными референсами для демонстрации дизайна.",
  ],
  [
    "Что произойдёт после отправки формы?",
    "Вы увидите локальное сообщение об успешной проверке формы. Данные не отправляются, не сохраняются и никому не передаются. Это деморежим портфолио-проекта.",
  ],
];

export default function App() {
  const [collection, setCollection] = useState(0);
  const [filter, setFilter] = useState("Все проекты");
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(
    null,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const projectDialog = useRef<HTMLDialogElement>(null);
  const menuDialog = useRef<HTMLDialogElement>(null);
  const active = collections[collection];

  useEffect(() => {
    if (selected && !projectDialog.current?.open)
      projectDialog.current?.showModal();
  }, [selected]);
  useEffect(() => {
    if (menuOpen) menuDialog.current?.showModal();
    else menuDialog.current?.close();
  }, [menuOpen]);
  useEffect(() => {
    if (!menuOpen && !selected) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [menuOpen, selected]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  function submitDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      <header className="header">
        <a className="brand" href="#" aria-label="VELORA — на главную">
          <span className="brand-symbol" aria-hidden="true">
            <svg width="25" height="30" viewBox="0 0 25 30" fill="none">
              <path
                d="m2 5 10.5 21L23 5M8 5l4.5 9L17 5"
                stroke="currentColor"
                strokeWidth="1.1"
              />
            </svg>
          </span>
          VELORA<span className="brand-description">КУХНИ НА ЗАКАЗ</span>
        </a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#contact">
          Обсудить проект <Arrow />
        </a>
        <button
          className="menu-toggle"
          aria-label="Открыть меню"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
        </button>
      </header>

      <dialog
        ref={menuDialog}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Мобильное меню"
        onClose={() => setMenuOpen(false)}
        onKeyDown={containDialogFocus}
      >
        <div className="menu-top">
          <span className="wordmark">VELORA</span>
          <button
            className="close-button"
            onClick={() => setMenuOpen(false)}
            aria-label="Закрыть меню"
          >
            ×
          </button>
        </div>
        <nav aria-label="Мобильная навигация">
          {nav.map(([label, href], i) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              <small>0{i + 1}</small>
              {label}
              <Arrow />
            </a>
          ))}
        </nav>
        <p className="eyebrow">Пространство для вашей жизни</p>
        <p className="muted">Демонстрационный проект</p>
      </dialog>

      <main id="main">
        <section className="hero section-shell">
          <div className="hero-topline">
            <span className="eyebrow">
              <span className="little-line" />
              Студия кухонь на заказ
            </span>
            <span className="demo-tag">Концепт · демо</span>
          </div>
          <div className="hero-heading">
            <h1>
              Кухни, в которых
              <br />
              хочется <em>жить.</em>
            </h1>
            <div className="hero-intro">
              <p>
                Ваш характер. Ваш ритм.
                <br />
                Пространство, продуманное
                <br />
                до последней детали.
              </p>
              <a className="text-link" href="#collections">
                Найти своё вдохновение <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <Photo
              photo={photos.kitchen}
              alt="Светлая кухня с островом, деревянными деталями и естественным освещением"
              eager
            />
            <div className="hero-image-caption">
              <span>Эстетика повседневности</span>
              <span>Натуральные материалы. Чистые формы.</span>
            </div>
            <a
              className="round-link"
              href="#projects"
              aria-label="Смотреть проекты"
            >
              <Arrow />
            </a>
            <span className="image-index">01 — 04</span>
          </div>
          <div className="hero-footer">
            <span>Создано вокруг вас</span>
            <span>
              Дизайн <i /> Функциональность <i /> Гармония
            </span>
            <a href="#collections" aria-label="Перейти к коллекциям">
              Листайте вниз <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section
          className="collections section-shell section-space"
          id="collections"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow section-index">01 / Коллекции</p>
              <h2>
                Разные характеры.
                <br />
                Одна <em>философия.</em>
              </h2>
            </div>
            <p className="section-description">
              Не просто фасады и оттенки.
              <br />
              Три взгляда на пространство,
              <br />в котором начинается ваш день.
            </p>
          </div>
          <div
            className="collection-tabs"
            role="group"
            aria-label="Выбор коллекции"
          >
            {collections.map((item, i) => (
              <button
                key={item.english}
                aria-pressed={collection === i}
                className={collection === i ? "active" : ""}
                onClick={() => setCollection(i)}
              >
                <small>{item.number}</small>
                {item.english}
                <span>{item.name}</span>
                <Arrow />
              </button>
            ))}
          </div>
          <div className="collection-feature" aria-live="polite">
            <Photo
              key={active.photo}
              photo={active.photo}
              alt={`Интерьер — визуальный референс коллекции ${active.english}`}
            />
            <div className="collection-copy">
              <span className="eyebrow">Коллекция / {active.number}</span>
              <span className="collection-name">{active.english}</span>
              <h3>{active.name}</h3>
              <p>{active.text}</p>
              <div className="material-swatches" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <div className="material-list">
                {active.materials.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <a className="text-link" href="#contact">
                Обсудить эту идею <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className="projects section-shell section-space" id="projects">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-index">02 / Пространства</p>
              <h2>
                Вдохновение
                <br />в каждой <em>детали.</em>
              </h2>
            </div>
            <p className="section-description">
              Подборка интерьерных концепций.
              <br />
              Фотографии — визуальные референсы,
              <br />а не выполненные студией проекты.
            </p>
          </div>
          <div className="project-toolbar">
            <div className="filters" role="group" aria-label="Фильтр проектов">
              {["Все проекты", "Светлые", "Дерево"].map((item) => (
                <button
                  key={item}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                  className={filter === item ? "active" : ""}
                >
                  {item}
                </button>
              ))}
            </div>
            <span className="eyebrow" aria-live="polite">
              {filter === "Все проекты" ? "04" : "02"} концепции
            </span>
          </div>
          <div className="project-grid">
            {projects
              .filter(
                (project) =>
                  filter === "Все проекты" || project.category === filter,
              )
              .map((project) => (
                <button
                  className="project-card"
                  key={project.name}
                  onClick={() => setSelected(project)}
                  aria-label={`Открыть концепцию «${project.name}»`}
                >
                  <div className="project-photo">
                    <Photo
                      photo={project.photo}
                      alt={`Интерьерный референс «${project.name}»`}
                    />
                    <span className="project-area">
                      Концепция · {project.area}
                    </span>
                    <span className="project-open" aria-hidden="true">
                      <Arrow />
                    </span>
                  </div>
                  <div className="project-info">
                    <h3>{project.name}</h3>
                    <span>{project.label}</span>
                    <Arrow />
                  </div>
                </button>
              ))}
          </div>
          <p className="project-note">
            Каждое пространство начинается с идеи. Какая будет вашей?
          </p>
        </section>

        <section className="approach" id="approach">
          <div className="section-shell approach-layout">
            <div className="approach-intro">
              <p className="eyebrow section-index">03 / Наш подход</p>
              <h2>
                Красиво.
                <br />
                Удобно.
                <br />
                <em>По-настоящему ваше.</em>
              </h2>
              <p>
                Мы верим: хороший дизайн не требует объяснений. Он чувствуется —
                в движении, прикосновении, в том, как проходит обычное утро.
              </p>
              <Photo
                photo={photos.interior}
                alt="Сочетание тёплых природных фактур в современном интерьере"
              />
            </div>
            <div className="principles">
              {[
                [
                  "01",
                  "В центре — ваша жизнь",
                  "Планировка начинается с привычек. Где вы пьёте кофе, как готовите и с кем собираетесь за столом.",
                ],
                [
                  "02",
                  "Материалы с характером",
                  "Дерево, камень и тактильные поверхности. Естественная красота, которую хочется рассматривать и трогать.",
                ],
                [
                  "03",
                  "Ничего случайного",
                  "От ритма фасадов до внутреннего наполнения — у каждой детали своя роль в общей композиции.",
                ],
                [
                  "04",
                  "Целостное пространство",
                  "Кухня не существует отдельно от дома. Цвета, пропорции и свет продолжают архитектуру интерьера.",
                ],
              ].map(([number, title, text]) => (
                <article className="principle" key={number}>
                  <span className="eyebrow">{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <span className="principle-icon" aria-hidden="true">
                    {number === "01"
                      ? "◯"
                      : number === "02"
                        ? "◒"
                        : number === "03"
                          ? "⊞"
                          : "◇"}
                  </span>
                </article>
              ))}
              <p className="approach-footnote">
                Принципы вымышленной студии VELORA
              </p>
            </div>
          </div>
        </section>

        <section className="process section-shell section-space" id="process">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-index">
                04 / От идеи к пространству
              </p>
              <h2>
                Понятный путь
                <br />к вашей <em>кухне.</em>
              </h2>
            </div>
            <p className="section-description">
              Так могло бы выглядеть
              <br />
              наше сотрудничество.
              <br />
              Без спешки. С вниманием к вам.
            </p>
          </div>
          <div className="steps">
            {[
              [
                "01",
                "Знакомство",
                "Обсуждаем ваши идеи, пространство и привычки. Определяем главное.",
              ],
              [
                "02",
                "Концепция",
                "Находим планировку, пропорции и визуальный характер будущей кухни.",
              ],
              [
                "03",
                "Детали",
                "Собираем палитру материалов, подбираем наполнение и продумываем свет.",
              ],
              [
                "04",
                "Воплощение",
                "Предполагаемый финал: изготовление и монтаж по согласованному проекту.",
              ],
            ].map(([number, title, text]) => (
              <article className="step" key={number}>
                <div className="step-number">
                  {number}
                  <Arrow />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="faq section-shell section-space" id="faq">
          <div className="faq-heading">
            <p className="eyebrow section-index">05 / Вопросы и ответы</p>
            <h2>
              О важном —<br />
              <em>просто.</em>
            </h2>
            <p className="muted">
              Немного ясности
              <br />
              перед первым шагом.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], i) => (
              <details key={question} name="velora-faq">
                <summary>
                  <span className="faq-index">0{i + 1}</span>
                  <span>{question}</span>
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="section-shell contact-layout">
            <div className="contact-copy">
              <p className="eyebrow section-index">06 / Начнём с разговора</p>
              <h2>
                Ваша кухня
                <br />
                начинается
                <br />
                <em>с одной идеи.</em>
              </h2>
              <p>
                Расскажите, какое пространство
                <br />
                вы представляете. Даже если пока
                <br />
                это только настроение.
              </p>
              <span className="contact-demo">
                <span />
                Демонстрационная форма
              </span>
            </div>
            <div className="contact-form-wrap">
              <h3>Давайте представим её вместе</h3>
              <p className="form-intro">
                Попробуйте форму. Заявка никуда не отправится.
              </p>
              <form onSubmit={submitDemo}>
                <label htmlFor="name">Как к вам обращаться</label>
                <input
                  id="name"
                  name="name"
                  placeholder="Ваше имя"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="off"
                  onChange={() => setSubmitted(false)}
                />
                <label htmlFor="email">Электронная почта</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  maxLength={160}
                  autoComplete="off"
                  onChange={() => setSubmitted(false)}
                />
                <label htmlFor="idea">
                  Пара слов о вашей идее <span>необязательно</span>
                </label>
                <textarea
                  id="idea"
                  name="idea"
                  placeholder="Светлая кухня, большой остров, утренний кофе…"
                  rows={3}
                  maxLength={1500}
                />
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>
                    Я понимаю, что это демоформа. Данные не отправляются и не
                    сохраняются.
                  </span>
                </label>
                <button type="submit" className="submit-button">
                  Попробовать отправить <Arrow />
                </button>
                <div className="form-status" role="status" aria-live="polite">
                  {submitted && (
                    <p>
                      Готово! Демо-заявка проверена. Ничего не отправлено и не
                      сохранено. Спасибо за знакомство с VELORA.
                    </p>
                  )}
                </div>
              </form>
              <p className="privacy-note">
                Не вводите реальные персональные данные.
                <br />
                Для проверки подойдут вымышленное имя и email.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer section-shell">
        <div className="footer-top">
          <a href="#" className="footer-brand">
            VELORA<span>Пространство для вашей жизни</span>
          </a>
          <nav aria-label="Навигация в подвале">
            <a href="#collections">Коллекции</a>
            <a href="#projects">Проекты</a>
            <a href="#faq">Вопросы и ответы</a>
          </nav>
          <a className="back-top" href="#">
            Наверх ↑
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} VELORA — демонстрационный проект
          </span>
          <p>
            Вымышленная студия. Концепт для портфолио.
            <br />
            Фотографии: Unsplash. Сайт не предлагает реальные услуги.
          </p>
          <span className="footer-note">
            С вниманием к деталям <span aria-hidden="true">✳</span>
          </span>
        </div>
      </footer>

      <dialog
        ref={projectDialog}
        className="project-dialog"
        aria-labelledby="project-title"
        onClose={() => setSelected(null)}
        onKeyDown={containDialogFocus}
        onClick={(event) => {
          if (event.target === event.currentTarget)
            projectDialog.current?.close();
        }}
      >
        {selected && (
          <div className="dialog-content">
            <button
              className="close-button"
              aria-label="Закрыть проект"
              onClick={() => projectDialog.current?.close()}
            >
              ×
            </button>
            <Photo
              photo={selected.photo}
              alt={`Интерьерный референс «${selected.name}»`}
              eager
            />
            <div className="dialog-copy">
              <p className="eyebrow">Интерьерная концепция · {selected.area}</p>
              <h2 id="project-title">{selected.name}</h2>
              <p>{selected.text}</p>
              <p className="muted">
                Фотография — референс Unsplash. Это не реализованный проект
                VELORA; название и площадь условны.
              </p>
              <a
                className="text-link"
                href="#contact"
                onClick={() => projectDialog.current?.close()}
              >
                Вдохновиться этой идеей <Arrow />
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

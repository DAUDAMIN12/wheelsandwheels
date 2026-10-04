import { Link, useParams } from "react-router-dom";
import { FaChevronRight, FaWhatsapp } from "react-icons/fa";
import * as seoContent from "../../Data/seoContent.js";
import SeoHead from "./SeoHead.jsx";
import { GuideCard } from "./GuidesHub.jsx";

const WHATSAPP = "923390045836";

function findTopic(slug) {
  if (typeof seoContent.getGuideTopic === "function") {
    return seoContent.getGuideTopic(slug);
  }
  return (seoContent.GUIDE_TOPICS || []).find((topic) => topic.slug === slug) || null;
}

export default function GuideTopicPage({ slug: slugProp, topic: topicProp }) {
  const params = useParams();
  const slug = slugProp || params.slug || "";
  const topic = topicProp || findTopic(slug);

  if (!topic) {
    return (
      <main className="growth-page growth-not-found">
        <SeoHead
          title="Blog topic not found"
          description="Browse practical Wheels & Wheels tyre guides for Pakistan."
          noIndex
        />
        <section className="section">
          <p className="eyebrow">TYRE BLOG</p>
          <h1>We could not find that guide topic.</h1>
          <Link className="primary" to="/guides">Browse all tyre guides</Link>
        </section>
      </main>
    );
  }

  const guides = topic.guides || [];
  const breadcrumbs = topic.breadcrumbs || [
    { name: "Home", path: "/" },
    { name: "Blog and tyre guides", path: "/guides" },
    { name: topic.name, path: topic.path },
  ];
  const faq = [
    {
      question: `What is covered in the ${topic.name.toLowerCase()} section?`,
      answer: topic.description,
    },
    {
      question: "Does a guide confirm the correct tyre for my car?",
      answer:
        "No. The guides explain how to make a better enquiry. The exact vehicle, sidewall size, load and speed ratings and wheel fitment still need verification.",
    },
    {
      question: "Can I request a current tyre rate after reading a guide?",
      answer:
        "Yes. Send the complete tyre size, vehicle details and preferred priorities by the quotation form or official WhatsApp for a current check.",
    },
  ];

  return (
    <main className="growth-page guide-topic-page">
      <SeoHead
        title={topic.seoTitle || topic.title}
        description={topic.description}
        canonical={topic.path}
        breadcrumbs={breadcrumbs}
        faq={faq}
      />

      <nav className="growth-breadcrumbs breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/guides">Blog and tyre guides</Link></li>
          <li><span aria-current="page">{topic.name}</span></li>
        </ol>
      </nav>

      <header className="growth-hero guide-topic-hero">
        <div className="growth-hero-copy">
          <p className="eyebrow">TYRE KNOWLEDGE HUB</p>
          <h1>{topic.heroTitle || topic.title}</h1>
          <p className="growth-lede">{topic.intro || topic.description}</p>
          <div className="growth-actions">
            <Link className="primary" to="/tyre-sizes">
              Browse exact tyre sizes <FaChevronRight aria-hidden="true" />
            </Link>
            <a
              className="growth-whatsapp-button"
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Wheels & Wheels, I was reading your ${topic.name.toLowerCase()} guides and need advice for: `)}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp aria-hidden="true" /> Ask an expert
            </a>
          </div>
        </div>
        <div className="guide-topic-count" aria-label={`${guides.length} guides in this topic`}>
          <strong>{String(guides.length).padStart(2, "0")}</strong>
          <span>useful guides</span>
        </div>
      </header>

      <section className="guides-list section" aria-labelledby="topic-articles-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TOPIC DIRECTORY</p>
            <h2 id="topic-articles-title">Articles about {topic.name.toLowerCase()}</h2>
            <p>{topic.description}</p>
          </div>
        </div>
        <div className="guides-grid">
          {guides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}
        </div>
      </section>

      <section className="growth-faq section" aria-labelledby="topic-faq-title">
        <p className="eyebrow">HOW TO USE THESE GUIDES</p>
        <h2 id="topic-faq-title">Questions before you choose</h2>
        <div className="growth-faq-list">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <aside className="growth-lead-banner" aria-labelledby="topic-lead-title">
        <div>
          <p className="eyebrow">READY FOR A CURRENT CHECK?</p>
          <h2 id="topic-lead-title">Send the full size and exact vehicle.</h2>
          <p>We will check current options, fitment details and the market rate.</p>
        </div>
        <Link className="primary" to="/quote">Request a current rate</Link>
      </aside>
    </main>
  );
}

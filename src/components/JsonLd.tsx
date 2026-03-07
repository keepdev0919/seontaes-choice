const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://seontaes-choice.vercel.app";

const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "선태의 선택",
    url: SITE_URL,
    description:
        "충주맨 유튜버 김선태가 선택할 첫 번째 광고주는? 유튜브 댓글 기반 실시간 투표 사이트.",
    inLanguage: "ko",
    potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
    },
};

const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "김선태",
    alternateName: ["충주맨", "충주시 김선태"],
    description: "충주시 공무원 출신 유튜버. 첫 광고주 브랜드 협찬 예정.",
    sameAs: [
        "https://www.youtube.com/@kimseontae",
        "https://www.instagram.com/kimseontae_official",
    ],
};

const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": SITE_URL,
    name: "선태의 선택 | 김선태 브랜드 협찬 실시간 투표",
    url: SITE_URL,
    description:
        "충주맨 유튜버 김선태가 선택할 첫 번째 광고주는? 실시간 투표로 순위를 확인하세요.",
    inLanguage: "ko",
    isPartOf: { "@id": SITE_URL },
    about: {
        "@type": "Person",
        name: "김선태",
    },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "홈",
                item: SITE_URL,
            },
        ],
    },
};

export default function JsonLd() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />
        </>
    );
}

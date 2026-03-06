export interface Company {
  id: string;
  name: string;
  channelId: string;
  commentText: string;
  youtubeLikes: number;
  logoUrl: string;
  votes: number;
}

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "삼성전자",
    channelId: "samsung_korea",
    commentText: "삼성전자가 김선태 전 주무관님을 응원합니다! 갤럭시와 함께하세요 💙",
    youtubeLikes: 15230,
    logoUrl: "https://logo.clearbit.com/samsung.com",
    votes: 4521,
  },
  {
    id: "2",
    name: "쿠팡",
    channelId: "coupang_official",
    commentText: "쿠팡이 선태님의 진심을 응원합니다! 로켓배송처럼 빠른 응원 🚀",
    youtubeLikes: 12450,
    logoUrl: "https://logo.clearbit.com/coupang.com",
    votes: 3892,
  },
  {
    id: "3",
    name: "현대자동차",
    channelId: "hyundai_kr",
    commentText: "현대자동차가 함께합니다. 새로운 길을 응원합니다 🚗",
    youtubeLikes: 9870,
    logoUrl: "https://logo.clearbit.com/hyundai.com",
    votes: 3210,
  },
  {
    id: "4",
    name: "네이버",
    channelId: "naver_official",
    commentText: "네이버가 선태님의 새 출발을 응원합니다! 🌱",
    youtubeLikes: 8540,
    logoUrl: "https://logo.clearbit.com/naver.com",
    votes: 2890,
  },
  {
    id: "5",
    name: "카카오",
    channelId: "kakao_corp",
    commentText: "카카오와 함께 새로운 시작을! 카카오톡으로 응원해요 💛",
    youtubeLikes: 7230,
    logoUrl: "https://logo.clearbit.com/kakaocorp.com",
    votes: 2340,
  },
  {
    id: "6",
    name: "LG전자",
    channelId: "lg_electronics",
    commentText: "LG전자가 선태님을 응원합니다. Life's Good! ✨",
    youtubeLikes: 6120,
    logoUrl: "https://logo.clearbit.com/lg.com",
    votes: 1980,
  },
  {
    id: "7",
    name: "배달의민족",
    channelId: "baemin_official",
    commentText: "배민이 선태님에게 치킨을 보냅니다 🍗 응원합니다!",
    youtubeLikes: 5890,
    logoUrl: "https://logo.clearbit.com/woowahan.com",
    votes: 1750,
  },
  {
    id: "8",
    name: "토스",
    channelId: "toss_team",
    commentText: "토스가 선태님의 용기에 박수를 보냅니다 👏",
    youtubeLikes: 4320,
    logoUrl: "https://logo.clearbit.com/toss.im",
    votes: 1420,
  },
];

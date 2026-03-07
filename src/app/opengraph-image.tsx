import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "선태의 선택 - 김선태 브랜드 협찬 실시간 투표";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #1a1208 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "sans-serif",
                    position: "relative",
                }}
            >
                {/* 배경 장식 */}
                <div
                    style={{
                        position: "absolute",
                        top: -80,
                        left: -80,
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background: "rgba(212, 175, 55, 0.06)",
                        filter: "blur(60px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -80,
                        right: -80,
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background: "rgba(212, 175, 55, 0.04)",
                        filter: "blur(60px)",
                    }}
                />

                {/* 실시간 배지 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "rgba(212, 175, 55, 0.15)",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        borderRadius: 999,
                        padding: "8px 20px",
                        marginBottom: 32,
                    }}
                >
                    <div
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#d4af37",
                        }}
                    />
                    <span style={{ fontSize: 18, color: "#d4af37", fontWeight: 600 }}>
                        실시간 투표 진행중
                    </span>
                </div>

                {/* 메인 타이틀 */}
                <div
                    style={{
                        fontSize: 88,
                        fontWeight: 900,
                        color: "#d4af37",
                        letterSpacing: "-2px",
                        marginBottom: 16,
                        textShadow: "0 0 60px rgba(212, 175, 55, 0.3)",
                    }}
                >
                    선태의 선택
                </div>

                {/* 서브타이틀 */}
                <div
                    style={{
                        fontSize: 30,
                        color: "#cccccc",
                        marginBottom: 48,
                        fontWeight: 400,
                    }}
                >
                    충주맨 김선태가 선택할 첫 번째 광고주는?
                </div>

                {/* 구분선 */}
                <div
                    style={{
                        width: 80,
                        height: 2,
                        background: "rgba(212, 175, 55, 0.4)",
                        marginBottom: 40,
                    }}
                />

                {/* 도메인 */}
                <div
                    style={{
                        fontSize: 22,
                        color: "#666666",
                        letterSpacing: "1px",
                    }}
                >
                    seontaes-choice.vercel.app
                </div>
            </div>
        ),
        { ...size }
    );
}

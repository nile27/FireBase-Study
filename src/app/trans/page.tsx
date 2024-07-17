"use client";
import { useState } from "react";

const Home = () => {
  const [html, setHtml] = useState<string>(
    `<article id="dic_area" class="go_trans _article_content" style="-webkit-tap-highlight-color: rgba(0,0,0,0)"> <div style="text-align:center"><figure></figure></div>자동세차장 업체 컴인워시가 테슬라코리아보다 먼저 국내서 사이버트럭을 전시하게 됐다.<br><br>컴인워시는 지난 12일 자체 네이버 블로그를 통해 "10일부터 모든 행정 절차를 마치고 차를 인수해도 좋다는 소식을 전해 듣고 인천 세관을 통해 달려갔다"며 "우리나라 도로 주행 허가도 받았다"고 밝혔다. 컴인워시는 앞서 지난 11일 인스타그램 계정에 사이버트럭 전시 일정을 추후에 공지하겠다"고 전했다. 컴인워시는 서울 삼성동 강남본점에 사이버트럭을 전시하겠다는 계획이며 아직 전시 계획은 나오지 않았다.<br><br>컴인워시의 소식이 전해진 후 소셜미디어(<span data-type="ore" data-lang="en">SNS</span>) X와 네이버 카페에서는 국내 도로에 주행과 컴인워시 강남본점 앞에 세워진 사이버트럭의 모습이 사진과 동영상으로 올라왔다. 컴인워시는 최근 사이버트럭 도로 주행과 국내 슈퍼차저 충전 테스트를 했다고 직접 블로그를 통해 밝혔다.<br><br>취재 결과 컴인워시는 사이버트럭 차량 전시뿐만 아니라 추첨을 통한 시승 기회도 제공하겠다는 방침을 세웠다. 해당 사이버트럭은 약 1년 정도 컴인워시 강남점 등을 머무는 것으로 전해졌다.<br><br>컴인워시가 테슬라코리아보다 먼저 사이버트럭에 전시하게 되자 국내 자동차 마니아들과 소비자들은 반가운 반응을 보였다. 하지만 이들은 테슬라코리아가 중국과 일본처럼 사전에 사이버트럭 전시 계획을 세우지 않았다는 비판했다.<br><br>일본 '테슬라 재팬'은 12일 공식 X 계정에 사이버트럭 내부를 직접 탑승할 수 있는 기회를 제공하는 응모 페이지를 열었다. 중국 '테슬라 차이나'는 지난 1월에 위챗 라이브 생방송을 통해 사이버트럭의 모습을 소개한데 이어 상하이 등 주요 도시에 해당 차량을 전시했다. 사이버트럭은 또 말레이시아 테슬라 매장에서도 소개된 바 있다.<br><br>현재 테슬라코리아는 사이버트럭을 소개하는 페이지만 운영하고 있지만 예약 등 주문 관련된 사항을 아직 세우지 않았다.&nbsp; </article>`
  );
  const [translatedHtml, setTranslatedHtml] = useState<string>("");
  const [targetLang, setTargetLang] = useState<string>("en-US");

  const handleTranslate = async () => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html, targetLang }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const result = await response.json();
      console.log(result.translatedHTML);
      setTranslatedHtml(result.translatedHTML);
    } catch (error) {
      console.error("Error translating HTML:", error);
    }
  };

  return (
    <div>
      <h1>HTML Translator</h1>
      <textarea
        rows={10}
        cols={50}
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        placeholder="Enter HTML to translate"
      ></textarea>
      <div>
        <label htmlFor="targetLang">Target Language: </label>
        <select
          id="targetLang"
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          <option value="en-US">English</option>
          <option value="DE">German</option>
          <option value="FR">French</option>
          <option value="ES">Spanish</option>
          <option value="ZH">Chinese</option>
          <option value="JA">Japanese</option>
          <option value="KO">Korean</option>
          {/* 다른 언어 옵션을 추가할 수 있습니다. */}
        </select>
      </div>
      <button onClick={handleTranslate}>Translate</button>
      <h2>Translated HTML</h2>
      <div
        dangerouslySetInnerHTML={{ __html: translatedHtml }}
        style={{
          whiteSpace: "pre-wrap",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      ></div>
    </div>
  );
};

export default Home;

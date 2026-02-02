// ===== AI Talk Chatbot =====
(function(){
  'use strict';

  // ── Knowledge Base ──
  const KB = {
    // 매물 추천
    listings: [
      {name:'서울 강남 치과의원',type:'병원',region:'서울',dept:'치과',price:15,status:'매각'},
      {name:'서울 서초 피부과',type:'병원',region:'서울',dept:'피부과',price:22,status:'매각'},
      {name:'경기 분당 내과의원',type:'병원',region:'경기',dept:'내과',price:8,status:'매각'},
      {name:'부산 해운대 성형외과',type:'병원',region:'부산',dept:'성형외과',price:35,status:'매각'},
      {name:'서울 송파 요양병원',type:'병원',region:'서울',dept:'요양병원',price:120,status:'매각'},
      {name:'대구 수성 치과',type:'병원',region:'대구',dept:'치과',price:10,status:'매각'},
      {name:'인천 IT솔루션 기업',type:'기업',region:'인천',dept:'IT/소프트웨어',price:45,status:'매각'},
      {name:'서울 강남 프랜차이즈 본사',type:'기업',region:'서울',dept:'프랜차이즈',price:80,status:'매각'},
      {name:'경기 화성 제조업체',type:'기업',region:'경기',dept:'제조업',price:60,status:'매각'},
      {name:'서울 마포 디지털 마케팅',type:'기업',region:'서울',dept:'IT/소프트웨어',price:12,status:'매각'},
      {name:'광주 정형외과',type:'병원',region:'광주',dept:'정형외과',price:18,status:'양도'},
      {name:'대전 한의원',type:'병원',region:'대전',dept:'한의원',price:6,status:'양도'}
    ],
    // M&A 절차
    process: {
      sell: ['1. 매각 의사 결정 및 목표 설정','2. M&A 어드바이저 선정','3. 기업/병원 가치평가 실시','4. 투자안내서(IM) 작성','5. 잠재 매수자 탐색 및 접촉','6. 비밀유지계약(NDA) 체결','7. 실사(Due Diligence) 진행','8. 매매 조건 협상','9. 본계약(SPA) 체결','10. 잔금 지급 및 경영권 이전'],
      buy: ['1. 매수 전략 및 예산 수립','2. 대상 매물 탐색 및 선정','3. 예비 검토 및 가치평가','4. 비밀유지계약(NDA) 체결','5. 의향서(LOI) 제출','6. 정밀 실사(Due Diligence)','7. 매매 조건 협상','8. 본계약(SPA) 체결','9. 인허가 이전 및 행정절차','10. 경영권 인수 완료']
    },
    // 법률·세무
    legal: {
      tax: '병원·기업 M&A 시 주요 세금:\n• 양도소득세: 개인 양도 시 6~45% 누진세율\n• 법인세: 법인 양도 시 법인세율 적용\n• 부가가치세: 사업 포괄양수도 시 면제 가능\n• 취득세: 부동산 포함 시 4.6%\n• 인지세: 계약서 작성 시 발생\n\n💡 포괄양수도 방식 활용 시 부가세 절감 가능합니다.',
      docs: '일반적으로 필요한 서류:\n• 사업자등록증 사본\n• 최근 3년 재무제표\n• 임대차계약서\n• 의료기관 개설허가증 (병원)\n• 인허가 관련 서류\n• 직원 현황 및 근로계약서\n• 보험 가입 증명서\n• 부동산 등기부등본 (건물 포함 시)',
      permit: '병원 양도 시 인허가 안내:\n• 의료기관 개설허가는 양도 불가 → 폐업 후 신규 개설\n• 의료법인은 법인 지분 양도로 존속 가능\n• 약국, 요양기관 등 별도 인허가 필요\n• 건강보험 요양기관 지정 신청 필요\n• 관할 보건소 사전 상담 권장'
    },
    // 가치평가
    valuation: {
      hospital: '병원 가치평가 일반 기준:\n• 소형 의원: 연 순이익 × 2~4배\n• 중형 병원: 연 순이익 × 3~5배 + 자산가치\n• 대형/요양병원: DCF 방식 + 자산가치\n\n주요 고려 요소:\n• 월 매출 및 순이익 추이\n• 환자 수 및 진료 패턴\n• 입지 및 경쟁 환경\n• 시설/장비 상태\n• 의료진 구성',
      business: '기업 가치평가 일반 기준:\n• 소기업: 연 순이익 × 3~5배\n• 중기업: EBITDA × 5~8배\n• 대기업: DCF + 시장비교법 병행\n\n주요 고려 요소:\n• 매출 및 이익 성장률\n• 시장 점유율 및 경쟁력\n• 핵심 인력 및 기술력\n• 고객 기반 및 계약 현황'
    },
    // 실사
    duediligence: '실사(Due Diligence) 주요 항목:\n\n📊 재무 실사\n• 재무제표 검증, 부외부채 확인\n• 매출·비용 분석, 현금흐름 검토\n• 세무 리스크 점검\n\n⚖️ 법률 실사\n• 계약 관계 검토 (임대차, 거래처)\n• 소송·분쟁 현황\n• 인허가·규제 준수 여부\n\n🏥 운영 실사 (병원)\n• 환자 데이터 및 진료 패턴\n• 의료장비 상태 및 감가상각\n• 의료진·직원 고용조건\n\n일반적으로 2~4주 소요되며, 전문가 팀이 수행합니다.'
  };

  // ── Response Engine ──
  function getResponse(input){
    const q = input.toLowerCase().replace(/\s+/g,' ').trim();

    // 인사
    if(/^(안녕|하이|헬로|hi|hello)/.test(q)){
      return {text:'안녕하세요! AI상담톡입니다. 무엇을 도와드릴까요?',chips:['매물 찾기','M&A 절차 안내','세금/법률 질문','가치평가 상담','실사 안내','매물 등록 도움']};
    }

    // ── 1. 매물 추천 ──
    if(/매물|찾|검색|추천|매수|사고\s*싶|구매|물건/.test(q)){
      let results = KB.listings;
      // 지역 필터
      const regions = ['서울','경기','인천','부산','대구','광주','대전','울산'];
      const matchedRegion = regions.find(r => q.includes(r));
      if(matchedRegion) results = results.filter(l => l.region === matchedRegion);
      // 업종 필터
      const depts = ['치과','내과','피부과','성형외과','요양병원','정형외과','한의원','IT','제조','프랜차이즈'];
      const matchedDept = depts.find(d => q.includes(d));
      if(matchedDept) results = results.filter(l => l.dept.includes(matchedDept));
      // 가격 필터
      const priceMatch = q.match(/(\d+)\s*억?\s*(이하|미만|까지)/);
      if(priceMatch) results = results.filter(l => l.price <= parseInt(priceMatch[1]));
      // 유형 필터
      if(/병원|의원|클리닉/.test(q)) results = results.filter(l => l.type === '병원');
      if(/기업|회사|법인/.test(q)) results = results.filter(l => l.type === '기업');

      if(results.length === 0){
        return {text:'조건에 맞는 매물을 찾지 못했습니다. 조건을 조정해 보시겠어요?\n\n예시: "서울 치과 20억 이하", "경기 내과 매물"',chips:['서울 매물 보기','경기 매물 보기','병원 전체 매물','기업 전체 매물']};
      }
      let msg = `조건에 맞는 매물 ${results.length}건을 찾았습니다:\n\n`;
      results.slice(0,5).forEach((l,i) => {
        msg += `${i+1}. ${l.name}\n   ${l.type} | ${l.region} | ${l.price}억원 | ${l.status}\n\n`;
      });
      if(results.length > 5) msg += `... 외 ${results.length-5}건 더 있습니다.\n\n`;
      msg += '👉 상세 조건을 말씀해 주시면 더 정확하게 추천해 드립니다.';
      return {text:msg,chips:['상세 검색하기','매수 의뢰 등록','가치평가 받기'],link:{text:'매물 검색 페이지로 이동',url:'search-hospital.html'}};
    }

    // ── 2. M&A 절차 가이드 ──
    if(/절차|과정|순서|단계|어떻게|뭐부터|방법/.test(q)){
      if(/매수|인수|사/.test(q)){
        return {text:'병원·기업 매수(인수) 절차:\n\n'+KB.process.buy.join('\n')+'\n\n각 단계별 상세 안내가 필요하시면 질문해 주세요.',chips:['매수 의뢰하기','가치평가란?','실사란?','필요 서류']};
      }
      const steps = KB.process.sell;
      return {text:'병원·기업 매각 절차:\n\n'+steps.join('\n')+'\n\n각 단계별 상세 안내가 필요하시면 질문해 주세요.',chips:['매각 의뢰하기','매수 절차 보기','필요 서류','세금 안내']};
    }

    // ── 3. 간편 등록 도우미 ──
    if(/등록|신청|올리|의뢰|팔고\s*싶|매각하/.test(q)){
      if(/매수|사고|인수/.test(q)){
        return {text:'매수 의뢰를 도와드리겠습니다.\n\n필요한 정보:\n• 매수 유형 (병원/기업)\n• 관심 업종·진료과\n• 희망 지역\n• 투자 예산 범위\n\n매수 의뢰 페이지에서 간편하게 등록하실 수 있습니다.',chips:['매수 의뢰 바로가기'],link:{text:'매수 의뢰 페이지',url:'ma-buy.html'}};
      }
      if(/가치|평가|밸류/.test(q)){
        return {text:'가치평가 신청을 도와드리겠습니다.\n\n준비하실 정보:\n• 기업/병원명 및 업종\n• 평가 목적 (매각, 매수, 투자유치 등)\n• 최근 연매출 및 영업이익\n• 설립년도 및 직원 수\n\n가치평가 페이지에서 신청하실 수 있습니다.',chips:['가치평가 신청 바로가기'],link:{text:'가치평가 페이지',url:'ma-valuation.html'}};
      }
      if(/실사|듀딜|DD/.test(q)){
        return {text:'실사(Due Diligence) 지원 신청을 도와드리겠습니다.\n\n확인할 정보:\n• 실사 유형 (재무/법률/운영/세무)\n• 대상 기업/병원명\n• 거래 규모\n• 희망 완료일\n\n실사 지원 페이지에서 신청하실 수 있습니다.',chips:['실사 지원 바로가기'],link:{text:'실사 지원 페이지',url:'ma-duediligence.html'}};
      }
      // 기본 매각
      if(/병원/.test(q)){
        return {text:'병원 매각 등록을 도와드리겠습니다.\n\n필요한 정보:\n• 병원명, 진료과목\n• 소재지, 설립년도\n• 병상수, 의료진수\n• 희망 매각가\n• 매각 사유\n\n등록 페이지에서 단계별로 진행하실 수 있습니다.',chips:['병원 매각 등록 바로가기'],link:{text:'병원 매각 등록',url:'register-hospital.html'}};
      }
      if(/기업|회사/.test(q)){
        return {text:'기업 매각 등록을 도와드리겠습니다.\n\n필요한 정보:\n• 기업명, 업종\n• 소재지, 설립년도\n• 직원수, 사업자등록번호\n• 희망 매각가\n• 매각 사유\n\n등록 페이지에서 단계별로 진행하실 수 있습니다.',chips:['기업 매각 등록 바로가기'],link:{text:'기업 매각 등록',url:'register-business.html'}};
      }
      return {text:'어떤 등록/신청을 도와드릴까요?',chips:['병원 매각 등록','기업 매각 등록','양도 등록','매수 의뢰','가치평가 신청','실사 지원 신청']};
    }

    // ── 4. 법률·세무 ──
    if(/세금|세무|양도소득|법인세|부가세|취득세|절세/.test(q)){
      return {text:KB.legal.tax,chips:['필요 서류 보기','인허가 안내','전문가 상담'],link:{text:'법률·세무 정보 페이지',url:'info-legal.html'}};
    }
    if(/서류|문서|준비물|필요한\s*것/.test(q)){
      return {text:KB.legal.docs,chips:['세금 안내','인허가 안내','매각 절차']};
    }
    if(/인허가|허가|면허|개설|신고/.test(q)){
      return {text:KB.legal.permit,chips:['세금 안내','필요 서류','전문가 상담']};
    }
    if(/법률|법|규정|계약|소송/.test(q)){
      return {text:'M&A 관련 법률 상담이 필요하시군요.\n\n주요 법률 이슈:\n• 비밀유지계약(NDA) 작성\n• 본계약(SPA) 조건 검토\n• 경업금지 조항\n• 진술·보증 조항\n• 손해배상 한도\n\n전문 변호사 매칭을 통해 상세 상담을 받으실 수 있습니다.',chips:['전문가 매칭','인허가 안내','세금 안내'],link:{text:'전문가 매칭 페이지',url:'expert-matching.html'}};
    }

    // ── 5. 거래 현황 ──
    if(/현황|진행|상태|어디까지|어떻게\s*되/.test(q)){
      return {text:'거래 진행 현황을 확인하시려면 로그인이 필요합니다.\n\n로그인 후 확인 가능한 정보:\n• 의뢰 접수 상태\n• 매물 추천 현황\n• 실사 진행 단계\n• 협상 진행 상황\n• 계약 체결 상태\n\n거래 현황 페이지에서 상세 내역을 확인하실 수 있습니다.',chips:['로그인하기','거래 현황 보기'],link:{text:'거래 진행 현황',url:'ma-status.html'}};
    }

    // ── 6. 가치평가 시뮬레이션 ──
    if(/가치|평가|시세|얼마|가격|값어치|밸류/.test(q)){
      // 매출 기반 간이 시뮬레이션
      const revenueMatch = q.match(/매출\s*(\d+)\s*억/);
      const profitMatch = q.match(/(순이익|영업이익|이익)\s*(\d+)\s*억/);
      if(revenueMatch || profitMatch){
        let msg = '간이 가치평가 시뮬레이션 결과:\n\n';
        if(revenueMatch){
          const rev = parseInt(revenueMatch[1]);
          msg += `📊 연매출 ${rev}억 기준\n`;
          if(/병원|의원/.test(q)){
            const low = Math.round(rev * 0.8);
            const high = Math.round(rev * 2.0);
            msg += `• 예상 매각가 범위: ${low}억 ~ ${high}억원\n• (매출 대비 0.8~2.0배 적용)\n`;
          } else {
            const low = Math.round(rev * 0.5);
            const high = Math.round(rev * 1.5);
            msg += `• 예상 매각가 범위: ${low}억 ~ ${high}억원\n• (매출 대비 0.5~1.5배 적용)\n`;
          }
        }
        if(profitMatch){
          const profit = parseInt(profitMatch[2]);
          msg += `\n💰 순이익 ${profit}억 기준\n`;
          const low = profit * 3;
          const high = profit * 6;
          msg += `• 예상 매각가 범위: ${low}억 ~ ${high}억원\n• (순이익 대비 3~6배 적용)\n`;
        }
        msg += '\n⚠️ 이 결과는 참고용 간이 추정치입니다.\n정확한 평가는 전문가 가치평가를 권장합니다.';
        return {text:msg,chips:['정밀 가치평가 신청','전문가 상담'],link:{text:'가치평가 신청',url:'ma-valuation.html'}};
      }
      if(/병원|의원/.test(q)){
        return {text:KB.valuation.hospital,chips:['가치평가 신청','시뮬레이션 해보기','전문가 상담']};
      }
      return {text:KB.valuation.business,chips:['가치평가 신청','시뮬레이션 해보기','전문가 상담']};
    }

    // 전문가
    if(/전문가|어드바이저|회계사|변호사|세무사|컨설턴트/.test(q)){
      return {text:'전문가 매칭 서비스를 이용하시면 분야별 최적의 전문가를 연결해 드립니다.\n\n매칭 가능 분야:\n• 공인회계사 - 재무 실사, 가치평가\n• 변호사 - 계약, 인허가, 법률 자문\n• 세무사 - 세금 최적화, 세무 실사\n• 감정평가사 - 부동산, 자산 평가\n• 경영컨설턴트 - 전략, PMI\n\n전문가 매칭 페이지에서 상담을 신청하세요.',chips:['전문가 매칭 바로가기'],link:{text:'전문가 매칭',url:'expert-matching.html'}};
    }

    // 양도양수
    if(/양도|양수|사업자|영업권|권리금/.test(q)){
      return {text:'양도·양수 관련 안내:\n\n양도 유형:\n• 사업자 양도: 사업 전체를 포괄 양도\n• 인허가 양도: 면허·허가 이전 (일부 업종)\n• 영업권 양도: 영업 권리 및 고객기반 양도\n\n주요 고려사항:\n• 권리금 산정 기준\n• 임대차계약 승계 여부\n• 직원 고용승계\n• 세금 처리\n\n양도 등록 또는 양수 매물 검색이 가능합니다.',chips:['양도 등록','양수 매물 검색','세금 안내'],link:{text:'양도·양수 매물',url:'search-transfer.html'}};
    }

    // 비용/수수료
    if(/비용|수수료|요금|가격|얼마/.test(q)){
      return {text:'M&A 중개 관련 비용 안내:\n\n• 매물 등록: 무료\n• 매수 의뢰: 무료\n• 중개 수수료: 거래 성사 시 거래대금의 1~3%\n• 가치평가: 규모에 따라 별도 견적\n• 실사 지원: 범위에 따라 별도 견적\n\n자세한 내용은 1:1 문의를 이용해 주세요.',chips:['1:1 문의하기','매물 등록하기','이용 가이드']};
    }

    // fallback
    return {text:'죄송합니다. 질문을 정확히 이해하지 못했습니다.\n\n아래 주제 중 선택하시거나, 구체적으로 질문해 주세요.',chips:['매물 찾기','M&A 절차 안내','세금/법률 질문','가치평가 상담','실사 안내','매물 등록 도움','전문가 매칭','비용 안내']};
  }

  // ── Chip → Query Map ──
  const chipMap = {
    '매물 찾기':'매물 추천해 주세요',
    'M&A 절차 안내':'M&A 절차가 어떻게 되나요',
    '세금/법률 질문':'M&A 세금에 대해 알려주세요',
    '가치평가 상담':'가치평가는 어떻게 하나요',
    '실사 안내':'실사는 어떻게 진행되나요',
    '매물 등록 도움':'매물을 등록하고 싶어요',
    '서울 매물 보기':'서울 매물 추천',
    '경기 매물 보기':'경기 매물 추천',
    '병원 전체 매물':'병원 매물 추천',
    '기업 전체 매물':'기업 매물 추천',
    '상세 검색하기':'매물을 검색하고 싶어요',
    '매수 의뢰 등록':'매수 의뢰를 등록하고 싶어요',
    '매수 의뢰하기':'매수 의뢰를 등록하고 싶어요',
    '매수 의뢰 바로가기':'매수 의뢰를 등록하고 싶어요',
    '가치평가 받기':'가치평가 신청하고 싶어요',
    '가치평가 신청':'가치평가 신청하고 싶어요',
    '가치평가 신청 바로가기':'가치평가 신청하고 싶어요',
    '정밀 가치평가 신청':'가치평가 신청하고 싶어요',
    '시뮬레이션 해보기':'병원 매출 10억 가치평가',
    '매각 의뢰하기':'매각 의뢰를 등록하고 싶어요',
    '매수 절차 보기':'매수 절차가 어떻게 되나요',
    '필요 서류':'M&A 필요 서류가 뭔가요',
    '필요 서류 보기':'M&A 필요 서류가 뭔가요',
    '세금 안내':'M&A 세금에 대해 알려주세요',
    '인허가 안내':'인허가 이전은 어떻게 하나요',
    '전문가 상담':'전문가 매칭 해주세요',
    '전문가 매칭':'전문가 매칭 해주세요',
    '전문가 매칭 바로가기':'전문가 매칭 해주세요',
    '병원 매각 등록':'병원 매각을 등록하고 싶어요',
    '기업 매각 등록':'기업 매각을 등록하고 싶어요',
    '양도 등록':'양도 등록을 하고 싶어요',
    '가치평가 신청하기':'가치평가 신청하고 싶어요',
    '실사 지원 신청':'실사 지원을 신청하고 싶어요',
    '실사 지원 바로가기':'실사 지원을 신청하고 싶어요',
    '양수 매물 검색':'양도양수 매물 추천',
    '매각 절차':'매각 절차가 어떻게 되나요',
    '로그인하기':'거래 현황 확인',
    '거래 현황 보기':'거래 현황 확인',
    '1:1 문의하기':'비용 문의',
    '매물 등록하기':'매물을 등록하고 싶어요',
    '이용 가이드':'절차가 어떻게 되나요',
    '병원 매각 등록 바로가기':'병원 매각을 등록하고 싶어요',
    '기업 매각 등록 바로가기':'기업 매각을 등록하고 싶어요'
  };

  // ── UI Build ──
  function init(){
    // FAB
    const fab = document.createElement('button');
    fab.className = 'ai-fab';
    fab.setAttribute('aria-label','AI상담톡');
    fab.innerHTML = '💬';
    document.body.appendChild(fab);

    // Chat Panel
    const chat = document.createElement('div');
    chat.className = 'ai-chat';
    chat.innerHTML = `
      <div class="ai-chat-header">
        <div class="avatar">🤖</div>
        <div class="info"><h4>AI상담톡</h4><span>M&A 전문 AI</span></div>
        <button class="close-chat" aria-label="닫기">✕</button>
      </div>
      <div class="ai-chat-body" id="aiChatBody"></div>
      <div class="chat-chips" id="aiChips"></div>
      <div class="ai-chat-input">
        <input type="text" id="aiInput" placeholder="질문을 입력하세요..." autocomplete="off">
        <button id="aiSend" aria-label="전송">➤</button>
      </div>`;
    document.body.appendChild(chat);

    const body = document.getElementById('aiChatBody');
    const chipsEl = document.getElementById('aiChips');
    const input = document.getElementById('aiInput');
    const sendBtn = document.getElementById('aiSend');

    // Toggle
    fab.addEventListener('click', () => {
      const isOpen = chat.classList.toggle('open');
      fab.classList.toggle('open', isOpen);
      fab.innerHTML = isOpen ? '✕' : '💬';
      if(isOpen && body.children.length === 0) showWelcome();
      if(isOpen) input.focus();
    });
    chat.querySelector('.close-chat').addEventListener('click', () => {
      chat.classList.remove('open');
      fab.classList.remove('open');
      fab.innerHTML = '💬';
    });

    // Send
    function send(){
      const text = input.value.trim();
      if(!text) return;
      addMsg(text, 'user');
      input.value = '';
      chipsEl.innerHTML = '';
      showTyping();
      setTimeout(() => {
        hideTyping();
        const resp = getResponse(text);
        addMsg(resp.text, 'bot', resp.link);
        if(resp.chips) showChips(resp.chips);
      }, 600 + Math.random() * 400);
    }
    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', e => { if(e.key === 'Enter') send(); });

    function addMsg(text, role, link){
      const div = document.createElement('div');
      div.className = 'chat-msg ' + role;
      const now = new Date();
      const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
      let html = text.replace(/\n/g,'<br>');
      if(link){
        html += `<br><a href="${link.url}" style="color:${role==='bot'?'var(--primary)':'#fff'};text-decoration:underline;font-weight:600;font-size:.85rem">${link.text} →</a>`;
      }
      html += `<span class="msg-time">${time}</span>`;
      div.innerHTML = html;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function showChips(chips){
      chipsEl.innerHTML = '';
      chips.forEach(label => {
        const btn = document.createElement('button');
        btn.className = 'chat-chip';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          const query = chipMap[label] || label;
          addMsg(label, 'user');
          chipsEl.innerHTML = '';
          showTyping();
          setTimeout(() => {
            hideTyping();
            const resp = getResponse(query);
            addMsg(resp.text, 'bot', resp.link);
            if(resp.chips) showChips(resp.chips);
          }, 600 + Math.random() * 400);
        });
        chipsEl.appendChild(btn);
      });
    }

    let typingEl = null;
    function showTyping(){
      typingEl = document.createElement('div');
      typingEl.className = 'typing-indicator';
      typingEl.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typingEl);
      body.scrollTop = body.scrollHeight;
    }
    function hideTyping(){
      if(typingEl){ typingEl.remove(); typingEl = null; }
    }

    function showWelcome(){
      addMsg('안녕하세요! AI상담톡입니다. 😊\n\n병원·기업 M&A에 관한 모든 것을 도와드립니다.\n무엇이 궁금하신가요?','bot');
      showChips(['매물 찾기','M&A 절차 안내','세금/법률 질문','가치평가 상담','실사 안내','매물 등록 도움']);
    }
  }

  // Start
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

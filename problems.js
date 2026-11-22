/* =========================================================
   포인트 충전 문제: 4가지 유형을 숫자만 바꿔 무작위로 만듦
   그림은 교과서 형식(흰 바탕, 검은 굵은 선, 둥근 점선 호로 길이 표시,
   Times 글꼴, 꼭짓점은 정자체, 문자 x·y는 이탤릭)
========================================================= */
(function(){
  const W=320, H=270;
  const FONT='font-family="Times New Roman, Times, serif"';
  const rnd=a=>a[Math.floor(Math.random()*a.length)];
  const ri=(lo,hi)=>lo+Math.floor(Math.random()*(hi-lo+1));
  const P=(x,y)=>({x,y});
  const lerp=(a,b,t)=>P(a.x+(b.x-a.x)*t, a.y+(b.y-a.y)*t);
  const mid=(a,b)=>lerp(a,b,.5);

  // 길이 라벨: 숫자면 "12 cm", 문자면 이탤릭 x + " cm"
  function lab(v){ return (typeof v==='number') ? `${v} cm` : `<tspan font-style="italic">${v}</tspan> cm`; }
  function text(p,s,opt={}){
    const size=opt.size||21, anchor=opt.anchor||'middle', it=opt.italic?' font-style="italic"':'';
    return `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" ${FONT} font-size="${size}" text-anchor="${anchor}" dominant-baseline="middle"${it} fill="#000">${s}</text>`;
  }
  function seg(a,b,w=3){ return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#000" stroke-width="${w}" stroke-linecap="round"/>`; }
  function poly(ps){ return `<polygon points="${ps.map(p=>p.x+','+p.y).join(' ')}" fill="none" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`; }
  // 둥근 점선 호: a에서 b까지, away 점에서 멀어지는 쪽으로 볼록, 라벨은 호 바깥
  // lt: 라벨을 호의 어느 지점(0~1)에 둘지 (겹칠 때 옮기기용)
  function arc(a,b,away,bulge,label,lofs=16,lt=.5){
    const m=mid(a,b), dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1;
    let nx=dy/L, ny=-dx/L;
    if((m.x-away.x)*nx+(m.y-away.y)*ny<0){ nx=-nx; ny=-ny; }
    const c=P(m.x+nx*bulge*2, m.y+ny*bulge*2);
    const u=1-lt, top=P(u*u*a.x+2*u*lt*c.x+lt*lt*b.x, u*u*a.y+2*u*lt*c.y+lt*lt*b.y);
    const lp=P(top.x+nx*lofs, top.y+ny*lofs);
    return `<path d="M${a.x},${a.y} Q${c.x.toFixed(1)},${c.y.toFixed(1)} ${b.x},${b.y}" fill="none" stroke="#555" stroke-width="2.2" stroke-dasharray="0.1 6" stroke-linecap="round"/>`+text(lp,label,{size:19});
  }
  // 평행 표시(작은 화살촉)
  function arrowMark(a,b){
    const m=mid(a,b), dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L, s=7;
    const tip=P(m.x+ux*s, m.y+uy*s), l=P(m.x-ux*s+(-uy)*s*.8, m.y-uy*s+ux*s*.8), r=P(m.x-ux*s-(-uy)*s*.8, m.y-uy*s-ux*s*.8);
    return `<polygon points="${tip.x},${tip.y} ${l.x},${l.y} ${r.x},${r.y}" fill="#000"/>`;
  }
  function svg(inner){ return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;background:#fff">${inner}</svg>`; }
  const OL=s=>`<span style="text-decoration:overline">${s}</span>`;
  const IT=s=>`<i style="font-family:'Times New Roman',Times,serif">${s}</i>`;

  /* 1. 삼각형에서 평행선 사이의 선분의 길이의 비 */
  function triParallel(){
    const p=ri(2,4), q=p+ri(1,3), t1=ri(2,5); let s=ri(2,5); if(s===t1) s=t1===5?4:t1+1;
    const AD=p*t1, AB=q*t1, AE=p*s, AC=q*s;
    const askAC=Math.random()<.65;
    const A=P(165,30), B=P(58,232), C=P(282,232), D=lerp(A,B,.58), E=lerp(A,C,.58), G=P((A.x+B.x+C.x)/3,(A.y+B.y+C.y)/3);
    let g=poly([A,B,C])+seg(D,E)+arrowMark(D,E)+arrowMark(B,C);
    g+=text(P(A.x,A.y-15),'A')+text(P(B.x-12,B.y+12),'B')+text(P(C.x+12,C.y+12),'C')+text(P(D.x-15,D.y),'D')+text(P(E.x+15,E.y),'E');
    g+=arc(A,D,G,10,lab(AD),18,.45)+arc(A,B,G,30,lab(AB),16,.78)+arc(A,E,G,10,lab(askAC?AE:'x'),18,.45)+arc(A,C,G,30,lab(askAC?'x':AC),16,.78);
    const ans=askAC?AC:AE;
    return { type:'삼각형에서 평행선 사이의 선분의 길이의 비', svg:svg(g),
      q:`다음 그림에서 ${OL('DE')} ∥ ${OL('BC')}일 때, ${IT('x')}의 값을 구하시오.`, ans,
      explain:`${OL('AD')} : ${OL('AB')} = ${OL('AE')} : ${OL('AC')} 이므로 ${AD} : ${AB} = ${askAC?AE:IT('x')} : ${askAC?IT('x'):AC}, ${IT('x')} = ${ans}` };
  }

  /* 2. 평행선 사이의 선분의 길이의 비 */
  function lineParallel(){
    const [u,v]=rnd([[1,2],[2,3],[3,4],[2,5],[3,5],[4,5],[3,2],[4,3],[5,3],[5,4]]);
    const g1=ri(1,4); let h1=ri(1,4); if(h1===g1) h1=g1===4?2:g1+1;
    const vals=[u*g1, v*g1, u*h1, v*h1];          // 왼쪽 위, 왼쪽 아래, 오른쪽 위, 오른쪽 아래
    const k=rnd([1,3,3,2]);                        // 모르는 칸 (오른쪽이 더 자주)
    const yl=40, ym=128, yn=228;
    const L1=P(104,10), L2=P(86,256), R1=P(146,10), R2=P(240,256);
    const at=(a,b,y)=>P(a.x+(b.x-a.x)*(y-a.y)/(b.y-a.y), y);
    const lA=at(L1,L2,yl), lB=at(L1,L2,ym), lC=at(L1,L2,yn), rA=at(R1,R2,yl), rB=at(R1,R2,ym), rC=at(R1,R2,yn);
    let g='';
    for(const [y,n] of [[yl,'l'],[ym,'m'],[yn,'n']]){ g+=seg(P(14,y),P(286,y),2.6)+text(P(300,y),n,{italic:true}); }
    g+=seg(L1,L2)+seg(R1,R2);
    const show=i=> i===k ? lab('x') : lab(vals[i]);
    g+=arc(lA,lB,P(400,ym),16,show(0),22)+arc(lB,lC,P(400,ym),16,show(1),22)+arc(rA,rB,P(-200,ym),16,show(2),24)+arc(rB,rC,P(-200,ym),16,show(3),24);
    const sh=i=> i===k ? IT('x') : vals[i];
    return { type:'평행선 사이의 선분의 길이의 비', svg:svg(g),
      q:`다음 그림에서 ${IT('l')} ∥ ${IT('m')} ∥ ${IT('n')}일 때, ${IT('x')}의 값을 구하시오.`, ans:vals[k],
      explain:`${sh(0)} : ${sh(1)} = ${sh(2)} : ${sh(3)} 이므로 ${IT('x')} = ${vals[k]}` };
  }

  /* 3. 무게중심과 중선 */
  function centroid(){
    const k=ri(2,7), m=ri(4,10);                   // EG = k, BC = 2m → BD = m(x), GC = 2k(y)
    const A=P(150,24), B=P(36,206), C=P(292,206), D=mid(B,C), E=mid(A,B), G=P((A.x+B.x+C.x)/3,(A.y+B.y+C.y)/3);
    let g=poly([A,B,C])+seg(A,D,2.6)+seg(C,E,2.6);
    g+=text(P(A.x,A.y-15),'A')+text(P(B.x-12,B.y+10),'B')+text(P(C.x+12,C.y+10),'C')+text(P(D.x+4,D.y-14),'D')+text(P(E.x-15,E.y-2),'E')+text(P(G.x+6,G.y-17),'G');
    g+=arc(E,G,A,9,lab(k),15)+arc(G,C,A,9,lab('y'),15,.55)+arc(B,D,A,7,lab('x'),12)+arc(B,C,A,32,lab(2*m),13);
    const ans=m+2*k;
    return { type:'무게중심과 중선', svg:svg(g),
      q:`다음 그림에서 점 G가 △ABC의 무게중심일 때, ${IT('x')}+${IT('y')}의 값을 구하시오.`, ans,
      explain:`${OL('BD')} = ½${OL('BC')} = ${m}, ${OL('GC')} = 2${OL('EG')} = ${2*k} 이므로 ${IT('x')}+${IT('y')} = ${m}+${2*k} = ${ans}` };
  }

  /* 4. 피타고라스 정리 */
  function pythagoras(){
    const [a,b,c]=rnd([[3,4,5],[6,8,10],[5,12,13],[8,6,10],[12,5,13],[9,12,15],[8,15,17],[12,16,20],[7,24,25],[15,8,17]]);
    const k=rnd(['c','b','b','a']);                // 세로 a, 가로 b, 빗변 c 중 모르는 것
    const Pt=P(62,40), Q=P(62,208), R=P(292,208);
    let g=poly([Pt,Q,R])+`<polyline points="${Q.x},${Q.y-14} ${Q.x+14},${Q.y-14} ${Q.x+14},${Q.y}" fill="none" stroke="#000" stroke-width="2"/>`;
    g+=arc(Pt,Q,R,13,lab(k==='a'?'x':a),26)+arc(Pt,R,Q,15,lab(k==='c'?'x':c),16)+arc(Q,R,Pt,13,lab(k==='b'?'x':b),15);
    const ans={a,b,c}[k];
    const eq = k==='c' ? `${IT('x')}² = ${a}² + ${b}² = ${a*a+b*b}` : `${IT('x')}² = ${c}² − ${k==='a'?b:a}² = ${ans*ans}`;
    return { type:'피타고라스 정리', svg:svg(g),
      q:`다음 그림의 직각삼각형에서 ${IT('x')}의 값을 구하시오.`, ans,
      explain:`피타고라스 정리에 의하여 ${eq}, ${IT('x')} > 0 이므로 ${IT('x')} = ${ans}` };
  }

  const MAKERS=[triParallel, lineParallel, centroid, pythagoras];
  let lastType=-1;
  window.NB_makeProblem=function(){
    let i; do{ i=Math.floor(Math.random()*MAKERS.length); }while(i===lastType && MAKERS.length>1);
    lastType=i; return MAKERS[i]();
  };
  window.NB_problemMakers=MAKERS;
})();

document.addEventListener("DOMContentLoaded",()=>{
 const cards=[...document.querySelectorAll(".customer-card")], q=document.getElementById("customerSearch"), empty=document.getElementById("customerEmpty"), meta=document.getElementById("customerResultsMeta"), summary=document.getElementById("customerActiveFilters"); let quick="all";
 const $=id=>document.getElementById(id), n=v=>(v||"").toString().trim().toLowerCase().replace(/[يى]/g,"ی").replace(/ك/g,"ک");
 function f(){
  return{
   type:$("cfType")?.value||"",
   property:$("cfProperty")?.value||"",
   city:$("cfCity")?.value||"",
   area:$("cfArea")?.value||"",
   min:+$("cfMinArea")?.value||null,
   max:+$("cfMaxArea")?.value||null,
   rooms:$("cfRooms")?.value||"",
   status:$("cfStatus")?.value||"",
   buyMin:+$("cfBudgetBuyMin")?.value||null,
   buyMax:+$("cfBudgetBuyMax")?.value||null,
   depMin:+$("cfBudgetDepositMin")?.value||null,
   depMax:+$("cfBudgetDepositMax")?.value||null,
   rentMin:+$("cfBudgetRentMin")?.value||null,
   rentMax:+$("cfBudgetRentMax")?.value||null
  };
 }
 function labelsOf(x){
  const labels=[];
  if(x.type)labels.push({buy:"خرید",rent:"اجاره",mortgage:"رهن"}[x.type]);
  if(x.property)labels.push(x.property);
  if(x.city)labels.push("شهر: "+x.city);
  if(x.area)labels.push("محدوده: "+x.area);
  if(x.min||x.max)labels.push(`متراژ ${x.min||"۰"} تا ${x.max||"∞"}`);
  if(x.buyMin||x.buyMax)labels.push(`بودجه خرید ${x.buyMin||"۰"} تا ${x.buyMax||"∞"}`);
  if(x.depMin||x.depMax)labels.push(`بودجه رهن ${x.depMin||"۰"} تا ${x.depMax||"∞"}`);
  if(x.rentMin||x.rentMax)labels.push(`بودجه اجاره ${x.rentMin||"۰"} تا ${x.rentMax||"∞"}`);
  if(x.rooms)labels.push(x.rooms==="4"?"۴ خواب و بیشتر":x.rooms+" خواب");
  if(x.status)labels.push({active:"در حال پیگیری",urgent:"فوری",closed:"بسته‌شده"}[x.status]);
  return labels;
 }
 function render(){
  const x=f(), query=n(q?.value||""); let c=0;
  cards.forEach(card=>{
   let hay=n([card.dataset.name,card.dataset.phone,card.dataset.city,card.dataset.areaName,card.innerText].join(" ")),ok=!query||hay.includes(query);
   if(x.type)ok&&=card.dataset.type===x.type;
   if(x.property)ok&&=card.dataset.property===x.property;
   if(x.city)ok&&=n(card.dataset.city).includes(n(x.city));
   if(x.area)ok&&=n(card.dataset.areaName).includes(n(x.area));
   if(x.min)ok&&=+card.dataset.maxarea>=x.min;
   if(x.max)ok&&=+card.dataset.minarea<=x.max;
   if(x.rooms==="4")ok&&=+card.dataset.rooms>=4; else if(x.rooms)ok&&=+card.dataset.rooms===+x.rooms;
   if(x.status)ok&&=card.dataset.status===x.status;
   const buy=+(card.dataset.budgetBuy||0), dep=+(card.dataset.budgetDeposit||0), rent=+(card.dataset.budgetRent||0);
   if(x.buyMin!=null)ok&&=buy>=x.buyMin;
   if(x.buyMax!=null)ok&&=buy>0 && buy<=x.buyMax;
   if(x.depMin!=null)ok&&=dep>=x.depMin;
   if(x.depMax!=null)ok&&=dep>0 && dep<=x.depMax;
   if(x.rentMin!=null)ok&&=rent>=x.rentMin;
   if(x.rentMax!=null)ok&&=rent>0 && rent<=x.rentMax;
   if(quick==="buy"||quick==="rent"||quick==="mortgage")ok&&=card.dataset.type===quick;
   if(quick==="urgent")ok&&=card.dataset.status==="urgent";
   card.classList.toggle("d-none",!ok); if(ok)c++;
  });
  const labels=labelsOf(x);
  if(summary) summary.innerHTML=labels.length?labels.map(v=>`<span class="active-filter">${v}</span>`).join(""):`<span class="active-filter">بدون فیلتر</span>`;
  if(meta) meta.textContent=`${c} مشتری از ${cards.length} مشتری نمونه نمایش داده می‌شود`;
  if(empty) empty.classList.toggle("d-none",c!==0);
 }
 function reset(){
  document.querySelectorAll("#advancedCustomerFilters input").forEach(el=>{ if(el.type==="checkbox") el.checked=false; else el.value=""; });
  document.querySelectorAll("#advancedCustomerFilters select").forEach(el=>el.value="");
  if(q) q.value="";
  quick="all";
  document.querySelectorAll("[data-customer-quick]").forEach(x=>x.classList.toggle("active",x.dataset.customerQuick==="all"));
  render();
 }
 document.querySelectorAll("[data-customer-quick]").forEach(b=>b.addEventListener("click",()=>{
  quick=b.dataset.customerQuick;
  document.querySelectorAll("[data-customer-quick]").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  render();
 }));
 if(q){ q.addEventListener("input",render); q.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); render(); } }); }
 $("customerSearchBtn")?.addEventListener("click",render);
 $("applyCustomerFilters")?.addEventListener("click",render);
 $("clearCustomerSearch")?.addEventListener("click",reset);
 $("resetCustomerFilters")?.addEventListener("click",reset);
 $("emptyClearCustomer")?.addEventListener("click",reset);
 $("customerSort")?.addEventListener("change",e=>{
  let type=e.target.value; if(!type) return;
  cards.sort((a,b)=>type==="name"?a.dataset.name.localeCompare(b.dataset.name,"fa"):type==="area"?+b.dataset.maxarea-+a.dataset.maxarea:0)
   .forEach(c=>document.getElementById("customersList").appendChild(c));
 });
 render();
});

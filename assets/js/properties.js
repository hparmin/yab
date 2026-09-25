document.addEventListener("DOMContentLoaded", () => {
 const rows=[...document.querySelectorAll(".property-row")], q=document.getElementById("propertySearch");
 const get=id=>document.getElementById(id), empty=get("propertyEmpty"), meta=get("propertyResultsMeta"), summary=get("propertyActiveFilters");
 let quick="all"; const fixedDeal=document.body.dataset.fixedDeal||"";
 const norm=v=>(v||"").toString().trim().toLowerCase().replace(/[يى]/g,"ی").replace(/ك/g,"ک");

 function filters(){
  const el=id=>get(id);
  return {
   type: el("filterPropertyType")?.value||"",
   deal: el("filterDeal")?.value||"",
   province: el("filterProvince")?.value||"",
   city: el("filterCity")?.value||"",
   district: el("filterDistrict")?.value||"",
   owner: el("filterOwner")?.value||"",
   usage: el("filterUsage")?.value||"",
   amin: +el("filterAreaMin")?.value||null,
   amax: +el("filterAreaMax")?.value||null,
   rooms: el("filterRooms")?.value||"",
   floor: el("filterFloor")?.value||"",
   ymin: +el("filterYearMin")?.value||null,
   ymax: +el("filterYearMax")?.value||null,
   status: el("filterStatus")?.value||"",
   parking: !!el("amenityParking")?.checked,
   elevator: !!el("amenityElevator")?.checked,
   /* sale price */
   pmin: +el("filterPriceMin")?.value||null,
   pmax: +el("filterPriceMax")?.value||null,
   /* rent: deposit (rahn) & rent (ejare) */
   dmin: +el("filterDepositMin")?.value||null,
   dmax: +el("filterDepositMax")?.value||null,
   rmin: +el("filterRentMin")?.value||null,
   rmax: +el("filterRentMax")?.value||null
  };
 }

 function activeLabels(f){
  const a=[];
  if(f.type)a.push(f.type);
  if(f.usage)a.push("کاربری: "+f.usage);
  if(f.deal)a.push(f.deal==="sale"?"فروش":"رهن و اجاره");
  if(f.province)a.push(f.province);
  if(f.city)a.push("شهر: "+f.city);
  if(f.district)a.push("محدوده: "+f.district);
  if(f.owner)a.push("مالک: "+f.owner);
  if(f.amin||f.amax)a.push(`متراژ ${f.amin||"۰"} تا ${f.amax||"∞"}`);
  if(f.pmin||f.pmax)a.push(`قیمت ${f.pmin||"۰"} تا ${f.pmax||"∞"}`);
  if(f.dmin||f.dmax)a.push(`رهن ${f.dmin||"۰"} تا ${f.dmax||"∞"}`);
  if(f.rmin||f.rmax)a.push(`اجاره ${f.rmin||"۰"} تا ${f.rmax||"∞"}`);
  if(f.rooms)a.push(f.rooms==="4"?"۴ خواب و بیشتر":f.rooms+" خواب");
  if(f.floor)a.push("طبقه: "+f.floor);
  if(f.ymin||f.ymax)a.push(`ساخت ${f.ymin||"۰"} تا ${f.ymax||"∞"}`);
  if(f.status)a.push(f.status==="active"?"فعال":"در انتظار");
  if(f.parking)a.push("پارکینگ");
  if(f.elevator)a.push("آسانسور");
  return a;
 }

 function render(){
  const f=filters(), query=norm(q?.value||""); let count=0;
  rows.forEach(r=>{
   const hay=norm([r.dataset.code,r.dataset.type,r.dataset.usage,r.dataset.deal==="sale"?"فروش":"رهن و اجاره",r.dataset.city,r.dataset.province,r.dataset.district,r.dataset.owner,r.innerText].join(" "));
   let ok=(!query||hay.includes(query)) && (!fixedDeal || r.dataset.deal===fixedDeal);
   if(f.type)ok&&=r.dataset.type===f.type;
   if(f.usage)ok&&=r.dataset.usage===f.usage;
   if(f.deal)ok&&=r.dataset.deal===f.deal;
   if(f.province)ok&&=r.dataset.province===f.province;
   if(f.city)ok&&=norm(r.dataset.city).includes(norm(f.city));
   if(f.district)ok&&=norm(r.dataset.district).includes(norm(f.district));
   if(f.owner)ok&&=norm(r.dataset.owner).includes(norm(f.owner));
   const area=+r.dataset.area, year=+r.dataset.year, room=+r.dataset.rooms;
   const price=+r.dataset.price||0, deposit=+r.dataset.deposit||0, rent=+r.dataset.rent||0;
   if(f.amin)ok&&=area>=f.amin; if(f.amax)ok&&=area<=f.amax;
   if(f.rooms==="4")ok&&=room>=4; else if(f.rooms)ok&&=room===+f.rooms;
   if(f.floor)ok&&=norm(r.dataset.floor)===norm(f.floor);
   if(f.ymin)ok&&=year>=f.ymin; if(f.ymax)ok&&=year<=f.ymax;
   if(f.status)ok&&=r.dataset.status===f.status;
   if(f.parking)ok&&=(r.dataset.amenities||"").includes("parking");
   if(f.elevator)ok&&=(r.dataset.amenities||"").includes("elevator");
   /* price filters */
   if(f.pmin)ok&&=price>=f.pmin; if(f.pmax)ok&&=price<=f.pmax;
   if(f.dmin)ok&&=deposit>=f.dmin; if(f.dmax)ok&&=deposit<=f.dmax;
   if(f.rmin)ok&&=rent>=f.rmin; if(f.rmax)ok&&=rent<=f.rmax;
   if(quick==="sale")ok&&=r.dataset.deal==="sale";
   if(quick==="rent")ok&&=r.dataset.deal==="rent";
   if(quick==="apartment")ok&&=r.dataset.type==="آپارتمان";
   if(quick==="villa")ok&&=r.dataset.type==="ویلایی";
   if(quick==="land")ok&&=r.dataset.type==="زمین";
   r.classList.toggle("d-none",!ok); if(ok)count++;
  });
  const labels=activeLabels(f);
  if(fixedDeal) labels.unshift(fixedDeal==="sale"?"فروش":"رهن و اجاره");
  if(summary) summary.innerHTML=labels.length?labels.map(x=>`<span class="active-filter">${x}</span>`).join(""):`<span class="active-filter">بدون فیلتر</span>`;
  if(meta) meta.textContent=`${count} فایل از ${rows.length} فایل نمونه نمایش داده می‌شود`;
  if(empty) empty.classList.toggle("d-none",count!==0);
 }

 /**
  * Collect filter values as query-string params for Laravel backend.
  * In production: submit via form GET or fetch API so filtering runs on all DB records, not just current page.
  */
 function collectFilterParams(){
  const f=filters();
  const params=new URLSearchParams();
  if(q?.value) params.set("q", q.value.trim());
  if(f.type) params.set("type", f.type);
  if(f.usage) params.set("usage", f.usage);
  if(f.deal) params.set("deal", f.deal);
  if(f.province) params.set("province", f.province);
  if(f.city) params.set("city", f.city);
  if(f.district) params.set("district", f.district);
  if(f.owner) params.set("owner", f.owner);
  if(f.amin!=null) params.set("area_min", f.amin);
  if(f.amax!=null) params.set("area_max", f.amax);
  if(f.pmin!=null) params.set("price_min", f.pmin);
  if(f.pmax!=null) params.set("price_max", f.pmax);
  if(f.dmin!=null) params.set("deposit_min", f.dmin);
  if(f.dmax!=null) params.set("deposit_max", f.dmax);
  if(f.rmin!=null) params.set("rent_min", f.rmin);
  if(f.rmax!=null) params.set("rent_max", f.rmax);
  if(f.rooms) params.set("rooms", f.rooms);
  if(f.floor) params.set("floor", f.floor);
  if(f.ymin!=null) params.set("year_min", f.ymin);
  if(f.ymax!=null) params.set("year_max", f.ymax);
  if(f.status) params.set("status", f.status);
  if(f.parking) params.set("parking", "1");
  if(f.elevator) params.set("elevator", "1");
  if(quick && quick!=="all") params.set("quick", quick);
  if(fixedDeal) params.set("deal", fixedDeal);
  return params;
 }

 function applyFilters(){
  /* Demo: still filter client-side rows. For Laravel, navigate or fetch:
     window.location.href = (fixedDeal==="sale"?"/sale-properties":"/rent-properties") + "?" + collectFilterParams().toString();
     or: fetch("/api/properties?"+collectFilterParams()).then(...)
  */
  render();
 }

 function reset(){
  document.querySelectorAll("#advancedPropertyFilters input").forEach(x=>{
   if(x.type==="checkbox") x.checked=false; else x.value="";
  });
  document.querySelectorAll("#advancedPropertyFilters select").forEach(x=>x.value="");
  if(q) q.value="";
  quick="all";
  document.querySelectorAll("[data-property-quick]").forEach(x=>x.classList.toggle("active",x.dataset.propertyQuick==="all"));
  render();
 }

 document.querySelectorAll("[data-property-quick]").forEach(b=>b.addEventListener("click",()=>{
  quick=b.dataset.propertyQuick;
  document.querySelectorAll("[data-property-quick]").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  render();
 }));

 /* Only live-filter search box and quick chips; advanced filters apply on button click */
 if(q){
  q.addEventListener("input",render);
  q.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();applyFilters();}});
 }
 const searchBtn=get("propertySearchBtn");
 if(searchBtn) searchBtn.addEventListener("click",applyFilters);
 const applyBtn=get("applyPropertyFilters");
 if(applyBtn) applyBtn.addEventListener("click",applyFilters);
 const clearBtn=get("clearPropertySearch");
 if(clearBtn) clearBtn.addEventListener("click",reset);
 const resetBtn=get("resetPropertyFilters");
 if(resetBtn) resetBtn.addEventListener("click",reset);
 const emptyClear=get("emptyClearProperty");
 if(emptyClear) emptyClear.addEventListener("click",reset);

 const sortEl=get("propertySort");
 if(sortEl) sortEl.addEventListener("change",e=>{
  const type=e.target.value; if(!type) return;
  const body=get("propertyTbody");
  rows.sort((a,b)=>{
   let av=type==="owner"?a.dataset.owner:type==="code"?+a.dataset.code:+a.dataset[type];
   let bv=type==="owner"?b.dataset.owner:type==="code"?+b.dataset.code:+b.dataset[type];
   return typeof av==="string"?av.localeCompare(bv,"fa"):+bv-(+av);
  }).forEach(r=>body.appendChild(r));
 });

 render();
});

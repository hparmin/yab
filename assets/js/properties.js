document.addEventListener("DOMContentLoaded", () => {
 const rows=[...document.querySelectorAll(".property-row")], q=document.getElementById("propertySearch");
 const get=id=>document.getElementById(id), empty=get("propertyEmpty"), meta=get("propertyResultsMeta"), summary=get("propertyActiveFilters");
 let quick="all"; const fixedDeal=document.body.dataset.fixedDeal||"";
 const norm=v=>(v||"").toString().trim().toLowerCase().replace(/[يى]/g,"ی").replace(/ك/g,"ک");
 function filters(){
  return {
   type:get("filterPropertyType").value, deal:get("filterDeal").value, province:get("filterProvince").value,
   city:get("filterCity").value, district:get("filterDistrict").value, owner:get("filterOwner").value,
   amin:+get("filterAreaMin").value||null, amax:+get("filterAreaMax").value||null, rooms:get("filterRooms").value,
   floor:get("filterFloor").value, ymin:+get("filterYearMin").value||null, ymax:+get("filterYearMax").value||null,
   status:get("filterStatus").value, parking:get("amenityParking").checked, elevator:get("amenityElevator").checked
  };
 }
 function activeLabels(f){
  const a=[]; if(f.type)a.push(f.type); if(f.deal)a.push(f.deal==="sale"?"فروش":"رهن و اجاره"); if(f.province)a.push(f.province);
  if(f.city)a.push("شهر: "+f.city); if(f.district)a.push("محدوده: "+f.district); if(f.owner)a.push("مالک: "+f.owner);
  if(f.amin||f.amax)a.push(`متراژ ${f.amin||"۰"} تا ${f.amax||"∞"}`); if(f.rooms)a.push(f.rooms==="4"?"۴ خواب و بیشتر":f.rooms+" خواب");
  if(f.floor)a.push("طبقه: "+f.floor); if(f.ymin||f.ymax)a.push(`ساخت ${f.ymin||"۰"} تا ${f.ymax||"∞"}`);
  if(f.status)a.push(f.status==="active"?"فعال":"در انتظار"); if(f.parking)a.push("پارکینگ"); if(f.elevator)a.push("آسانسور");
  return a;
 }
 function render(){
  const f=filters(), query=norm(q.value); let count=0;
  rows.forEach(r=>{
   const hay=norm([r.dataset.code,r.dataset.type,r.dataset.deal==="sale"?"فروش":"رهن و اجاره",r.dataset.city,r.dataset.province,r.dataset.district,r.dataset.owner,r.innerText].join(" "));
   let ok=(!query||hay.includes(query)) && (!fixedDeal || r.dataset.deal===fixedDeal);
   if(f.type)ok&&=r.dataset.type===f.type;if(f.deal)ok&&=r.dataset.deal===f.deal;if(f.province)ok&&=r.dataset.province===f.province;
   if(f.city)ok&&=norm(r.dataset.city).includes(norm(f.city));if(f.district)ok&&=norm(r.dataset.district).includes(norm(f.district));if(f.owner)ok&&=norm(r.dataset.owner).includes(norm(f.owner));
   const area=+r.dataset.area, year=+r.dataset.year, room=+r.dataset.rooms;
   if(f.amin)ok&&=area>=f.amin;if(f.amax)ok&&=area<=f.amax;if(f.rooms==="4")ok&&=room>=4;else if(f.rooms)ok&&=room===+f.rooms;
   if(f.floor)ok&&=norm(r.dataset.floor)===norm(f.floor);if(f.ymin)ok&&=year>=f.ymin;if(f.ymax)ok&&=year<=f.ymax;if(f.status)ok&&=r.dataset.status===f.status;
   if(f.parking)ok&&=r.dataset.amenities.includes("parking");if(f.elevator)ok&&=r.dataset.amenities.includes("elevator");
   if(quick==="sale")ok&&=r.dataset.deal==="sale";if(quick==="rent")ok&&=r.dataset.deal==="rent";if(quick==="apartment")ok&&=r.dataset.type==="آپارتمان";if(quick==="villa")ok&&=r.dataset.type==="ویلایی";if(quick==="land")ok&&=r.dataset.type==="زمین";
   r.classList.toggle("d-none",!ok);if(ok)count++;
  });
  const labels=activeLabels(f); if(fixedDeal) labels.unshift(fixedDeal==="sale"?"فروش":"رهن و اجاره"); summary.innerHTML=labels.length?labels.map(x=>`<span class="active-filter">${x}</span>`).join(""):`<span class="active-filter">بدون فیلتر</span>`;
  meta.textContent=`${count} فایل از ${rows.length} فایل نمونه نمایش داده می‌شود`;
  empty.classList.toggle("d-none",count!==0);
 }
 function reset(){ document.querySelectorAll("#advancedPropertyFilters input").forEach(x=>{if(x.type==="checkbox")x.checked=false;else x.value=""});document.querySelectorAll("#advancedPropertyFilters select").forEach(x=>x.value="");q.value="";quick="all";document.querySelectorAll("[data-property-quick]").forEach(x=>x.classList.toggle("active",x.dataset.propertyQuick==="all"));render(); }
 document.querySelectorAll("[data-property-quick]").forEach(b=>b.addEventListener("click",()=>{quick=b.dataset.propertyQuick;document.querySelectorAll("[data-property-quick]").forEach(x=>x.classList.remove("active"));b.classList.add("active");render()}));
 document.querySelectorAll("#advancedPropertyFilters input,#advancedPropertyFilters select").forEach(x=>x.addEventListener("input",render));
 q.addEventListener("input",render);q.addEventListener("keydown",e=>{if(e.key==="Enter")render()});
 get("propertySearchBtn").addEventListener("click",render);get("clearPropertySearch").addEventListener("click",reset);get("resetPropertyFilters").addEventListener("click",reset);get("emptyClearProperty").addEventListener("click",reset);
 get("propertySort").addEventListener("change",e=>{const type=e.target.value;if(!type)return;const body=get("propertyTbody");rows.sort((a,b)=>{let av=type==="owner"?a.dataset.owner:type==="code"?+a.dataset.code:+a.dataset[type];let bv=type==="owner"?b.dataset.owner:type==="code"?+b.dataset.code:+b.dataset[type];return typeof av==="string"?av.localeCompare(bv,"fa"):+bv-(+av)}).forEach(r=>body.appendChild(r));});
 render();
});
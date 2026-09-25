/**
 * نقشه املاک — مارکرهای HTML سفارشی (قیمت) + Popup جزئیات
 * دادهٔ نمونه برای دمو؛ در لاراول از API جایگزین کنید:
 *   fetch('/api/properties?has_coords=1').then(r => r.json()).then(initMap)
 */
document.addEventListener("DOMContentLoaded", function () {
  /* ---- داده نمونه (مختصات اطراف شیراز) ---- */
  var properties = [
    {
      id: 1024, code: "۱۰۲۴", type: "آپارتمان", deal: "sale", usage: "مسکونی",
      area: 120, city: "شیراز", district: "فرهنگ‌شهر", floor: "۳", rooms: 2,
      owner: "علی احمدی", status: "active",
      priceLabel: "۶.۸ میلیارد", priceShort: "۶.۸ میلیارد",
      lat: 29.6185, lng: 52.5220,
      detailUrl: "property-detail.html"
    },
    {
      id: 1023, code: "۱۰۲۳", type: "آپارتمان", deal: "rent", usage: "مسکونی",
      area: 95, city: "شیراز", district: "معالی‌آباد", floor: "۵", rooms: 2,
      owner: "مریم کریمی", status: "active",
      priceLabel: "رهن ۶۰۰ / اجاره ۲۲", priceShort: "۶۰۰ / ۲۲",
      lat: 29.6402, lng: 52.5055,
      detailUrl: "property-detail.html"
    },
    {
      id: 1022, code: "۱۰۲۲", type: "زمین", deal: "sale", usage: "مسکونی",
      area: 300, city: "شیراز", district: "صدرا", floor: "-", rooms: 0,
      owner: "رضا موسوی", status: "pending",
      priceLabel: "۹.۲ میلیارد", priceShort: "۹.۲ میلیارد",
      lat: 29.6850, lng: 52.4600,
      detailUrl: "property-detail.html"
    },
    {
      id: 1021, code: "۱۰۲۱", type: "ویلایی", deal: "rent", usage: "مسکونی",
      area: 240, city: "شیراز", district: "قصرالدشت", floor: "۲", rooms: 3,
      owner: "نازنین یحیی پور", status: "active",
      priceLabel: "رهن ۱.۲ میلیارد", priceShort: "۱.۲ میلیارد",
      lat: 29.6050, lng: 52.4900,
      detailUrl: "property-detail.html"
    },
    {
      id: 1020, code: "۱۰۲۰", type: "آپارتمان", deal: "rent", usage: "مسکونی",
      area: 75, city: "شیراز", district: "فرهنگ‌شهر", floor: "۱", rooms: 1,
      owner: "حسن رضایی", status: "active",
      priceLabel: "رهن ۳۰۰ / اجاره ۱۵", priceShort: "۳۰۰ / ۱۵",
      lat: 29.6120, lng: 52.5285,
      detailUrl: "property-detail.html"
    }
  ];

  var mapEl = document.getElementById("propertiesMap");
  if (!mapEl || typeof L === "undefined") return;

  var defaultCenter = [29.5918, 52.5837];
  var defaultZoom = 12;

  try {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "assets/css/images/marker-icon-2x.png",
      iconUrl: "assets/css/images/marker-icon.png",
      shadowUrl: "assets/css/images/marker-shadow.png"
    });
  } catch (e) {}

  var map = L.map("propertiesMap", {
    center: defaultCenter,
    zoom: defaultZoom,
    scrollWheelZoom: true
  });

  var mapupLayer = L.tileLayer("https://tiles.mapup.ir/styles/basic-preview/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://mapup.ir">MapUp</a> | داده‌های OpenStreetMap'
  });
  var googleLayer = L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    attribution: "Google"
  });
  var googleSatLayer = L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    attribution: "Google Satellite"
  });
  var cartoLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OSM &copy; CARTO"
  });

  mapupLayer.addTo(map);
  L.control.layers(
    {
      "نقشه ایرانی (مپ‌آپ)": mapupLayer,
      "گوگل": googleLayer,
      "گوگل ماهواره‌ای": googleSatLayer,
      "Carto": cartoLayer
    },
    null,
    { position: "topleft" }
  ).addTo(map);

  var markersLayer = L.layerGroup().addTo(map);
  var markerById = {};
  var currentFilter = "all";
  var metaEl = document.getElementById("mapResultsMeta");

  function dealBadge(deal) {
    if (deal === "sale") return '<span class="badge-soft badge-sale">فروش</span>';
    return '<span class="badge-soft badge-rent">رهن و اجاره</span>';
  }

  function statusLabel(s) {
    if (s === "active") return "فعال";
    if (s === "pending") return "در انتظار";
    return s || "—";
  }

  function popupHtml(p) {
    return (
      '<div class="map-popup">' +
        '<div class="map-popup-head">' +
          '<strong>کد ' + p.code + "</strong> " + dealBadge(p.deal) +
        "</div>" +
        '<div class="map-popup-price">' + p.priceLabel + "</div>" +
        '<ul class="map-popup-list">' +
          "<li><span>نوع</span><b>" + p.type + "</b></li>" +
          "<li><span>کاربری</span><b>" + (p.usage || "—") + "</b></li>" +
          "<li><span>متراژ</span><b>" + p.area + " متر</b></li>" +
          "<li><span>موقعیت</span><b>" + p.city + "، " + p.district + "</b></li>" +
          "<li><span>طبقه / خواب</span><b>" + p.floor + " / " + (p.rooms || "—") + "</b></li>" +
          "<li><span>مالک</span><b>" + p.owner + "</b></li>" +
          "<li><span>وضعیت</span><b>" + statusLabel(p.status) + "</b></li>" +
        "</ul>" +
        '<a class="btn btn-primary btn-sm w-100 mt-1" href="' + (p.detailUrl || "property-detail.html") + '">' +
          '<i class="bi bi-eye ms-1"></i> مشاهده جزئیات' +
        "</a>" +
      "</div>"
    );
  }

  function pinClass(deal) {
    return deal === "sale" ? "map-price-pin sale" : "map-price-pin rent";
  }

  function makeIcon(p) {
    /* iconSize/iconAnchor صفر: نقطهٔ lat/lng دقیقاً نوک پین است؛
       جابه‌جایی بصری فقط با CSS absolute از همان نقطه انجام می‌شود
       تا با زوم/پن، مختصات ثابت بماند. */
    return L.divIcon({
      className: "map-price-pin-wrap",
      html:
        '<div class="' + pinClass(p.deal) + '" title="' + (p.priceLabel || "") + '">' +
          '<span class="pin-price">' + (p.priceShort || p.priceLabel) + "</span>" +
          '<span class="pin-arrow"></span>' +
        "</div>",
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: [0, -36]
    });
  }

  function matchesFilter(p, filter) {
    if (!filter || filter === "all") return true;
    if (filter === "sale" || filter === "rent") return p.deal === filter;
    if (filter === "apartment") return p.type === "آپارتمان";
    if (filter === "villa") return p.type === "ویلایی";
    if (filter === "land") return p.type === "زمین";
    return true;
  }

  function renderMarkers() {
    markersLayer.clearLayers();
    markerById = {};
    var bounds = [];
    var count = 0;

    properties.forEach(function (p) {
      if (p.lat == null || p.lng == null) return;
      if (!matchesFilter(p, currentFilter)) return;

      var marker = L.marker([p.lat, p.lng], {
        icon: makeIcon(p),
        riseOnHover: true
      });
      marker.bindPopup(popupHtml(p), {
        maxWidth: 280,
        minWidth: 220,
        className: "map-property-popup",
        autoPanPadding: [40, 40]
      });
      marker.addTo(markersLayer);
      markerById[p.id] = marker;
      bounds.push([p.lat, p.lng]);
      count++;
    });

    if (metaEl) metaEl.textContent = count + " ملک روی نقشه";

    if (bounds.length) {
      try {
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
      } catch (e) {}
    }
  }

  document.querySelectorAll("[data-map-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentFilter = btn.getAttribute("data-map-filter") || "all";
      document.querySelectorAll("[data-map-filter]").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      renderMarkers();
    });
  });

  var fitBtn = document.getElementById("btnFitBounds");
  if (fitBtn) {
    fitBtn.addEventListener("click", function () {
      var pts = [];
      markersLayer.eachLayer(function (m) {
        var ll = m.getLatLng();
        pts.push([ll.lat, ll.lng]);
      });
      if (pts.length) map.fitBounds(pts, { padding: [48, 48], maxZoom: 15 });
      else map.setView(defaultCenter, defaultZoom);
    });
  }

  var locateBtn = document.getElementById("btnLocateMeMap");
  if (locateBtn) {
    locateBtn.addEventListener("click", function () {
      if (!navigator.geolocation) {
        alert("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.");
        return;
      }
      var btn = locateBtn;
      btn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          map.setView([pos.coords.latitude, pos.coords.longitude], 14);
          btn.disabled = false;
        },
        function () {
          alert("دسترسی به موقعیت مکانی ممکن نشد.");
          btn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  renderMarkers();
  setTimeout(function () {
    map.invalidateSize();
  }, 200);
});

# Real Estate Frontend

Pages:
- dashboard.html
- property-form.html
- properties.html

All dashboard pages share the same sidebar/header structure so they can later be extracted into a Laravel Blade layout.

Current implementation is frontend-only:
- Bootstrap 5.3.1 local assets
- Estedad font
- Responsive RTL layout
- Sale / rent-and-lease switch on the property form
- Property list with demo search and sorting
- Advanced filter UI
- No Laravel/PHP/backend code included


## تغییرات نسخه جدید
- بخش «فروش» و «رهن و اجاره» در سایدبار از هم جدا شده‌اند.
- برای هر بخش، «ملک‌های من» و «ثبت ملک» صفحه مستقل دارند.
- فرم ثبت ملک فروش و فرم ثبت ملک رهن و اجاره جدا هستند.
- کارت «پیگیری‌های امروز» داشبورد به «رهن و اجاره» تغییر کرده و آیکن آن مرتبط شده است.
- فرم ثبت مشتری اکنون «خرید» یا «رهن و اجاره» را جداگانه دریافت می‌کند و فیلدهای مالی متناسب با انتخاب کاربر نمایش داده می‌شوند.
- تم روشن/تیره اضافه شده و انتخاب کاربر در `localStorage` مرورگر با کلید `panel-theme` ذخیره می‌شود.
- فایل‌های اصلی `properties.html` و `property-form.html` برای سازگاری با نسخه قبلی نگه داشته شده‌اند؛ مسیرهای جدید از سایدبار استفاده می‌شوند.

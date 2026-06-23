-- Sample content for Arshin Kids. Paste into the Neon SQL console AFTER
-- init.sql. CLAUDE.md §11 gotcha: each block is ONE multi-row INSERT (running
-- several separate statements in the Neon console can half-apply). Re-running
-- is safe — ON CONFLICT keeps it idempotent.
-- TODO(owner): adjust copy, age ranges, and ordering to the real programs.

INSERT INTO "programs" ("id","slug","title","summary","ageRange","color","icon","order","published","createdAt","updatedAt") VALUES
  ('prog_shirkhar','shirkhar','شیرخوارگاه','مراقبت تخصصی و پر از مهر برای کوچک‌ترین مهمان‌های آرشین.','۶ ماه تا ۱٫۵ سال','fun-pink','baby',1,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('prog_nopa','nopa','نوپا','بازی، حرکت و کشف دنیای اطراف برای شکل‌گیری مهارت‌های اولیه.','۱٫۵ تا ۳ سال','fun-green','blocks',2,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('prog_mahd','mahd','مهدکودک','آموزش بازی‌محور، مهارت‌های اجتماعی و آماده‌سازی برای پیش‌دبستان.','۳ تا ۴ سال','secondary','puzzle',3,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('prog_pish','pish-dabestani','پیش‌دبستانی','آمادگی کامل برای ورود به مدرسه؛ سواد پایه، ریاضی و خلاقیت.','۵ تا ۶ سال','accent','graduation-cap',4,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('prog_foogh','foogh-barnameh','فوق‌برنامه','زبان انگلیسی، نقاشی، موسیقی و ورزش در کنار برنامه‌ی اصلی.','همه‌ی سنین','fun-purple','palette',5,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "faqs" ("id","question","answer","order","published") VALUES
  ('faq_age','از چه سنی کودکم را می‌توانم ثبت‌نام کنم؟','مهدکودک آرشین از سن ۶ ماهگی در بخش شیرخوارگاه پذیرش دارد و تا پیش‌دبستانی (۶ سال) ادامه می‌یابد.',1,true),
  ('faq_hours','ساعات کاری مهدکودک چگونه است؟','مهد در روزهای شنبه تا چهارشنبه از ساعت ۷:۳۰ صبح تا ۱۶ باز است. ساعات دقیق را در صفحه‌ی تماس ببینید.',2,true),
  ('faq_food','تغذیه‌ی کودکان چگونه تأمین می‌شود؟','وعده‌های غذایی سالم و میان‌وعده زیر نظر کارشناس تغذیه در مهد تهیه و سرو می‌شود.',3,true),
  ('faq_safety','از نظر ایمنی و بهداشت چه تمهیداتی دارید؟','فضای مهد به‌صورت روزانه ضدعفونی می‌شود، تجهیزات استاندارد و ایمن هستند و مربیان آموزش‌دیده به‌طور دائم همراه کودکان‌اند.',4,true),
  ('faq_enroll','مراحل ثبت‌نام چگونه است؟','فرم ثبت‌نام آنلاین را پر کنید؛ همکاران ما برای هماهنگی بازدید حضوری و تکمیل مدارک با شما تماس می‌گیرند.',5,true)
ON CONFLICT ("id") DO NOTHING;

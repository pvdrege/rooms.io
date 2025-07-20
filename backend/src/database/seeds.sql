-- Seed data for Rooms platform
-- Insert predefined hashtags

-- Investment related hashtags
INSERT INTO hashtags (name, display_name, category) VALUES
    ('yatirimariyorum', 'Yatırım Arıyorum', 'investment'),
    ('yatirimciyim', 'Yatırımcıyım', 'investment'),
    ('angel-investor', 'Angel Yatırımcı', 'investment'),
    ('vc-fund', 'VC Fon', 'investment'),
    ('seed-investment', 'Seed Yatırım', 'investment'),
    ('series-a', 'Series A', 'investment'),
    ('startup', 'Startup', 'investment'),
    ('girisimciyim', 'Girişimciyim', 'investment');

-- Mentorship related hashtags  
INSERT INTO hashtags (name, display_name, category) VALUES
    ('mentorariyorum', 'Mentor Arıyorum', 'mentorship'),
    ('mentorluk-yapiyorum', 'Mentorluk Yapıyorum', 'mentorship'),
    ('kariyer-danismanligi', 'Kariyer Danışmanlığı', 'mentorship'),
    ('liderlik', 'Liderlik', 'mentorship'),
    ('girisimcilik-mentoru', 'Girişimcilik Mentoru', 'mentorship'),
    ('tech-mentor', 'Teknoloji Mentoru', 'mentorship'),
    ('business-mentor', 'İş Mentoru', 'mentorship'),
    ('pazarlama-mentoru', 'Pazarlama Mentoru', 'mentorship');

-- Freelance related hashtags
INSERT INTO hashtags (name, display_name, category) VALUES
    ('freelancerim', 'Freelancerım', 'freelance'),
    ('is-ariyorum', 'İş Arıyorum', 'freelance'),
    ('freelancer-ariyorum', 'Freelancer Arıyorum', 'freelance'),
    ('web-development', 'Web Geliştirme', 'freelance'),
    ('mobile-development', 'Mobil Geliştirme', 'freelance'),
    ('graphic-design', 'Grafik Tasarım', 'freelance'),
    ('ui-ux-design', 'UI/UX Tasarım', 'freelance'),
    ('digital-marketing', 'Dijital Pazarlama', 'freelance'),
    ('content-writing', 'İçerik Yazarlığı', 'freelance'),
    ('video-editing', 'Video Düzenleme', 'freelance'),
    ('consulting', 'Danışmanlık', 'freelance'),
    ('data-science', 'Veri Bilimi', 'freelance');

-- Technology/Skill specific hashtags
INSERT INTO hashtags (name, display_name, category) VALUES
    ('react', 'React', 'technology'),
    ('nodejs', 'Node.js', 'technology'),
    ('python', 'Python', 'technology'),
    ('javascript', 'JavaScript', 'technology'),
    ('typescript', 'TypeScript', 'technology'),
    ('flutter', 'Flutter', 'technology'),
    ('react-native', 'React Native', 'technology'),
    ('aws', 'AWS', 'technology'),
    ('docker', 'Docker', 'technology'),
    ('kubernetes', 'Kubernetes', 'technology'),
    ('machine-learning', 'Makine Öğrenmesi', 'technology'),
    ('blockchain', 'Blockchain', 'technology'),
    ('artificial-intelligence', 'Yapay Zeka', 'technology');

-- Industry specific hashtags
INSERT INTO hashtags (name, display_name, category) VALUES
    ('fintech', 'FinTech', 'industry'),
    ('e-commerce', 'E-Ticaret', 'industry'),
    ('healthtech', 'SağlıkTech', 'industry'),
    ('edtech', 'EğitimTech', 'industry'),
    ('gamedev', 'Oyun Geliştirme', 'industry'),
    ('saas', 'SaaS', 'industry'),
    ('marketplace', 'Marketplace', 'industry'),
    ('social-media', 'Sosyal Medya', 'industry'),
    ('iot', 'IoT', 'industry'),
    ('cleantech', 'Temiz Teknoloji', 'industry');

-- Business roles hashtags
INSERT INTO hashtags (name, display_name, category) VALUES
    ('cto', 'CTO', 'role'),
    ('cmo', 'CMO', 'role'),
    ('cfo', 'CFO', 'role'),
    ('product-manager', 'Ürün Yöneticisi', 'role'),
    ('tech-lead', 'Teknoloji Lideri', 'role'),
    ('growth-hacker', 'Büyüme Uzmanı', 'role'),
    ('business-development', 'İş Geliştirme', 'role'),
    ('sales', 'Satış', 'role');

-- Create some example rooms for premium users
-- (These would normally be created by users, but we'll add some examples)
INSERT INTO rooms (name, description, is_private) VALUES
    ('🚀 Startup Girişimcileri', 'Türkiye''nin girişimcileri bir arada! Fikirlerinizi paylaşın, deneyim kazanın.', FALSE),
    ('💰 Yatırımcılar Kulübü', 'Angel yatırımcılar ve VC fonları için özel alan. Fırsatları keşfedin.', TRUE),
    ('💻 Tech Freelancerlar', 'Yazılım geliştirme, tasarım ve teknoloji freelancerları burada.', FALSE),
    ('📈 Pazarlama & Growth', 'Dijital pazarlama, growth hacking ve satış stratejileri.', FALSE),
    ('🎓 Mentorluk Merkezi', 'Deneyimli profesyoneller ve öğrenmek isteyenler bir araya geliyor.', FALSE); 
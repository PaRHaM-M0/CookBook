/* =====================================================================
   📋 فایل داده‌ی مرکزی آشپزخانه — اینجا غذاها را مدیریت می‌کنی
   ---------------------------------------------------------------------
   برای اضافه‌کردن یک غذای جدید:
     ۱) یک بلوک { ... } جدید را کپی کن و داخل لیست RECIPES بگذار.
     ۲) فیلدها را پر کن (پایین توضیح هر فیلد آمده).
     ۳) یک فایل صفحه در پوشه‌ی recipes/ بساز (از _template.html کپی کن)
        و آدرسش را در فیلد page بنویس.
   همین! صفحه‌ی اصلی، سرچ، فیلترها و کارت‌ها خودکار ساخته می‌شوند.
   ---------------------------------------------------------------------
   راهنمای فیلدها:
     name      → اسمی که روی کارت نمایش داده می‌شود (انگلیسی).
     fa        → اسم فارسی «مخفی». روی کارت دیده نمی‌شود ولی اگر فارسی
                 سرچ کنی، غذا پیدا می‌شود. هر چند اسم مستعار هم می‌توانی
                 با کاما اضافه کنی، مثلاً: "پیتزا, پیتزای ناپولی"
     desc      → یک خط توضیح کوتاه که زیر اسم روی کارت می‌آید.
     page      → آدرس فایل صفحه‌ی این غذا داخل پوشه‌ی recipes/
     image     → آدرس عکس. خالی بگذار ("") تا placeholder نشان داده شود.
     category  → نوع غذا: مهم‌ترین دسته برای پیدا کردن سریع (پیتزا، پاستا و...)
     meal      → نوع وعده: یکی از کلیدهای FILTERS.meal
     cuisine   → ملیت/آشپزی: یکی از کلیدهای FILTERS.cuisine
     main      → ماده‌ی اصلی: یکی از کلیدهای FILTERS.main
     time      → زمان پخت: یکی از کلیدهای FILTERS.time
     level     → سختی: یکی از کلیدهای FILTERS.level
     tags      → برچسب‌های آزاد دلخواه (هرچقدر خواستی) برای سرچ بهتر.
     featured  → true اگر می‌خواهی در «منتخب‌ها» بالای صفحه بیاید.
   ===================================================================== */

/* ---------------------------------------------------------------------
   🏷️ دسته‌بندی‌ها و فیلترها
   برای اضافه/کم کردن یک فیلتر، فقط اینجا یک سطر اضافه/کم کن.
   کلید (مثلاً pizza) باید با مقداری که در غذا می‌نویسی یکی باشد.
   label = چیزی که به کاربر نشان داده می‌شود.   ic = آیکن (اموجی، اختیاری)
   --------------------------------------------------------------------- */
const FILTERS = {
  category: {
    title: "نوع غذا",
    options: {
      pizza:        { label: "پیتزا" },
      pasta:        { label: "پاستا" },
      sandwich:     { label: "ساندویچ" },
      "fried-chicken": { label: "مرغ سوخاری" },
      soup:         { label: "سوپ" },
      bread:        { label: "نان و خمیر" },
      appetizer:    { label: "پیش‌غذا و دورچین" },
      basics:       { label: "سس، چاشنی و پایه‌ها" },
      dessert:      { label: "دسر" },
      drink:        { label: "نوشیدنی" },
    }
  },
  meal: {
    title: "نوع وعده",
    options: {
      breakfast: { label: "صبحانه",   ic:"🍳" },
      lunch:     { label: "ناهار",     ic:"🍽️" },
      dinner:    { label: "شام",       ic:"🌙" },
      snack:     { label: "میان‌وعده", ic:"🥪" },
      dessert:   { label: "دسر",       ic:"🍰" },
      drink:     { label: "نوشیدنی",   ic:"🥤" },
      appetizer: { label: "پیش‌غذا",   ic:"🫒" },
    }
  },
  cuisine: {
    title: "ملیت / آشپزی",
    options: {
      iranian:  { label: "ایرانی",      ic:"🇮🇷" },
      italian:  { label: "ایتالیایی",   ic:"🇮🇹" },
      asian:    { label: "آسیایی",      ic:"🥢" },
      western:  { label: "فرنگی",       ic:"🍔" },
      mideast:  { label: "خاورمیانه",   ic:"🥙" },
      other:    { label: "سایر",        ic:"🌍" },
    }
  },
  main: {
    title: "ماده‌ی اصلی",
    options: {
      chicken:    { label: "مرغ",        ic:"🍗" },
      meat:       { label: "گوشت قرمز",  ic:"🥩" },
      fish:       { label: "ماهی/دریایی",ic:"🐟" },
      veggie:     { label: "سبزیجات",    ic:"🥦" },
      rice:       { label: "برنج",       ic:"🍚" },
      pasta:      { label: "خمیر/پاستا", ic:"🍝" },
      legume:     { label: "حبوبات",     ic:"🫘" },
      dairy:      { label: "لبنیات",     ic:"🧀" },
      egg:        { label: "تخم‌مرغ",    ic:"🥚" },
    }
  },
  time: {
    title: "زمان پخت",
    options: {
      quick:  { label: "سریع (زیر ۳۰ دقیقه)", ic:"⚡" },
      medium: { label: "متوسط (۳۰ تا ۹۰ دقیقه)", ic:"⏱️" },
      long:   { label: "طولانی (چند ساعت)", ic:"🕰️" },
      project:{ label: "پروژه‌ای (چند روزه)", ic:"📅" },
    }
  },
  level: {
    title: "سختی",
    options: {
      easy:   { label: "آسان",    ic:"🟢" },
      medium: { label: "متوسط",   ic:"🟡" },
      hard:   { label: "حرفه‌ای", ic:"🔴" },
    }
  },
};

/* ---------------------------------------------------------------------
   🍲 لیست غذاها
   --------------------------------------------------------------------- */
const RECIPES = [

  {
    name: "Neapolitan Pizza",
    fa: "پیتزا, پیتزای ناپولی, پیتزا ناپولیتن, خمیر ۷۲ ساعته",
    desc: "راهنمای قدم‌به‌قدم و وسواسی برای پیتزای خانگی در سطح رستوران — از خمیر ۷۲ ساعته تا تحویل کاملاً داغ.",
    page: "recipes/neapolitan-pizza.html",
    category: "pizza",
    image: "images/pizza.jpg",       // عکس نداری؟ خالی بگذار ("") تا placeholder بیاید
    meal: "dinner",
    cuisine: "italian",
    main: "pasta",
    time: "project",
    level: "hard",
    tags: ["پیتزا","خمیر","موزارلا","تخمیر سرد","سس گوجه","ناپولی","dough","mozzarella"],
    featured: true,
  },

  {
    name: "Tunacado Sandwich",
    fa: "توناکادو, تناکادو, ساندویچ توناکادو, ساندویچ تن ماهی و آووکادو, ساندویچ جو اند د جوس",
    desc: "ساندویچ معروف Joe & The Juice؛ تُن ماهی و آووکادوی ورقه‌ای روی نان خمیرترش برشته در کره، با پستوی گردو — با تایم‌لاین کامل از خرید تا سرو.",
    page: "recipes/tunakado.html",
    category: "sandwich",
    image: "images/tunakado.jpg",
    meal: "dinner",
    cuisine: "western",
    main: "fish",
    time: "medium",
    level: "medium",
    tags: ["توناکادو","تناکادو","ساندویچ","تن ماهی","تُن ماهی","آووکادو","پستو","گردو","ریحان","خمیرترش","جو اند د جوس","tunacado","tuna","avocado","pesto","joe and the juice"],
    featured: true,
  },

  {
    name: "Korean Fried Chicken (Yangnyeom)",
    fa: "مرغ سوخاری کره‌ای, یانگنیوم چیکن, یانگنیوم, مرغ کره‌ای, مرغ سوخاری تند کره‌ای",
    desc: "مرغ سوخاری افسانه‌ای کره؛ سرخ‌کردن دو مرحله‌ای با نشاسته سیب‌زمینی برای تردی ماندگار، با سس براق <span class='en'>Gochujang</span> — شیرین، شور و تند.",
    page: "recipes/yangnyeom-chicken.html",
    category: "fried-chicken",
    image: "images/yangnyeom-chicken.jpg",
    meal: "dinner",
    cuisine: "asian",
    main: "chicken",
    time: "medium",
    level: "hard",
    tags: ["مرغ سوخاری","کره‌ای","یانگنیوم","گوچوجانگ","نشاسته سیب‌زمینی","سرخ کردن دو مرحله‌ای","سس تند","yangnyeom","korean fried chicken","gochujang","double fry"],
    featured: true,
  },

  {
    name: "Chicken 65",
    fa: "چیکن ۶۵, چیکن شصت و پنج, مرغ سوخاری هندی, مرغ هندی تند",
    desc: "بمب طعم هندی؛ مرغ سوخاری با مرینیت ماست و ادویه و برگ کاری تازه، با پایان جادویی <span class='en'>Tadka</span> در روغن ادویه‌دار و لیموی تازه.",
    page: "recipes/chicken-65.html",
    category: "fried-chicken",
    image: "images/chicken-65.jpg",
    meal: "dinner",
    cuisine: "asian",
    main: "chicken",
    time: "long",
    level: "medium",
    tags: ["چیکن 65","chicken 65","هندی","مرغ سوخاری","برگ کاری","تادکا","tadka","گارام ماسالا","فلفل کشمیری","kashmiri","curry leaves","garam masala"],
    featured: true,
  },

  {
    name: "Harira Soup",
    fa: "حریرا, سوپ حریرا, سوپ مراکشی, سوپ گوجه مراکشی با نخود و عدس",
    desc: "سوپ معطر مراکشی بر پایه گوجه با نخود، عدس و گوشت؛ با زنجبیل، دارچین و سبزی تازه و غلظت خامه‌ای تدویره — محبوب سفره افطار.",
    page: "recipes/harira.html",
    category: "soup",
    image: "images/harira.jpg",
    meal: "dinner",
    cuisine: "other",
    main: "meat",
    time: "long",
    level: "medium",
    tags: ["حریرا","harira","مراکشی","سوپ","نخود","عدس","گوجه فرنگی","رمضان","افطار","moroccan soup","chickpea","lentil"],
    featured: true,
  },

  {
    name: "Herb Compound Butter",
    fa: "کره طعم‌دار گیاهی, کره مرکب, کره سبزیجات, کره سیر و سبزی",
    desc: "کره نرم با موسیر یا سیر، آویشن یا رزماری، جعفری یا چایوز و لیمو؛ رولِ سرد و آماده برش — سس فوری برای استیک، مرغ، ماهی، سبزیجات و پاستا.",
    page: "recipes/herb-compound-butter.html",
    category: "basics",
    image: "images/herb-compound-butter.jpg",
    meal: "appetizer",
    cuisine: "western",
    main: "dairy",
    time: "long",
    level: "easy",
    tags: ["کره طعم‌دار","کره مرکب","compound butter","کره گیاهی","سس فوری","استیک","موسیر","shallot","آویشن","رزماری"],
    featured: false,
  },

  {
    name: "Cheesy Sausage Pinwheels",
    fa: "فینگر فود سوسیس پنیری, فینگرفود سوسیس, رول سوسیس و پنیر, سوسیس پنیری مهمانی",
    desc: "<span class='en'>Finger Food</span> مهمانی با فقط ۴ ماده؛ رول خمیر هلالی با سوسیس، پنیر خامه‌ای و چدار — برش‌خورده، طلایی و آماده ناپدید شدن از روی میز.",
    page: "recipes/sausage-cheese-pinwheels.html",
    category: "appetizer",
    image: "images/sausage-cheese-pinwheels.jpg",
    meal: "snack",
    cuisine: "western",
    main: "meat",
    time: "medium",
    level: "easy",
    tags: ["فینگر فود","سوسیس","پنیری","مهمانی","خمیر هلالی","کروسان","پنیر خامه‌ای","چدار","pinwheels","sausage","finger food","party"],
    featured: false,
  },

  {
    name: "Deviled Egg Dip",
    fa: "دیپ تخم‌مرغ شیطانی, دیپ تخم مرغ, تخم‌مرغ شیطانی, پیش‌غذای تخم‌مرغ مهمانی",
    desc: "همه‌ی خوبی‌های تخم‌مرغ شیطانی به شکل <span class='en'>Dip</span>؛ خامه‌ای، تند و کمی تیز با خردل دیژون و سرکه — پیش‌غذای سرد مهمانی با کراکر و سبزیجات.",
    page: "recipes/deviled-egg-dip.html",
    category: "appetizer",
    image: "images/deviled-egg-dip.jpg",
    meal: "appetizer",
    cuisine: "western",
    main: "egg",
    time: "long",
    level: "easy",
    tags: ["دیپ","تخم‌مرغ شیطانی","deviled eggs","پیش‌غذا","فینگرفود","مهمانی","خردل دیژون","پاپریکا","اپتایزر","appetizer","dip"],
    featured: false,
  },

  {
    name: "Sourdough Bread",
    fa: "نان خمیر ترش, نان خمیرترش, نان آرتیزان, نان سوردو, نان خانگی تخمیر سرد",
    desc: "نان آرتیزان شبه خمیرترش با هیدراتاسیون ۷۵٪ و فقط ۱ گرم خمیرمایه؛ تخمیر سرد ۲۴ تا ۷۲ ساعت و پخت در قابلمه چدنی برای پوسته تیره و مغز پرحباب.",
    page: "recipes/sourdough.html",
    category: "bread",
    image: "images/sourdough.jpg",
    meal: "appetizer",
    cuisine: "western",
    main: "pasta",
    time: "project",
    level: "hard",
    tags: ["نان","خمیر ترش","sourdough","آرتیزان","تخمیر سرد","اتولیز","کشش و تا","هیدراتاسیون","نان خانگی","چدن","dutch oven"],
    featured: true,
  },

  {
    name: "Chicken Mushroom Fettuccine Alfredo",
    fa: "فتوچینی آلفردو با مرغ و قارچ, پاستا آلفردو, فتوچینی مرغ قارچ, آلفردو",
    desc: "کپی Olive Garden از Momsdish؛ <span class='en'>Fettuccine</span> در سس خامه‌ای <span class='en'>Alfredo</span> با <span class='en'>Parmesan</span> و سیر، مرغ و قارچ طلایی — با ضمیمه تبدیل خامه ایرانی به خامه سنگین.",
    page: "recipes/chicken-mushroom-alfredo.html",
    category: "pasta",
    image: "images/chicken-mushroom-alfredo.jpg",
    meal: "dinner",
    cuisine: "italian",
    main: "pasta",
    time: "medium",
    level: "medium",
    tags: ["پاستا","فتوچینی","آلفردو","alfredo","fettuccine","مرغ","قارچ","خامه سنگین","heavy cream","پارمزان","olive garden","momsdish"],
    featured: true,
  },

  {
    name: "Scialatielli Aglio Olio e Gamberi",
    fa: "شالاتیه‌لی با میگو, پاستا سیر و روغن و میگو, شالاتیلی, پاستای آمالفی با میگو",
    desc: "پاستای تازه تخم‌مرغی آمالفی با میگوی تفت‌داده در سیر و روغن زیتون، فلفل تند، کنیاک و رازیانه وحشی — با دستور ساخت <span class='en'>Scialatielli</span> خانگی.",
    page: "recipes/scialatielli-gamberi.html",
    category: "pasta",
    image: "images/scialatielli-gamberi.jpg",
    meal: "dinner",
    cuisine: "italian",
    main: "fish",
    time: "medium",
    level: "easy",
    tags: ["پاستا","شالاتیه‌لی","scialatielli","میگو","gamberi","آمالفی","amalfi","سیر و روغن","aglio olio","پاستای تازه","رازیانه وحشی"],
    featured: true,
  },

  {
    name: "Italian Seasoning",
    fa: "ادویه ایتالیایی, ادویه ایتالیایی خانگی, ترکیب ادویه ایتالیا",
    desc: "ترکیب خانگی ریحان، پونه کوهی، جعفری، رزماری، آویشن، فلفل پرکی و پودر سیر؛ در ۵ دقیقه، برای سس پاستا، مرینیت و سبزیجات برشته.",
    page: "recipes/italian-seasoning.html",
    category: "basics",
    image: "images/italian-seasoning.jpg",
    meal: "appetizer",
    cuisine: "italian",
    main: "veggie",
    time: "quick",
    level: "easy",
    tags: ["ادویه","ایتالیایی","italian seasoning","ریحان خشک","پونه کوهی","oregano","رزماری","آویشن","ترکیب ادویه","spice blend"],
    featured: false,
  },

  {
    name: "Chicken Alfredo Garlic Bread",
    fa: "نان سیر آلفردو با مرغ, نان سیر آلفردو, گارلیک برد مرغ آلفردو",
    desc: "نان ایتالیایی با کره سیر، سس <span class='en'>Alfredo</span>، <span class='en'>Mozzarella</span> و مرغ مزه‌دار با پاپریکای دودی؛ در فر ترد و طلایی، گرم با سس اضافه.",
    page: "recipes/chicken-alfredo-garlic-bread.html",
    category: "bread",
    image: "images/chicken-alfredo-garlic-bread.jpg",
    meal: "dinner",
    cuisine: "italian",
    main: "chicken",
    time: "medium",
    level: "medium",
    tags: ["نان سیر","garlic bread","آلفردو","alfredo","مرغ","موزارلا","پاپریکای دودی","کره سیر","chicken alfredo"],
    featured: true,
  },

  {
    name: "Cheesy Potato Thing (Air Fryer)",
    fa: "چیز سیب‌زمینی پنیری, سیب‌زمینی پنیری ایرفرایر, سیب‌زمینی موزارلا چوریزو",
    desc: "پوره سیب‌زمینی پیچیده دور <span class='en'>Mozzarella</span> و <span class='en'>Chorizo</span>، طلایی در ایرفرایر ۲۴۰ درجه؛ هر سرو ۴۸۰ کالری و ۲۰ گرم پروتئین — برای ۲ نفر.",
    page: "recipes/cheesy-potato-thing.html",
    category: "appetizer",
    image: "images/cheesy-potato-thing.jpg",
    meal: "snack",
    cuisine: "western",
    main: "veggie",
    time: "medium",
    level: "easy",
    tags: ["سیب‌زمینی","پنیری","موزارلا","چوریزو","ایرفرایر","air fryer","potato","chorizo","mozzarella","foodiefrontier"],
    featured: false,
  },

  {
    name: "Robuchon Pommes Purée",
    fa: "پوره سیب‌زمینی روبوشون, پوره روبوشون, پوم پوره, بهترین پوره سیب‌زمینی",
    desc: "پوره افسانه‌ای ژوئل <span class='en'>Robuchon</span>؛ سیب‌زمینی راته با کره سرد فراوان، شیر داغ و عبور از صافی برای بافت ابریشمی — غذای امضای رستوران‌هایش.",
    page: "recipes/robuchon-pomme-puree.html",
    category: "appetizer",
    image: "images/robuchon-pomme-puree.jpg",
    meal: "dinner",
    cuisine: "western",
    main: "veggie",
    time: "medium",
    level: "hard",
    tags: ["پوره","سیب‌زمینی","روبوشون","robuchon","pomme puree","فرانسوی","کره","یوکون","ratte","میشلن"],
    featured: true,
  },

  {
    name: "Linguine with Shrimp, Zucchini & Saffron",
    fa: "لینگوئینی میگو کدو و زعفران, پاستا میگو و کدو, لینگوئینی دریایی زعفرانی",
    desc: "از GialloZafferano؛ <span class='en'>Linguine</span> با میگوی قرمز و کدو در سس مخملی زعفران — خامه‌ای بدون خامه، با فومه سر و پوست میگو و پایان پخت در تابه.",
    page: "recipes/linguine-gamberetti-zafferano.html",
    category: "pasta",
    image: "images/linguine-gamberetti-zafferano.jpg",
    meal: "dinner",
    cuisine: "italian",
    main: "fish",
    time: "medium",
    level: "easy",
    tags: ["پاستا","لینگوئینی","linguine","میگو","کدو","زعفران","gamberetti","zucchine","zafferano","فومه","دریایی"],
    featured: true,
  },

  {
    name: "Cherry Cheesecakes",
    fa: "مینی چیزکیک گیلاس, چیزکیک گیلاس, چیزکیک تک نفره گیلاسی",
    desc: "سبدهای پنیر کشاورز با مغز پنیر خامه‌ای و گیلاس تازه؛ ۲۵ تا ۳۰ دقیقه در فر ۱۹۰ درجه، لطیف و آبدار، با پودر قند.",
    page: "recipes/cherry-cheesecakes.html",
    category: "dessert",
    image: "images/cherry-cheesecakes.jpg",
    meal: "dessert",
    cuisine: "western",
    main: "dairy",
    time: "medium",
    level: "medium",
    tags: ["چیزکیک","cheesecake","گیلاس","cherry","مینی چیزکیک","farmer cheese","پنیر خامه‌ای","دسر","سمولینا"],
    featured: true,
  },

  {
    name: "Easy Chicken Alfredo Penne",
    fa: "پنه آلفردوی مرغ آسان, پاستا پنه آلفردو, آلفردوی مرغ تیستی",
    desc: "از Tasty؛ پنه با مرغ مکعبی و سس <span class='en'>Alfredo</span>ی شیریِ غلیظ‌شده با آرد و <span class='en'>Parmesan</span> — ۳۳ دقیقه، ۶ نفر، بدون نیاز به خامه سنگین.",
    page: "recipes/easy-chicken-alfredo-penne.html",
    category: "pasta",
    image: "images/easy-chicken-alfredo-penne.jpg",
    meal: "dinner",
    cuisine: "italian",
    main: "pasta",
    time: "medium",
    level: "easy",
    tags: ["پاستا","پنه","آلفردو","alfredo","penne","مرغ","tasty","سس شیری","پارمزان","یک تابه"],
    featured: false,
  },

  {
    name: "Chicken Alfredo (Belly Full)",
    fa: "چیکن آلفردو بلی فول, چیکن آلفردو, فتوچینی آلفردو مرغ طلایی",
    desc: "از Belly Full؛ سینه مرغ طلایی با ادویه ایتالیایی، <span class='en'>Fettuccine</span> و سس مخملی سیر و <span class='en'>Parmesan</span> با ۲ پیمانه <span class='en'>Parmesan</span> تازه — امتیاز ۴٫۹۹ از ۴۲۶ بررسی.",
    page: "recipes/bellyfull-chicken-alfredo.html",
    category: "pasta",
    image: "images/bellyfull-chicken-alfredo.jpg",
    meal: "dinner",
    cuisine: "italian",
    main: "chicken",
    time: "medium",
    level: "medium",
    tags: ["آلفردو","alfredo","چیکن آلفردو","فتوچینی","fettuccine","پارمزان","ادویه ایتالیایی","belly full","سس خامه‌ای"],
    featured: true,
  },

  {
    name: "Professional Homemade Ricotta",
    fa: "ریکوتای خانگی, ریکوتا, پنیر ریکوتا خانگی, پنیر خانگی با آبلیمو",
    desc: "<span class='en'>Ricotta</span>ی خانگی با کنترل دقیق دما؛ شیر در ۱۸۰ فارنهایت با آب‌لیمو، ۴۰ دقیقه استراحت و ۱ تا ۱٫۵ ساعت آویزان‌کردن برای بافت حرفه‌ای.",
    page: "recipes/homemade-ricotta.html",
    category: "basics",
    image: "images/homemade-ricotta.jpg",
    meal: "appetizer",
    cuisine: "italian",
    main: "dairy",
    time: "long",
    level: "medium",
    tags: ["ریکوتا","ricotta","پنیر خانگی","شیر","آبلیمو","پنیرسازی","cheesecloth","۱۸۰ فارنهایت"],
    featured: false,
  },

  {
    name: "Lacto-Fermented Spicy Tomato Sauce",
    fa: "سس گوجه تند تخمیری, سس لاکتوفرمنت, سس پیتزا تخمیری, سس گوجه فرنگی تخمیر شده",
    desc: "گوجه ارثی و فلفل قرمز در آب‌نمک دقیق ۲۰ گرم نمک در ۱۰۰۰ گرم آب، ۵ روز تخمیر؛ بعد بلند صاف با روغن زیتون و رب — سس پیتزای تند.",
    page: "recipes/lacto-fermented-pizza-sauce.html",
    category: "basics",
    image: "images/lacto-fermented-pizza-sauce.jpg",
    meal: "appetizer",
    cuisine: "italian",
    main: "veggie",
    time: "project",
    level: "hard",
    tags: ["سس","لاکتوفرمنت","تخمیر","fermentation","گوجه","فلفل قرمز","سس پیتزا","آب نمک","brine","heirloom"],
    featured: true,
  },

  {
    name: "Porchetta-Infused Bacon",
    fa: "بیکن پورکتایی, بیکن خانگی, بیکن پورچتا, بیکن ایتالیایی خانگی",
    desc: "شکم خوک با کیور دقیق ۶ تا ۷ روزه، روکش آویشن، رزماری، سیر و زست پرتقال؛ دودی در ۲۵۰ فارنهایت تا ۱۶۰ درجه داخلی و سردشده برای برش پیتزا.",
    page: "recipes/porchetta-bacon.html",
    category: "basics",
    image: "images/porchetta-bacon.jpg",
    meal: "dinner",
    cuisine: "italian",
    main: "meat",
    time: "project",
    level: "hard",
    tags: ["بیکن","bacon","پورکتا","porchetta","شکم خوک","کیور","پراگ پودر","دودی","پیتزا"],
    featured: true,
  },

  {
    name: "Better Than Pizza Hut Stuffed Crust Pizza",
    fa: "پیتزای استافد کراست, پیتزا کراست پر شده, پیتزا هات خانگی, پیتزای لبه پنیری",
    desc: "خمیر خانگی با کراست پر از <span class='en'>Mozzarella</span> و مُهرشده، سس گوجه با <span class='en'>Guanciale</span> و کره سیر و <span class='en'>Parmesan</span> روی لبه؛ برای ۲ پیتزا، منبع ویدیوی یوتیوب.",
    page: "recipes/stuffed-crust-pizza.html",
    category: "pizza",
    image: "images/stuffed-crust-pizza.jpg",
    meal: "dinner",
    cuisine: "italian",
    main: "pasta",
    time: "medium",
    level: "hard",
    tags: ["پیتزا","استافد کراست","stuffed crust","pizza hut","موزارلا","خمیر پیتزا","کره سیر","گوانچاله"],
    featured: true,
  },

  {
    name: "New York Egg Cream",
    fa: "اگ‌کریم نیویورکی, اگ کریم, نوشیدنی نیویورکی, اگ‌کریم شکلاتی",
    desc: "کلاسیک نیویورکی بدون تخم‌مرغ و خامه؛ شیر و <span class='en'>Seltzer</span> سرد با سس شکلات در لیوان یخ‌زده و سر کف سفید بروکلینی — برنده مقایسه با Allrecipes.",
    page: "recipes/new-york-egg-cream.html",
    category: "drink",
    image: "images/new-york-egg-cream.jpg",
    meal: "drink",
    cuisine: "western",
    main: "dairy",
    time: "quick",
    level: "easy",
    tags: ["اگ‌کریم","egg cream","نیویورک","نوشیدنی","سلتزر","seltzer","شکلات","Fox's U-Bet","بروکلین"],
    featured: false,
  },

  {
    name: "Detroit-Style Pan Pizza",
    fa: "پیتزای دیترویت, پیتزا تابه ای دیترویت, پیتزای تابه‌ای, دیترویت استایل",
    desc: "نقشه کامل پیتزای تابه‌ای دیترویت؛ خمیر مرطوب، سس دستی گوجه، مکعب‌های Mozzarella و Fontina، لبه Frico سیاه و ترد و پایان Ricotta سرد، ریحان و Hot Honey.",
    page: "recipes/detroit-style-pizza.html",
    category: "pizza",
    image: "images/detroit-style-pizza.jpg",
    meal: "dinner",
    cuisine: "western",
    main: "pasta",
    time: "project",
    level: "hard",
    tags: ["پیتزا","دیترویت","Detroit","pan pizza","Frico","Fontina","Pepperoni","Hot Honey","Ricotta"],
    featured: true,
  },

  /* ============================================================
     ⬇️ برای غذای بعدی، این بلوک را کپی کن، علامت‌های /* و *​/ را
     بردار و پُرش کن:

  {
    name: "Food Name In English",
    fa: "اسم فارسی, اسم مستعار",
    desc: "یک خط توضیح کوتاه.",
    page: "recipes/food-name.html",
    image: "",
    meal: "lunch",
    cuisine: "iranian",
    main: "chicken",
    time: "medium",
    level: "easy",
    tags: ["برچسب۱","برچسب۲"],
    featured: false,
  },

     ============================================================ */

];

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Clock, Wine } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Check if device supports touch/pointer (don't show custom cursor on mobile)
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsHidden(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('.group') !== null;
      setIsHovering(isClickable);
    };
    
    // Hide when leaving the window
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] text-[#E8B4B8] mix-blend-exclusion"
        animate={{
          x: position.x + 4,
          y: position.y + 4,
          scale: isHovering ? 1.2 : 0.9,
          opacity: isHovering ? 1 : 0.6,
          rotate: isHovering ? -15 : 0
        }}
        transition={{ type: "spring", damping: 30, mass: 0.5, stiffness: 400, bounce: 0 }}
      >
        <Wine size={20} strokeWidth={1.5} />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[100] mix-blend-exclusion"
        animate={{
          x: position.x - 3,
          y: position.y - 3,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(232, 180, 184, 1)' : 'rgba(255, 255, 255, 1)'
        }}
        transition={{ type: "spring", damping: 40, mass: 0.1, stiffness: 800, bounce: 0 }}
      />
    </>
  );
};

const MenuItem = ({ title, price, desc }: { title: string, price: string, desc: string }) => {
  return (
    <div className="group cursor-default relative py-4 border-b border-transparent hover:border-white/5 transition-colors">
      <div className="flex justify-between items-end mb-3 relative z-10">
        <h4 className="text-xl font-light font-serif group-hover:text-[#E8B4B8] transition-colors normal-case">{title}</h4>
        <div className="flex-1 border-b border-white/10 mx-6 mb-2 border-dotted"></div>
        <span className="text-[#E8B4B8] font-mono text-sm">{price}</span>
      </div>
      <p className="text-xs text-white/40 normal-case font-sans tracking-normal leading-relaxed pr-12 relative z-10">{desc}</p>
    </div>
  );
};

const ParallaxImage = ({ src, alt, className }: { src: string, alt: string, className: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.img 
        src={src} 
        alt={alt} 
        style={{ y, scale: 1.25 }}
        className="w-full h-full object-cover absolute inset-0 origin-center" 
      />
    </div>
  );
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#EAEAEA] uppercase tracking-widest font-sans selection:bg-[#E8B4B8]/20 selection:text-[#E8B4B8] cursor-none md:cursor-none">
      <CustomCursor />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#E8B4B8] origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Noise Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }}></div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-40 px-6 py-6 md:px-12 flex justify-between items-center text-[11px] font-medium text-white/60 border-b border-white/5 backdrop-blur-xl bg-[#0A0A0A]/50">
        <a href="#" className="flex items-baseline gap-3 text-[#EAEAEA] transition-opacity hover:opacity-70 group">
          <span className="text-2xl font-bold tracking-widest font-serif italic">La Rose</span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 hidden md:inline">PARIS</span>
        </a>
        <nav className="hidden md:flex gap-12 items-center tracking-[0.2em] text-[10px]">
          <a href="#philosophy" className="hover:text-[#E8B4B8] transition-colors duration-300">Философия</a>
          <a href="#menu" className="hover:text-[#E8B4B8] transition-colors duration-300">Меню</a>
          <a href="#atmosphere" className="hover:text-[#E8B4B8] transition-colors duration-300">Атмосфера</a>
          <a href="#reservation" className="text-[#E8B4B8] border border-[#E8B4B8]/30 px-6 py-3 hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-500">
            РЕЗЕРВ СТОЛА
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20 border-b border-white/5 overflow-hidden">
        {/* Background Video with Overlay */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-pouring-red-wine-into-a-glass-from-a-bottle-1498-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center max-w-4xl z-10"
        >
          <span className="text-[10px] md:text-[11px] text-[#E8B4B8] tracking-[0.4em] font-medium mb-12 flex items-center gap-4">
            <span className="w-8 h-px bg-[#E8B4B8]/50"></span>
            HAUTE CUISINE FRANÇAISE
            <span className="w-8 h-px bg-[#E8B4B8]/50"></span>
          </span>
          <h1 className="text-[70px] sm:text-[90px] md:text-[120px] lg:text-[150px] leading-[0.8] font-black tracking-tighter mb-10 font-serif">
            L'ART <br />
            <em className="text-[#E8B4B8] lowercase italic tracking-tight font-light flex items-center justify-center gap-8 my-4">
              <span className="w-16 h-px bg-white/20 hidden md:block"></span>
              de vivre
              <span className="w-16 h-px bg-white/20 hidden md:block"></span>
            </em>
            <span className="tracking-tighter">SUBLIME</span>
          </h1>
          
          <p className="mt-8 text-[10px] md:text-[11px] text-white/50 max-w-lg leading-[2em] tracking-[0.2em] font-medium">
            Традиции французской гастрономии, облаченные в безупречную современную подачу. Вечер, который вы запомните навсегда.
          </p>
        </motion.div>

        <a href="#menu" className="absolute bottom-12 z-10 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#E8B4B8] to-transparent"></div>
        </a>
      </section>

      {/* PHILOSOPHY / CHEF SECTION */}
      <section id="philosophy" className="py-32 px-6 md:px-12 border-b border-white/5 relative bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center">
          <div className="md:w-1/2 relative group w-full">
            <ParallaxImage 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1000"
              alt="Chef plating"
              className="aspect-[3/4] rounded-sm opacity-80 mix-blend-lighten"
            />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#0A0A0A] border border-white/10 flex items-center justify-center p-8 hidden md:flex z-10 transition-transform duration-1000 group-hover:-translate-y-4 group-hover:-translate-x-4">
              <p className="font-serif italic text-sm text-[#E8B4B8] normal-case text-center leading-relaxed">
                "Моя цель — раскрыть душу каждого ингредиента."
              </p>
            </div>
          </div>
          <div className="md:w-1/2 space-y-12">
            <div>
              <span className="text-[10px] font-bold text-[#E8B4B8] tracking-[0.3em] uppercase mb-6 block">Le Chef</span>
              <h2 className="text-[50px] md:text-[70px] font-black tracking-tighter italic leading-[0.9] text-[#EAEAEA] font-serif">
                МАГИЯ <br/>В ДЕТАЛЯХ
              </h2>
            </div>
            <div className="space-y-6 text-xs text-white/60 font-sans normal-case tracking-normal leading-loose max-w-md">
              <p>Мы стерли все лишнее, чтобы сфокусироваться на главном — текстурах, ароматах и вашей индивидуальности.</p>
              <p>Каждое блюдо в La Rose — это диалог между классической французской школой и современными авангардными техниками. Пространство, лишенное суеты. Только безупречное исполнение, премиальные фермерские ингредиенты и полная гармония вкуса.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ATMOSPHERE GALLERY SECTION */}
      <section id="atmosphere" className="py-32 px-6 md:px-12 border-b border-white/5 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-24">
             <span className="text-[10px] font-bold text-[#E8B4B8] tracking-[0.3em] uppercase block mb-6">L'Atmosphère</span>
             <h2 className="text-[50px] md:text-[80px] leading-[0.9] font-black tracking-tighter italic font-serif">
               ВРЕМЯ <br/> ЗАМИРАЕТ
             </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[400px]">
              <div className="md:col-span-2 md:row-span-2 overflow-hidden group border border-white/5 relative bg-black">
                 <div className="absolute inset-0 bg-[#4a2411]/50 mix-blend-color z-10 pointer-events-none transition-opacity duration-1000 group-hover:opacity-0"></div>
                 <div className="absolute inset-0 bg-black/50 mix-blend-multiply z-10 pointer-events-none"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                 <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200" alt="Главный зал ресторана" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 brightness-90 contrast-125 saturate-50 sepia-[.3]" />
                 <div className="absolute bottom-6 left-8 z-20">
                     <span className="text-[10px] font-mono text-[#E8B4B8] uppercase tracking-widest drop-shadow-md">01 / Главный зал</span>
                 </div>
              </div>
              <div className="overflow-hidden group border border-white/5 relative bg-black">
                 <div className="absolute inset-0 bg-[#4a2411]/50 mix-blend-color z-10 pointer-events-none transition-opacity duration-1000 group-hover:opacity-0"></div>
                 <div className="absolute inset-0 bg-black/60 mix-blend-multiply z-10 pointer-events-none"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                 <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" alt="Интерьер" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 brightness-90 contrast-125 saturate-50 sepia-[.3]" />
                 <div className="absolute bottom-6 left-8 z-20">
                     <span className="text-[10px] font-mono text-[#E8B4B8] uppercase tracking-widest drop-shadow-md">02 / Интерьер</span>
                 </div>
              </div>
              <div className="overflow-hidden group border border-white/5 relative bg-black">
                 <div className="absolute inset-0 bg-[#4a2411]/50 mix-blend-color z-10 pointer-events-none transition-opacity duration-1000 group-hover:opacity-0"></div>
                 <div className="absolute inset-0 bg-black/50 mix-blend-multiply z-10 pointer-events-none"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                 <img src="https://images.unsplash.com/photo-1436018626274-89acd1d6ec9d?auto=format&fit=crop&q=80&w=800" alt="Барная стойка" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 brightness-90 contrast-125 saturate-50 sepia-[.3]" />
                 <div className="absolute bottom-6 left-8 z-20">
                     <span className="text-[10px] font-mono text-[#E8B4B8] uppercase tracking-widest drop-shadow-md">03 / Бар</span>
                 </div>
              </div>
              <div className="md:col-span-3 overflow-hidden group h-[400px] border border-white/5 relative bg-black">
                 <div className="absolute inset-0 bg-[#4a2411]/50 mix-blend-color z-10 pointer-events-none transition-opacity duration-1000 group-hover:opacity-0"></div>
                 <div className="absolute inset-0 bg-black/70 mix-blend-multiply z-10 pointer-events-none"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>
                 <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2000" alt="Веранда" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-70 brightness-75 contrast-125 saturate-50 sepia-[.4]" />
                 <div className="absolute bottom-6 left-8 z-20">
                     <span className="text-[10px] font-mono text-[#E8B4B8] uppercase tracking-widest drop-shadow-md">04 / Веранда</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="py-32 px-6 md:px-12 border-b border-white/5 flex flex-col relative bg-[#111111]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/5 pb-16 gap-8">
            <div>
              <h2 className="text-[60px] md:text-[90px] leading-[0.8] font-black tracking-tighter italic mb-8 font-serif">
                LA CARTE<br/><span className="text-[#E8B4B8]">DU SOIR</span>
              </h2>
              <div className="text-[10px] leading-relaxed uppercase tracking-[0.3em] text-white/40">
                ВЕЧЕРНЕЕ МЕНЮ. ФРАНЦУЗСКАЯ КЛАССИКА В СОВРЕМЕННОМ ПРОЧТЕНИИ.
              </div>
            </div>
            <button className="text-[9px] uppercase tracking-[0.2em] border border-white/20 px-8 py-4 hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-colors">
              СКАЧАТЬ PDF МЕНЮ
            </button>
          </div>

          {/* TASTING MENU HIGHLIGHT */}
          <div className="mb-32 border border-[#E8B4B8]/20 bg-[#E8B4B8]/5 p-8 md:p-16 relative overflow-hidden backdrop-blur-sm group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8B4B8]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#E8B4B8]/20 transition-colors duration-1000"></div>
            
            <div className="flex flex-col md:flex-row justify-between gap-16 relative z-10">
              <div className="md:w-1/3">
                <span className="text-[10px] font-bold text-[#E8B4B8] tracking-[0.3em] uppercase block mb-4">Signature</span>
                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-6 font-serif text-[#EAEAEA] uppercase">MENU<br/>DÉGUSTATION</h3>
                <p className="text-xs text-white/50 normal-case font-sans tracking-normal leading-relaxed mb-8">
                  Восемь подач, отражающих видение шеф-повара. Гастрономическое путешествие по регионам Франции, где каждая деталь продумана до мелочей.
                </p>
                <div className="space-y-4 text-sm font-mono text-[#E8B4B8]">
                   <div className="flex justify-between border-b border-[#E8B4B8]/10 pb-2">
                     <span>Сет из 8 подач</span>
                     <span>16 000 ₽</span>
                   </div>
                   <div className="flex justify-between border-b border-[#E8B4B8]/10 pb-2">
                     <span>Винное сопровождение</span>
                     <span>10 000 ₽</span>
                   </div>
                </div>
              </div>
              
              <div className="md:w-1/2 flex flex-col justify-center">
                 <div className="space-y-4 text-base font-serif italic text-white/80 normal-case">
                    <div className="flex items-start gap-4">
                      <span className="text-[#E8B4B8] text-xs font-mono font-normal mt-1">I.</span>
                      <span className="leading-snug">Амюз-буш с икрой морского ежа и эспумой из зеленого яблока</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-[#E8B4B8] text-xs font-mono font-normal mt-1">II.</span>
                      <span className="leading-snug">Тартар из дикого сибаса, шисо и цитрусовый понзу</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-[#E8B4B8] text-xs font-mono font-normal mt-1">III.</span>
                      <span className="leading-snug">Гребешок Сен-Жак, пюре из цветной капусты, пудра из белых грибов</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-[#E8B4B8] text-xs font-mono font-normal mt-1">IV.</span>
                      <span className="leading-snug">Равиоли с лобстером и соусом биск на основе коньяка</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-[#E8B4B8] text-xs font-mono font-normal mt-1">V.</span>
                      <span className="leading-snug">Голубь (Pigeon) с фуа-гра и насыщенным соусом из дикой вишни</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-[#E8B4B8] text-xs font-mono font-normal mt-1">VI.</span>
                      <span className="leading-snug">Сорбет из шампанского Blanc de Blancs для очищения рецепторов</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-[#E8B4B8] text-xs font-mono font-normal mt-1">VII.</span>
                      <span className="leading-snug">Отборные французские сыры, домашний трюфельный мед, хлеб на закваске</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-[#E8B4B8] text-xs font-mono font-normal mt-1">VIII.</span>
                      <span className="leading-snug">Воздушное суфле Grand Marnier с домашним ванильным мороженым</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
            {/* Starters */}
            <div className="space-y-12">
              <h3 className="text-3xl italic tracking-tighter border-b border-[#E8B4B8]/20 pb-6 font-serif text-white/90">HORS D'ŒUVRES</h3>
              <div className="space-y-6">
                <MenuItem title="Foie Gras de Canard" price="3200 ₽" desc="Террин из утиной фуа-гра, инжирный чатни, бриошь ручной работы, цветочная соль." />
                <MenuItem title="Tartare de Bœuf" price="2800 ₽" desc="Тартар из говядины Шароле, трюфельное эмульсия, воздушный крем из 36-месячного пармезана." />
                <MenuItem title="Escargots de Bourgogne" price="2100 ₽" desc="Бургундские улитки, запеченные с чесночным маслом, петрушкой и миндальной крошкой." />
                <MenuItem title="Soupe à l'Oignon Gratinée" price="1800 ₽" desc="Традиционный луковый суп на говяжьем бульоне, сыр Грюйер, хрустящий багет." />
                <MenuItem title="Huîtres Fine de Claire" price="3500 ₽" desc="Дюжина свежих устриц из Нормандии, винный уксус с шалотом, лимон." />
                <MenuItem title="Carpaccio de Saint-Jacques" price="2400 ₽" desc="Карпаччо из морского гребешка, икра форели, цитрусовая заправка, масло эстрагона." />
                <MenuItem title="Croquette de Canard" price="1600 ₽" desc="Хрустящие крокеты с томленой уткой конфи, горчичный соус с эстрагоном." />
              </div>
            </div>

            {/* Main Courses */}
            <div className="space-y-12">
              <h3 className="text-3xl italic tracking-tighter border-b border-[#E8B4B8]/20 pb-6 font-serif text-white/90">PLATS PRINCIPAUX</h3>
              <div className="space-y-6">
                <MenuItem title="Filet Mignon au Poivre" price="4500 ₽" desc="Филе миньон, соус из зеленого мадагаскарского перца, гратен дофинуа." />
                <MenuItem title="Loup de Mer" price="3900 ₽" desc="Филе дикого сибаса, пюре из корня сельдерея, соус бер-блан с шампанским." />
                <MenuItem title="Magret de Canard" price="3600 ₽" desc="Утиная грудка слабой прожарки, карамелизованная морковь, соус из старого портвейна." />
                <MenuItem title="Bœuf Bourguignon" price="3400 ₽" desc="Говяжьи щечки, томленые 12 часов в бургундском вине, жемчужный лук, пюре робушон." />
                <MenuItem title="Risotto aux Truffes Noires" price="3100 ₽" desc="Ризотто Акварелло с черным трюфелем Перигор, масло нуазетт, пармезан." />
                <MenuItem title="Homard Breton Rôti" price="5200 ₽" desc="Запеченный бретонский омар, спаржа на гриле, насыщенный соус биск с шафраном." />
                <MenuItem title="Côte de Veau" price="4800 ₽" desc="Каре теленка на кости, глазированные корнеплоды, соус на основе сморчков и сливок." />
              </div>
            </div>

            {/* Desserts */}
            <div className="space-y-12">
              <h3 className="text-3xl italic tracking-tighter border-b border-[#E8B4B8]/20 pb-6 font-serif text-white/90">DESSERTS</h3>
              <div className="space-y-6">
                <MenuItem title="Crème Brûlée à la Vanille" price="1200 ₽" desc="Классическое крем-брюле с мадагаскарской ванилью и теплой хрустящей корочкой." />
                <MenuItem title="Fondant au Chocolat" price="1400 ₽" desc="Горячий фондан из темного бельгийского шоколада, фисташковое мороженое." />
                <MenuItem title="Mille-Feuille" price="1500 ₽" desc="Милфей, тончайшее карамелизованное слоеное тесто, заварной крем на бурбонской ванили." />
                <MenuItem title="Tarte Tatin" price="1300 ₽" desc="Карамельный яблочный пирог 'Татен', домашняя сметана, щепотка морской соли." />
                <MenuItem title="Assiette de Fromages" price="2600 ₽" desc="Тарелка выдержанных французских сыров (Рокфор, Комте, Камамбер), мед, орехи." />
              </div>
            </div>

            {/* Wines */}
            <div className="space-y-12">
              <h3 className="text-3xl italic tracking-tighter border-b border-[#E8B4B8]/20 pb-6 font-serif text-white/90">VINS SÉLECTIONNÉS</h3>
              <div className="space-y-6">
                <MenuItem title="Chablis Grand Cru, 2018" price="18000 ₽" desc="Domaine William Fèvre. Элегантное, минеральное белое вино." />
                <MenuItem title="Château Margaux, 2015" price="145000 ₽" desc="Premier Grand Cru Classé. Объемное, сочное, с нотами черных ягод и фиалки." />
                <MenuItem title="Pouilly-Fumé, Baron de L 2019" price="22000 ₽" desc="De Ladoucette. Изысканный Совиньон Блан с нотами белых цветов и дыма." />
                <MenuItem title="Meursault, Les Clous 2020" price="28000 ₽" desc="Bouchard Père & Fils. Плотное, маслянистое Шардоне с оттенками жареного фундука." />
                <MenuItem title="Dom Pérignon, Vintage 2012" price="65000 ₽" desc="Премиальное шампанское с тонами бриоши, грейпфрута и тонким минеральным финишем." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WINE CAVE SECTION */}
      <section id="cave" className="py-32 px-6 md:px-12 border-b border-white/5 bg-[#050505] relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="md:w-1/2 space-y-10 z-10">
            <span className="text-[10px] font-bold text-[#E8B4B8] tracking-[0.3em] uppercase block mb-6">La Cave à Vin</span>
            <h2 className="text-[50px] md:text-[70px] leading-[0.9] font-black tracking-tighter italic font-serif text-[#EAEAEA]">
              ВИННАЯ <br/>КОМНАТА
            </h2>
            <div className="space-y-6 text-xs text-white/60 font-sans normal-case tracking-normal leading-loose max-w-md">
              <p>Гордость La Rose — уникальная коллекция, насчитывающая более 3000 бутылок редчайших винтажей в специально оборудованном погребе.</p>
              <p>Наш шеф-сомелье бережно собирал эту коллекцию по всей Франции, отдавая предпочтение небольшим артизанальным хозяйствам Бургундии, Шампани и Долины Роны. Откройте для себя идеальную пару к вашему ужину в камерной атмосфере нашей винной комнаты, доступной для приватных дегустаций.</p>
            </div>
            <div className="flex gap-12 pt-8 border-t border-white/10 w-max">
              <div>
                <div className="text-3xl font-light italic font-serif text-[#E8B4B8] mb-2">3000+</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/40">Бутылок в коллекции</div>
              </div>
              <div>
                <div className="text-3xl font-light italic font-serif text-[#E8B4B8] mb-2">350</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/40">Уникальных этикеток</div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full h-[500px] md:h-[700px] relative">
            <ParallaxImage 
              src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=1200" 
              alt="Wine Cellar" 
              className="w-full h-full rounded-sm opacity-80"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent z-10 md:hidden pointer-events-none"></div>
            <div className="absolute top-6 right-6 md:top-12 md:-left-12 z-20 transition-transform duration-1000 hover:scale-105">
               <div className="w-32 h-32 border border-[#E8B4B8]/30 rounded-full flex flex-col items-center justify-center p-2 backdrop-blur-md bg-[#0A0A0A]/40 shadow-2xl">
                   <span className="text-[8px] text-[#E8B4B8] text-center leading-tight tracking-[0.2em] uppercase">Private<br/>Tasting<br/>Room</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ELEGANT ANIMATED BLOCK: CHEF'S QUOTE */}
      <section className="py-40 px-6 md:px-12 bg-[#0A0A0A] relative overflow-hidden flex justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#E8B4B8]/50 to-transparent mx-auto mb-10"></div>
          <span className="text-[11px] font-bold text-[#E8B4B8] tracking-[0.3em] uppercase block mb-10">La Philosophie du Chef</span>
          <h3 className="text-3xl md:text-5xl font-light italic tracking-tight font-serif text-[#EAEAEA] leading-relaxed mb-12">
            « Гастрономия — это искусство запечатлеть мимолетность момента. Мы не просто готовим, мы сохраняем эмоции на тарелке, чтобы вы могли прожить их вновь. »
          </h3>
          <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">Антуан Дюбуа, Шеф-повар La Rose</p>
          <div className="w-px h-24 bg-gradient-to-t from-transparent via-[#E8B4B8]/50 to-transparent mx-auto mt-12"></div>
        </motion.div>
      </section>

      {/* RESERVATION SECTION */}
      <section id="reservation" className="py-40 px-6 md:px-12 flex flex-col items-center relative overflow-hidden bg-[#0A0A0A]">
        {/* Decorative Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#E8B4B8]/5 rounded-full pointer-events-none opacity-30"></div>
        
        <div className="max-w-3xl w-full relative z-10 flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-[#E8B4B8] tracking-[0.3em] uppercase block mb-6">Réservation</span>
          <h2 className="text-[60px] md:text-[90px] font-black tracking-tighter italic leading-[0.8] mb-12 font-serif text-[#EAEAEA]">
            ВАШ<br/>СТОЛ
          </h2>
          
          <div className="flex gap-12 text-[10px] uppercase tracking-widest text-[#E8B4B8] mb-16 justify-center">
            <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Paris, 1er arr.</span>
            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> 18:00 - 00:00</span>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-full text-left bg-[#0A0A0A] p-10 md:p-16 shadow-2xl relative z-20 border border-white/5">
              <div className="flex flex-col md:flex-row gap-10 border-b border-white/5 pb-10">
                <div className="flex-1 space-y-4">
                  <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-white/50 block font-sans">Имя</label>
                  <input required type="text" id="name" name="name" className="w-full bg-transparent border-b border-white/10 pb-3 text-white font-serif italic text-2xl md:text-3xl focus:outline-none focus:border-[#E8B4B8] transition-colors placeholder:text-white/10 normal-case" placeholder="Ваше имя" />
                </div>
                <div className="flex-1 space-y-4">
                  <label htmlFor="guests" className="text-[10px] uppercase tracking-[0.2em] text-white/50 block font-sans">Персоны</label>
                  <input required type="number" min="1" max="12" id="guests" name="guests" className="w-full bg-transparent border-b border-white/10 pb-3 text-white font-sans text-xl md:text-2xl focus:outline-none focus:border-[#E8B4B8] transition-colors placeholder:text-white/10" placeholder="2" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-10 pb-4">
                <div className="flex-1 space-y-4">
                  <label htmlFor="date" className="text-[10px] uppercase tracking-[0.2em] text-white/50 block font-sans">Дата</label>
                  <input required type="date" id="date" name="date" className="w-full bg-transparent border-b border-white/10 pb-3 text-white font-sans text-sm md:text-base focus:outline-none focus:border-[#E8B4B8] transition-colors cursor-pointer" />
                </div>
                <div className="flex-1 space-y-4">
                  <label htmlFor="time" className="text-[10px] uppercase tracking-[0.2em] text-white/50 block font-sans">Время</label>
                  <input required type="time" id="time" name="time" className="w-full bg-transparent border-b border-white/10 pb-3 text-white font-sans text-sm md:text-base focus:outline-none focus:border-[#E8B4B8] transition-colors cursor-pointer" />
                </div>
                <div className="flex-1 space-y-4">
                  <label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] text-white/50 block font-sans">Телефон</label>
                  <input required type="tel" id="phone" name="phone" className="w-full bg-transparent border-b border-white/10 pb-3 text-white font-sans text-sm md:text-base focus:outline-none focus:border-[#E8B4B8] transition-colors placeholder:text-white/10" placeholder="+33 1 23 45 67 89" />
                </div>
              </div>
              
              <div className="flex justify-center pt-8">
                <button disabled={isSubmitting} type="submit" className="w-full bg-white text-[#0A0A0A] hover:bg-[#E8B4B8] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <div className="py-6 px-8 flex justify-center items-center gap-4 relative z-10">
                    <span className="text-[11px] font-bold tracking-[0.3em] uppercase">
                      {isSubmitting ? 'ОЖИДАЙТЕ...' : 'ПОДТВЕРДИТЬ РЕЗЕРВ'}
                    </span>
                  </div>
                </button>
              </div>
            </form>
          ) : (
             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-16 md:p-24 border border-[#E8B4B8]/30 bg-[#E8B4B8]/5 text-center mt-8 shadow-2xl relative overflow-hidden w-full backdrop-blur-sm"
            >
              <div className="w-24 h-24 rounded-full border border-[#E8B4B8] border-dashed animate-spin-slow mb-10 flex justify-center items-center">
                <div className="w-3 h-3 bg-[#E8B4B8] rounded-full"></div>
              </div>
              <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-6 font-serif uppercase">MERCI</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-12 max-w-sm leading-relaxed">
                Ваш запрос передан метрдотелю.<br/>Ожидайте звонка для подтверждения.
              </p>
              <button onClick={() => setIsSubmitted(false)} className="text-[9px] font-medium text-white/60 border-b border-white/20 pb-2 cursor-pointer hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-all tracking-[0.2em] uppercase">
                НОВЫЙ ЗАПРОС
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050505] text-white pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
        {/* Glow effect on top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#E8B4B8]/30 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-32 bg-[#E8B4B8]/5 blur-[80px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1 }}
            className="mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter font-serif text-[#EAEAEA] mb-6">La Rose</h2>
            <div className="text-[10px] uppercase tracking-[0.5em] text-[#E8B4B8]">Paris</div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 w-full max-w-5xl mb-24 text-[10px] uppercase tracking-widest font-mono text-white/50">
            {/* Address */}
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-6 group cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#E8B4B8]/50 group-hover:bg-[#E8B4B8]/5 transition-colors duration-500"
              >
                <MapPin className="w-4 h-4 text-[#E8B4B8] transition-colors" />
              </motion.div>
              <span className="text-[#EAEAEA] text-[11px] font-bold">Адрес</span>
              <span className="leading-loose mt-2">15 Place Vendôme<br/>75001 Paris, France</span>
            </motion.div>
            
            {/* Working Hours */}
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-6 group md:border-x border-white/5 md:px-8 relative cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#E8B4B8]/50 group-hover:bg-[#E8B4B8]/5 transition-colors duration-500"
              >
                <Clock className="w-4 h-4 text-[#E8B4B8] transition-colors" />
              </motion.div>
              <span className="text-[#EAEAEA] text-[11px] font-bold">Часы работы</span>
              <span className="leading-loose mt-2">Вт - Сб: 18:00 - 00:00<br/>Вс - Пн: Закрыто</span>
            </motion.div>
            
            {/* Contact */}
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-6 group cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#E8B4B8]/50 group-hover:bg-[#E8B4B8]/5 transition-colors duration-500"
              >
                <Phone className="w-4 h-4 text-[#E8B4B8] transition-colors" />
              </motion.div>
              <span className="text-[#EAEAEA] text-[11px] font-bold">Контакты</span>
              <span className="leading-loose mt-2">+33 1 23 45 67 89<br/>RÉSERVATION@LAROSE.FR</span>
            </motion.div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center w-full pt-8 border-t border-white/5 text-[9px] uppercase tracking-[0.2em] text-white/30 gap-6">
            <div>© {new Date().getFullYear()} LA ROSE PARIS. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-[#E8B4B8] transition-colors">MICHELIN GUIDE</a>
              <a href="#" className="hover:text-[#E8B4B8] transition-colors">INSTAGRAM</a>
              <a href="#" className="hover:text-[#E8B4B8] transition-colors">MENTIONS LÉGALES</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

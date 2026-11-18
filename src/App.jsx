import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Gift, Home, Image, Sparkles, Gamepad2, Music2, Menu, Sun, Moon,
  Bell, ChevronDown, ChevronRight, Clock3, Star, Mail, Phone, Users,
  Mic, Play, Pause, Cake, WandSparkles, Heart, X, Send, Volume2,
  PartyPopper, Camera, MessageCircle, Clapperboard, Lightbulb
} from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home }, { label: 'Memories', icon: Image },
  { label: 'AI Wishes', icon: Sparkles }, { label: 'Gift Box', icon: Gift },
  { label: 'Games', icon: Gamepad2 }
];

const wishes = [
  { name: 'Your Friend', text: 'Stay happy always! You deserve all the happiness! ❤️', initials: 'A' },
  { name: 'Your Family', text: 'Keep dreaming big and making beautiful memories. We love you! 💙', initials: 'F' },
  { name: 'Your Coding Buddy', text: 'May your bugs be few and your ideas limitless. Keep building! 🚀', initials: '</>' }
];

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  // Demo target: 14 days from first render. Replace with the real birthday date in App.jsx.
  const target = useMemo(() => Date.now() + 14 * 86400000 + 23 * 3600000 + 45 * 60000, []);
  const distance = Math.max(0, target - now);
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    mins: Math.floor((distance / 60000) % 60),
    secs: Math.floor((distance / 1000) % 60)
  };
}

function Panel({ className = '', children, ...props }) {
  return <motion.section className={`glass-panel ${className}`} {...props}>{children}</motion.section>;
}

function CakeScene({ blown, onBlow }) {
  return <div className="cake-scene">
    <div className="birthday-script"><span>Happy</span><strong>Birthday!</strong></div>
    <div className="orbit orbit-one" /><div className="orbit orbit-two" />
    <div className="cake-platform"><div className="platform-ring" /><div className="platform-core" /></div>
    <div className="cake">
      <div className="candles">
        {Array.from({ length: 7 }).map((_, i) => <div className="candle" key={i}>
          {!blown && <span className="flame" style={{ animationDelay: `${i * .13}s` }} />}
        </div>)}
      </div>
      <div className="cake-top" />
      <div className="cake-body"><span className="icing-drip" /><span className="cake-heart">♥</span><span className="cake-word">Make a wish</span></div>
      <div className="cake-base" />
    </div>
    <div className="cake-spark spark-a">✦</div><div className="cake-spark spark-b">✧</div>
    <button className="blow-button" onClick={onBlow}><WindIcon /> {blown ? 'Relight candles' : 'Blow the candles'}</button>
  </div>;
}
function WindIcon(){ return <Sparkles size={16}/>; }

function Modal({ modal, close, onGift }) {
  if (!modal) return null;
  const content = {
    gift: { icon: Gift, title: 'A little surprise for you', body: 'You just unlocked a box full of good vibes, big dreams, and one very special birthday wish. 🎁', action: 'Open another surprise' },
    movie: { icon: Clapperboard, title: 'Your birthday movie', body: 'Your story deserves the big screen. Add your favourite photos and memories here to create a personal birthday film.', action: 'Got it!' },
    game: { icon: Gamepad2, title: 'Birthday mini challenge', body: 'Quick challenge: name one dream you want to make real this year. Your next level starts when you believe it. 🚀', action: 'I accept!' },
    memories: { icon: Camera, title: 'Memory universe', body: 'A gallery for favourite photos, funny moments, travel memories and unforgettable days. Add your own images to make it personal.', action: 'Lovely!' },
    wishes: { icon: Sparkles, title: 'AI birthday wishes', body: 'May this new chapter bring fearless ideas, kind people, exciting adventures and the courage to build everything you imagine. 💜', action: 'Thank you!' }
  }[modal];
  const Icon = content.icon;
  return <AnimatePresence><motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
    <motion.div className="modal-card" initial={{ y: 30, scale: .92 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: .95 }} onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={close}><X size={18}/></button>
      <div className="modal-icon"><Icon size={32}/></div><h2>{content.title}</h2><p>{content.body}</p>
      <button className="neon-button" onClick={modal === 'gift' ? onGift : close}>{content.action}<ChevronRight size={17}/></button>
    </motion.div>
  </motion.div></AnimatePresence>;
}

export default function App() {
  const [active, setActive] = useState('Home');
  const [dark, setDark] = useState(true);
  const [blown, setBlown] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [wishIndex, setWishIndex] = useState(0);
  const [modal, setModal] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState('');
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Hey Sathwik! 🎉 I’m your birthday AI buddy. Ready for a little magic?' }]);
  const [mobileNav, setMobileNav] = useState(false);
  const time = useCountdown();
  const [listening, setListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceReply, setVoiceReply] = useState('Systems online. Birthday celebration mode is ready.');
  const [voiceSupported, setVoiceSupported] = useState(true);

  const speak = (message) => {
    setVoiceReply(message);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.96;
      utterance.pitch = 0.88;
      utterance.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => /Google UK English Male|Microsoft David|Daniel|Alex/i.test(v.name));
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    }
    setMessages(prev => [...prev, { from: 'ai', text: message }]);
  };

  const runVoiceCommand = (rawCommand) => {
    const command = rawCommand.toLowerCase();
    setVoiceTranscript(rawCommand);
    if (/(open|show).*(memory|memories|gallery)/.test(command)) {
      setModal('memories'); speak('Opening your memory gallery. Let us revisit your favourite moments.');
    } else if (/(open|show).*(gift|present)/.test(command)) {
      setModal('gift'); speak('A surprise gift is ready. Opening your birthday gift.');
    } else if (/(play|start).*(game)/.test(command)) {
      setModal('game'); speak('Birthday game mode activated. Your next level starts now.');
    } else if (/(wish|birthday message|message)/.test(command)) {
      setModal('wishes'); speak('Happy Birthday, Sathwik! May your year be full of brilliant ideas, great friends and unforgettable adventures.');
    } else if (/(blow|extinguish).*(candle)/.test(command)) {
      setBlown(true); speak('Wish locked in. Candles blown. Make this year amazing!');
    } else if (/(light|relight).*(candle)/.test(command)) {
      setBlown(false); speak('Candles are glowing again. Make another wish!');
    } else if (/(dark|night) mode/.test(command)) {
      setDark(true); speak('Dark mode enabled. Looking sharp.');
    } else if (/(light|day) mode/.test(command)) {
      setDark(false); speak('Light mode enabled.');
    } else if (/(hello|hi|hey|jarvis)/.test(command)) {
      speak('Hello Sathwik. JARVIS-style birthday assistant at your service. What shall we do next?');
    } else if (/(time|clock)/.test(command)) {
      speak(`Your birthday dashboard is running. The countdown shows ${time.days} days, ${time.hours} hours, ${time.mins} minutes and ${time.secs} seconds.`);
    } else {
      speak(`I heard: ${rawCommand}. Try saying open memories, open gift, play a game, blow the candles, or switch to dark mode.`);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      speak('Voice recognition is not supported in this browser. Please use Chrome or Edge, or type your message instead.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => { setListening(true); setVoiceTranscript('Listening for your command…'); };
    recognition.onresult = (event) => runVoiceCommand(event.results[0][0].transcript);
    recognition.onerror = () => { setListening(false); speak('I could not catch that. Please try again.'); };
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    const userText = chatText.trim();
    setMessages(prev => [...prev, { from: 'you', text: userText }, { from: 'ai', text: `That’s awesome! ✨ I’m saving that positive energy for your next chapter. What else should we celebrate, Sathwik?` }]);
    setChatText('');
  };
  const chooseNav = (label) => {
    setActive(label); setMobileNav(false);
    if (label === 'Memories') setModal('memories');
    if (label === 'AI Wishes') setModal('wishes');
    if (label === 'Gift Box') setModal('gift');
    if (label === 'Games') setModal('game');
  };

  return <main className={`app-shell ${dark ? 'theme-dark' : 'theme-light'}`}>
    <div className="space-bg"><div className="nebula nebula-a"/><div className="nebula nebula-b"/><div className="stars"/></div>
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Gift size={30}/></div><div><b>NSJ Connect</b><span>Birthday Surprise</span></div></div>
      <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu/></button>
      <nav className={`top-nav ${mobileNav ? 'show' : ''}`}>
        {navItems.map(item => <button key={item.label} className={active === item.label ? 'active' : ''} onClick={() => chooseNav(item.label)}><item.icon size={17}/>{item.label}</button>)}
        <button onClick={() => setChatOpen(true)}><MessageCircle size={17}/> AI Buddy</button>
      </nav>
      <div className="top-actions"><span className="online"><i/> Online</span><button className="icon-button" aria-label="Notifications"><Bell size={18}/><i/></button><button className="theme-toggle" onClick={() => setDark(!dark)}>{dark ? <Sun size={17}/> : <Moon size={17}/>}</button><div className="profile-avatar">S</div><ChevronDown size={15}/></div>
    </header>

    <div className="dashboard-grid">
      <aside className="left-column">
        <Panel className="countdown-panel">
          <div className="panel-title"><Clock3/><b>Countdown to Your Birthday</b></div>
          <div className="countdown-grid">{[['days',time.days],['hours',time.hours],['min',time.mins],['sec',time.secs]].map(([label,value]) => <div className="time-cell" key={label}><strong>{String(value).padStart(2,'0')}</strong><span>{label}</span></div>)}</div>
          <div className="countdown-note">A special day is near! 🎂</div>
          <div className="progress-track"><span/></div>
        </Panel>
        <Panel className="memories-panel">
          <div className="panel-title"><Star className="gold"/><b>Your Memories</b><button className="view-link" onClick={() => setModal('memories')}>View All <ChevronRight size={14}/></button></div>
          <div className="memory-stack">
            <div className="memory-photo photo-one"><span>Good times</span></div>
            <div className="memory-photo photo-two"><span>Little wins</span></div>
            <div className="memory-photo photo-three"><span>Big dreams</span></div>
          </div>
          <p className="memory-caption">Beautiful memories together <span>♥</span></p>
        </Panel>
      </aside>

      <section className="center-column">
        <div className="welcome-line"><span>✦</span> A day made just for you <span>✦</span></div>
        <CakeScene blown={blown} onBlow={() => setBlown(!blown)}/>
        <button className="explore-button" onClick={() => setModal('gift')}>Explore Your Birthday Surprise <Gift size={18}/><ChevronRight size={17}/></button>
      </section>

      <aside className="right-column">
        <Panel className="ai-panel">
          <div className="panel-title"><Sparkles/><b>A Special Message for You 💗</b><button className="tiny-arrow" onClick={() => setChatOpen(true)}><ChevronRight/></button></div>
          <div className="ai-content"><div className="robot"><div className="robot-face"><i/><i/><span/></div><div className="robot-heart">♥</div></div><div className="speech-bubble"><p>Happy Birthday, Sathwik! 🎉 You are amazing, talented and truly special. Keep shining always!</p><b>— Your AI Friend 💗</b></div></div>
          <div className="voice-row"><button onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button><div className={`waveform ${playing ? 'is-playing' : ''}`}>{Array.from({length: 28}).map((_,i)=><i key={i} style={{'--h':`${8 + (i*13)%23}px`}}/>)}</div><Volume2 size={16}/></div>
        </Panel>
        <Panel className="wishes-panel">
          <div className="panel-title"><Heart className="pink"/><b>Birthday Wishes</b><button className="view-link" onClick={() => setModal('wishes')}>View All <ChevronRight size={14}/></button></div>
          <div className="wish-card"><div className="wish-avatar">{wishes[wishIndex].initials}</div><div><p>{wishes[wishIndex].text}</p><span>— {wishes[wishIndex].name}</span></div></div>
          <div className="wish-controls"><button onClick={() => setWishIndex((wishIndex + 2) % 3)}>‹</button><div>{wishes.map((_,i)=><i key={i} className={wishIndex===i?'selected':''}/>)}</div><button onClick={() => setWishIndex((wishIndex + 1) % 3)}>›</button></div>
        </Panel>
        <Panel className="stats-panel">
          <div className="panel-title"><span className="bars-icon">▥</span><b>Your Stats</b></div>
          <div className="stats-grid"><div><Mail/><strong>128</strong><span>Messages</span></div><div><Phone/><strong>24</strong><span>Calls</span></div><div><Users/><strong>36</strong><span>Friends</span></div></div>
        </Panel>
      </aside>

      <section className="quick-actions">
        <button className="quick-card" onClick={() => setBlown(!blown)}><span className="quick-icon cake-icon"><Cake/></span><b>{blown ? 'Relight Candles' : 'Blow the Candles'}</b><small>Make a Wish!</small><ChevronRight/></button>
        <button className="quick-card" onClick={() => setModal('gift')}><span className="quick-icon"><Gift/></span><b>Open Your Gift</b><small>Discover Surprises!</small><ChevronRight/></button>
        <button className="quick-card" onClick={() => setModal('game')}><span className="quick-icon blue"><Gamepad2/></span><b>Play Birthday Games</b><small>Have Fun!</small><ChevronRight/></button>
        <button className="quick-card" onClick={() => setModal('movie')}><span className="quick-icon"><Clapperboard/></span><b>Watch Your Birthday Movie</b><small>Enjoy the Story!</small><ChevronRight/></button>
      </section>
    </div>

    <button className="chat-fab jarvis-fab" onClick={() => setChatOpen(!chatOpen)}><WandSparkles/><span>Activate JARVIS</span></button>
    <AnimatePresence>{chatOpen && <motion.aside className="chat-window jarvis-window" initial={{opacity:0,y:24,scale:.94}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20}}>
      <div className="chat-head"><div className="mini-bot jarvis-mini"><WandSparkles size={17}/></div><div><b>NSJ // BIRTHDAY AI</b><span>Voice interface · Systems online</span></div><span className="jarvis-status"><i/> ONLINE</span><button onClick={() => setChatOpen(false)}><X size={18}/></button></div>
      <div className="jarvis-core-wrap"><div className={`jarvis-core ${listening ? 'listening' : ''}`}><div className="core-ring ring-a"/><div className="core-ring ring-b"/><div className="core-ring ring-c"/><div className="core-center"><WandSparkles size={31}/></div><span className="core-dot dot-a"/><span className="core-dot dot-b"/><span className="core-dot dot-c"/></div><div className="jarvis-state">{listening ? 'LISTENING…' : 'READY FOR COMMAND'}</div></div>
      <div className="jarvis-reply"><span>ASSISTANT RESPONSE</span><p>{voiceReply}</p>{voiceTranscript && <small>YOU SAID: “{voiceTranscript}”</small>}</div>
      <div className="voice-command-chips"><button onClick={() => runVoiceCommand('Open memories')}>Memories</button><button onClick={() => runVoiceCommand('Open gift')}>Open gift</button><button onClick={() => runVoiceCommand('Blow the candles')}>Blow candles</button></div>
      <button className={`jarvis-mic ${listening ? 'is-listening' : ''}`} onClick={startListening}><Mic size={20}/><span>{listening ? 'Listening…' : 'Tap to speak'}</span></button>
      {!voiceSupported && <small className="voice-warning">Voice input unavailable here. Use the text assistant below.</small>}
      <div className="chat-messages jarvis-history">{messages.slice(-4).map((m,i)=><div className={`chat-message ${m.from}`} key={i}>{m.text}</div>)}</div>
      <form onSubmit={sendMessage}><input value={chatText} onChange={e=>setChatText(e.target.value)} placeholder="Or type a command…"/><button><Send size={17}/></button></form>
    </motion.aside>}</AnimatePresence>
    <Modal modal={modal} close={() => setModal(null)} onGift={() => setModal('wishes')}/>
    <div className="footer-note"><span>✦</span> Made with love, code & a little bit of magic <Heart size={12}/></div>
  </main>;
}
import React from 'react';
import { useOS } from '../hooks/useOS';
import { BookOpen, Calendar, Book, Clock, CheckCircle2, List } from 'lucide-react';
import { books } from '../lib/data/books';

export default function ReadingOS() {
  const { state } = useOS();

  const currentBook = books.find(b => {
      const [start, end] = b.weeks.split('–').map(Number);
      return state.week >= start && state.week <= (end || start);
    });

  return (
    <div className="p-8 pb-24 max-w-5xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-[#059669] mb-2">
          <BookOpen size={24} />
          <h1 className="text-4xl font-bold tracking-tight">Reading OS</h1>
        </div>
        <p className="text-[#b0bac8] text-lg">Knowledge extraction as a rigorous sequence.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Current Reading */}
           {currentBook && (
             <section className="bg-gradient-to-br from-[#141519] to-[#0e0f12] border border-[#059669]/30 p-8 rounded-lg">
                <div className="text-[10px] font-mono text-[#059669] tracking-widest uppercase mb-4 flex items-center gap-2">
                   <Clock size={12} /> ACTIVE WEEK {currentBook.weeks}
                </div>
                <h2 className="text-3xl font-black mb-1">{currentBook.title}</h2>
                <p className="text-[#6b7280] mb-6">by {currentBook.author}</p>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                   <div className="border-l border-[#1c1e24] pl-4">
                      <h4 className="text-[10px] font-mono text-[#4b5563] uppercase mb-2">Linked Skill</h4>
                      <div className="text-sm font-bold">{currentBook.skill}</div>
                   </div>
                   <div className="border-l border-[#1c1e24] pl-4">
                      <h4 className="text-[10px] font-mono text-[#4b5563] uppercase mb-2">Key Action</h4>
                      <div className="text-sm font-bold">{currentBook.action}</div>
                   </div>
                </div>

                <button className="bg-[#059669] text-[#0e0f12] font-bold px-8 py-3 rounded flex items-center gap-2">
                   MARK CHAPTER COMPLETE <CheckCircle2 size={18} />
                </button>
             </section>
           )}

           <section>
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-4">Book Schedule</h3>
              <div className="space-y-4">
                {books.map(b => (
                  <div key={b.title} className={`p-4 rounded-md flex justify-between items-center ${b.title === currentBook?.title ? 'bg-[#1c1e24] border border-[#059669]/20' : 'bg-[#141519] opacity-60 grayscale'}`}>
                     <div>
                        <div className="text-[10px] font-mono text-[#4b5563]">WEEKS {b.weeks}</div>
                        <div className="font-bold">{b.title}</div>
                        <div className="text-[11px] text-[#6b7280]">{b.author}</div>
                     </div>
                     {state.readingProgress[b.title] && <CheckCircle2 size={18} className="text-[#059669]" />}
                  </div>
                ))}
              </div>
           </section>
        </div>

        <aside className="space-y-8">
           <section className="bg-[#141519] border border-[#1c1e24] p-6 rounded-lg">
              <h3 className="text-xs font-mono tracking-widest text-[#6b7280] uppercase mb-4 flex items-center gap-2"><List size={14} /> Weekly Reading</h3>
              <div className="space-y-4">
                 <ReadingItem title="Paul Graham Essays" desc="Schlep Blindness -> How to Get Startup Ideas" />
                 <ReadingItem title="Farnam Street" desc="Mental Models series (1 article/week)" />
                 <ReadingItem title="Stratechery" desc="Ben Thompson analysis (1/week)" />
                 <ReadingItem title="Ministry of Commerce" desc="Last week's press releases: bilateral deals, FTAs" />
              </div>
           </section>

           <section className="bg-[#1c1e24] p-6 rounded-lg border border-[#343840]">
              <h4 className="text-[10px] font-mono text-[#6b7280] uppercase tracking-widest mb-4">Reading Protocol</h4>
              <ul className="space-y-2 text-[11px] text-[#b0bac8] leading-tight">
                 <li>• 30 min every morning</li>
                 <li>• Close book after session</li>
                 <li>• Write 5 sentences from memory</li>
                 <li>• Reopen and check gaps</li>
                 <li>• No second book until done</li>
              </ul>
           </section>
        </aside>
      </div>
    </div>
  );
}

function ReadingItem({ title, desc }) {
  return (
    <div className="group cursor-pointer">
       <div className="text-sm font-bold group-hover:text-[#059669] transition-colors">{title}</div>
       <div className="text-[10px] text-[#4b5563]">{desc}</div>
    </div>
  );
}

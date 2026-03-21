"use client";

import { motion } from "framer-motion";

export default function TempleSection() {
  return (
    <div 
      id="temple-section" 
      className="relative z-20 bg-[#0A0603] min-h-screen text-[#E8D5B0] pt-24 pb-12 border-t border-[#D4A843]/20"
    >
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-devanagari text-[#D4A843] text-2xl mb-4 tracking-widest"
          >
            ॥ श्री हनुमते नमः ॥
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-basgira text-4xl md:text-6xl text-[#F0C96B] mb-6 tracking-wider"
          >
            Shri Manas Mandir
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4A843] to-transparent mx-auto"
          />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          
          {/* About */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 border border-[#D4A843]/10 bg-[#12100A]/50 backdrop-blur-sm shadow-[0_0_30px_rgba(212,168,67,0.03)]"
          >
            <h3 className="font-basgira text-2xl text-[#D4A843] mb-6 tracking-widest border-b border-[#D4A843]/20 pb-4">
              Devotion & Service
            </h3>
            <p className="font-garamond text-lg leading-relaxed text-[#A89070]">
              Welcome to the sacred abode of Shri Bajrangbali. Established in devotion, 
              this temple stands as a beacon of faith, strength, and eternal devotion to Lord Ram. 
              Join us in our daily prayers and experience the profound peace that comes from His divine presence.
            </p>
          </motion.div>

          {/* Aarti Timings */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 border border-[#D4A843]/10 bg-[#12100A]/50 backdrop-blur-sm shadow-[0_0_30px_rgba(212,168,67,0.03)]"
          >
            <h3 className="font-basgira text-2xl text-[#D4A843] mb-6 tracking-widest border-b border-[#D4A843]/20 pb-4">
              Daily Aarti
            </h3>
            <div className="space-y-4 font-garamond text-lg tracking-wide text-[#A89070]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>Mangla Aarti</span>
                <span className="text-[#E8D5B0]">5:30 AM</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>Rajbhog Aarti</span>
                <span className="text-[#E8D5B0]">12:00 PM</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>Sandhya Aarti</span>
                <span className="text-[#E8D5B0]">7:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shayan Aarti</span>
                <span className="text-[#E8D5B0]">9:30 PM</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-[#D4A843]/60 italic font-garamond">
              * Special Sunderkand Path every Tuesday and Saturday at 6:00 PM.
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#D4A843]/20 pt-12 mt-12 text-center flex flex-col items-center">
          <div className="text-4xl text-[#D4A843] mb-6 font-devanagari">ॐ</div>
          <p className="font-basgira text-sm tracking-[0.3em] text-[#A89070]">
            Jai Bajrangbali
          </p>
        </div>
      </div>
    </div>
  );
}

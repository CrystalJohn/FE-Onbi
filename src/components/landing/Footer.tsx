'use client'

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface FooterProps {
  onTimerClick?: () => void;
}

export default function Footer({ onTimerClick }: FooterProps) {
  const { language } = useLanguage();

  const t = {
    en: {
      footnote1: '1. ONBI is a certified trademark of ONBI Tech. All rendered interactive prototypes, simulated hardware screens, and early membership passes are created for conceptual demonstration of the first physical MVP unit scheduled for production.',
      footnote2: '2. Zero-screen interaction and postural monitoring require an active internet connection and subscription. Postural camera is privacy-first, performing inference locally with zero cloud data storage.',
      coppa: 'EST. 2026 • COPPA Compliant',
      copyright: 'Copyright © 2026 ONBI Tech. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      sales: 'Sales Policy',
      legal: 'Legal',
      cols: [
        {
          title: 'Explore',
          links: [
            { label: 'Introduction', action: 'scroll', target: 'hero_section' },
            { label: 'Parent Problems', action: 'scroll', target: 'parent_problems_section' },
            { label: 'Smart Features', action: 'scroll', target: 'features_grid_section' },
            { label: 'Interactive Timer', action: 'timer' },
          ]
        },
        {
          title: 'Order & Pricing',
          links: [
            { label: 'Early Access Tiers', action: 'scroll', target: 'pricing_section' },
            { label: 'IoT Robot Bundle', action: 'scroll', target: 'pricing_section' },
            { label: 'Membership Benefits', action: 'scroll', target: 'pricing_section' },
          ]
        },
        {
          title: 'About ONBI',
          links: [
            { label: 'Meet the Founders', action: 'scroll', target: 'how_it_works_section' },
            { label: 'COPPA Compliance', action: 'scroll', target: 'hero_section' },
            { label: 'Our Vision', action: 'scroll', target: 'hero_section' },
          ]
        }
      ]
    },
    vi: {
      footnote1: '1. ONBI là thương hiệu đã đăng ký của ONBI Tech. Tất cả mô hình tương tác, mô phỏng phần cứng và thẻ thành viên sớm được tạo ra cho mục đích minh họa dòng sản phẩm vật lý MVP đầu tiên trước sản xuất.',
      footnote2: '2. Tính năng tương tác không màn hình và giám sát tư thế yêu cầu kết nối mạng và gói đăng ký hoạt động. Camera giám sát tư thế tuân thủ bảo mật tuyệt đối, suy luận trực tiếp tại thiết bị và không lưu trữ trên đám mây.',
      coppa: 'Thành lập 2026 • Tuân thủ COPPA',
      copyright: 'Bản quyền © 2026 ONBI Tech. Bảo lưu mọi quyền.',
      privacy: 'Chính sách bảo mật',
      terms: 'Điều khoản sử dụng',
      sales: 'Chính sách bán hàng',
      legal: 'Pháp lý',
      cols: [
        {
          title: 'Khám phá',
          links: [
            { label: 'Giới thiệu chung', action: 'scroll', target: 'hero_section' },
            { label: 'Vấn đề của ba mẹ', action: 'scroll', target: 'parent_problems_section' },
            { label: 'Tính năng thông minh', action: 'scroll', target: 'features_grid_section' },
            { label: 'Trình hẹn giờ thử', action: 'timer' },
          ]
        },
        {
          title: 'Đặt mua & Gói học',
          links: [
            { label: 'Đăng ký sớm', action: 'scroll', target: 'pricing_section' },
            { label: 'Bộ thiết bị IoT Robot', action: 'scroll', target: 'pricing_section' },
            { label: 'Đặc quyền thành viên', action: 'scroll', target: 'pricing_section' },
          ]
        },
        {
          title: 'Về dự án',
          links: [
            { label: 'Đội ngũ sáng lập', action: 'scroll', target: 'how_it_works_section' },
            { label: 'Chuẩn bảo mật COPPA', action: 'scroll', target: 'hero_section' },
            { label: 'Tầm nhìn phát triển', action: 'scroll', target: 'hero_section' },
          ]
        }
      ]
    }
  }[language];

  const handleLinkClick = (link: { action: string; target?: string }) => {
    if (link.action === 'scroll' && link.target) {
      const element = document.getElementById(link.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.action === 'timer' && onTimerClick) {
      onTimerClick();
    }
  };

  return (
    <footer className="landing-footer w-full bg-[#f5f5f7] text-[#86868b] text-[12px] font-normal leading-relaxed py-8 md:py-12 px-6 mt-16 border-t border-[#ccc9bf]/30">
      <div className="max-w-[1024px] mx-auto space-y-6">
        
        {/* ── FOOTNOTES / LEGAL NOTES ── */}
        <div className="space-y-2 border-b border-[#d2d2d7] pb-6 font-light text-[11px] leading-[1.6]">
          <p>{t.footnote1}</p>
          <p>{t.footnote2}</p>
        </div>

        {/* ── DIRECTORY COLS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
          {t.cols.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-semibold text-[#1d1d1f] tracking-tight">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="hover:text-[#1d1d1f] hover:underline cursor-pointer transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── BREADCRUMBS TRAIL (Apple signature) ── */}
        <div className="border-t border-[#d2d2d7] pt-5 flex items-center gap-1.5 text-[11px] font-light text-[#515154]">
          <span className="cursor-pointer hover:text-[#1d1d1f]" onClick={() => scrollToId('hero_section')}>ONBI</span>
          <span>&gt;</span>
          <span className="text-[#86868b]">Smart IoT Study Companion</span>
        </div>

        {/* ── COPYRIGHT & POLICY LINKS ── */}
        <div className="pt-2 flex flex-col lg:flex-row lg:justify-between gap-4 text-[11px] text-[#86868b] border-t border-[#d2d2d7]/50 pt-4 font-light">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>{t.copyright}</span>
            <span className="hidden sm:inline text-[#d2d2d7]">|</span>
            <span className="text-[#515154] font-medium">{t.coppa}</span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[#515154] font-light">
            <a href="#" className="hover:underline hover:text-[#1d1d1f]">{t.privacy}</a>
            <span className="text-[#d2d2d7]">|</span>
            <a href="#" className="hover:underline hover:text-[#1d1d1f]">{t.terms}</a>
            <span className="text-[#d2d2d7]">|</span>
            <a href="#" className="hover:underline hover:text-[#1d1d1f]">{t.sales}</a>
            <span className="text-[#d2d2d7]">|</span>
            <a href="#" className="hover:underline hover:text-[#1d1d1f]">{t.legal}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

// Small inline helper to avoid standard scrollTo reference errors
function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

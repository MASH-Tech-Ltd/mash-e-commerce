import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getTranslation, TranslationKeys } from '@/utils/translations';

async function getTheme() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/themes/get-theme`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

export default async function Footer() {
  const theme = await getTheme();
  
  const footerSettings = theme?.footer || {};
  const storeInfo = theme?.storeInfo;
  const language = theme?.language || 'en';
  const t = (key: TranslationKeys) => getTranslation(language, key);
  
  const contactInfo = {
    email: footerSettings.contactInfo?.email || '',
    phone: footerSettings.contactInfo?.phone || '',
    address: footerSettings.contactInfo?.address || ''
  };
  
  const socialLinks = { 
    facebook: footerSettings.socialLinks?.facebook || '', 
    youtube: footerSettings.socialLinks?.youtube || '', 
    tiktok: footerSettings.socialLinks?.tiktok || '' 
  };
  
  const policies = {
    aboutUs: footerSettings.policies?.aboutUs || '',
    privacyPolicy: footerSettings.policies?.privacyPolicy || '',
    termsAndConditions: footerSettings.policies?.termsAndConditions || '',
    returnPolicy: footerSettings.policies?.returnPolicy || ''
  };
  const copyrightText = `© ${new Date().getFullYear()} ${storeInfo?.name?.toUpperCase() || 'ELECTRONICS STORE'}. All rights reserved.`;


  return (
    <footer className="bg-white border-t border-gray-200 mt-12 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {/* Logo and Social */}
          <div className="col-span-2 md:col-span-1 flex flex-row items-center justify-between w-full md:flex-col md:items-start md:justify-start md:space-y-4 md:space-x-0 space-x-4">
            <div className="h-12 flex items-center justify-start shrink-0 gap-3">
               {storeInfo?.logo ? (
                 <img src={storeInfo.logo} alt={storeInfo.name} className="max-h-12 object-contain rounded-sm" />
               ) : (
                 <>
                   <img src="/MEasy.png" alt="Logo" className="w-8 h-8 object-contain" />
                   <span className="font-black text-xl text-gray-900">{storeInfo?.name || 'ELECTRONICS STORE'}</span>
                 </>
               )}
            </div>
            
            {(socialLinks.facebook || socialLinks.youtube || socialLinks.tiktok) && (
              <div className="flex gap-2 sm:gap-3 shrink-0">
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all duration-300 border border-gray-100 hover:border-[#1877F2]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-[#FF0000] hover:text-white transition-all duration-300 border border-gray-100 hover:border-[#FF0000]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-black hover:text-white transition-all duration-300 border border-gray-100 hover:border-black">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Policies */}
          {(policies.aboutUs || policies.privacyPolicy || policies.termsAndConditions || policies.returnPolicy) && (
            <div className="col-span-1">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase">{t('policies')}</h3>
              <ul className="space-y-3">
                {policies.aboutUs && <li><a href={policies.aboutUs} className="text-sm text-gray-500 hover:text-primary transition-colors">{t('aboutUs')}</a></li>}
                {policies.privacyPolicy && <li><a href={policies.privacyPolicy} className="text-sm text-gray-500 hover:text-primary transition-colors">{t('privacyPolicy')}</a></li>}
                {policies.termsAndConditions && <li><a href={policies.termsAndConditions} className="text-sm text-gray-500 hover:text-primary transition-colors">{t('termsAndConditions')}</a></li>}
                {policies.returnPolicy && <li><a href={policies.returnPolicy} className="text-sm text-gray-500 hover:text-primary transition-colors">{t('returnPolicy')}</a></li>}
              </ul>
            </div>
          )}

          {/* Contact Us */}
          {(contactInfo.email || contactInfo.phone || contactInfo.address) && (
            <div className="col-span-1 break-words">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase">{t('contactUs')}</h3>
              <ul className="space-y-3">
                {contactInfo.email && (
                  <li className="flex items-start text-sm text-gray-500">
                    <Mail size={16} className="mr-2 mt-0.5 text-gray-400" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">{contactInfo.email}</a>
                  </li>
                )}
                {contactInfo.phone && (
                  <li className="flex items-start text-sm text-gray-500">
                    <Phone size={16} className="mr-2 mt-0.5 text-gray-400" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary transition-colors">{contactInfo.phone}</a>
                  </li>
                )}
                {contactInfo.address && (
                  <li className="flex items-start text-sm text-gray-500">
                    <MapPin size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{contactInfo.address}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-100 pt-6 text-center flex flex-col items-center gap-1">
          <p className="text-xs text-gray-400">{copyrightText}</p>
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Developed by <a href="https://mash-tech-ltd.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">MASH TECH</a></p>
        </div>
      </div>
    </footer>
  );
}

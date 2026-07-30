"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Search, 
  Smartphone, 
  Monitor, 
  Code, 
  FileText, 
  Eye, 
  ArrowLeft, 
  Check, 
  Copy, 
  Tag, 
  UserCheck, 
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { EMAIL_TEMPLATES, EMAIL_GROUPS, EmailTemplateItem } from '@/data/emailTemplatesData';
import { 
  LOGO_PRIMARY_BASE64, 
  LOGO_WHITE_BASE64, 
  LOGO_PURPLE_BASE64,
  LOGO_PRIMARY_URL,
  LOGO_WHITE_URL,
  LOGO_PURPLE_URL
} from '@/lib/logoAssets';

export default function EmailGalleryPage() {
  const [selectedId, setSelectedId] = useState<string>(EMAIL_TEMPLATES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'visual' | 'text' | 'code'>('visual');
  const [logoVariant, setLogoVariant] = useState<'primary' | 'purple'>('primary');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter templates based on search query
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return EMAIL_TEMPLATES;
    const query = searchQuery.toLowerCase();
    return EMAIL_TEMPLATES.filter(t => 
      t.subject.toLowerCase().includes(query) ||
      t.trigger.toLowerCase().includes(query) ||
      t.audience.toLowerCase().includes(query) ||
      t.templateFile.toLowerCase().includes(query) ||
      t.sectionNumber.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group templates by their section header for organized rendering
  const groupedTemplates = useMemo(() => {
    return EMAIL_GROUPS.map(g => {
      const items = filteredTemplates.filter(t => t.category === g.id);
      return { group: g, items };
    }).filter(g => g.items.length > 0);
  }, [filteredTemplates]);

  const getHtmlWithLogoVariant = (html: string) => {
    let logoData = LOGO_PRIMARY_BASE64;
    if (logoVariant === 'purple') logoData = LOGO_PURPLE_BASE64;
    return html.replaceAll(LOGO_PRIMARY_BASE64, logoData);
  };

  const handleCopySubject = (id: string, subject: string) => {
    navigator.clipboard.writeText(subject);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollToTemplate = (id: string) => {
    setSelectedId(id);
    const el = document.getElementById(`email-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-100 text-slate-900 font-sans">
      {/* Top Fixed Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3.5 shrink-0 z-30 shadow-md">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard"
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 shrink-0"
            >
              <ArrowLeft size={14} />
              <span>Dashboard</span>
            </Link>
            <div className="h-5 w-px bg-slate-800" />
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  <span>drTalk Email Notifications Gallery</span>
                  <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    {EMAIL_TEMPLATES.length} Templates
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Source:{' '}
                  <a 
                    href="https://docs.google.com/document/d/1wLsQBrtSLH_91fkhQjjOBF7RQYeqx0FWsuaueKa2ZFU/edit?tab=t.0#heading=h.xpgaomp8k9bz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-1"
                  >
                    drtalk: Notifications
                    <ExternalLink size={12} />
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Controls: Logotype, Viewport & View Mode Select Dropdowns */}
          <div className="flex items-center space-x-3">
            {/* Logotype Select */}
            <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs shadow-inner hover:bg-slate-750 transition-colors">
              <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Logo:</span>
              <select
                value={logoVariant}
                onChange={(e) => setLogoVariant(e.target.value as 'primary' | 'purple')}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="primary" className="bg-slate-900 text-white">Primary (Orange / Purple)</option>
                <option value="purple" className="bg-slate-900 text-white">Purple</option>
              </select>
            </div>

            {/* Viewport Select */}
            <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs shadow-inner hover:bg-slate-750 transition-colors">
              {viewport === 'desktop' ? <Monitor size={14} className="text-indigo-400 shrink-0" /> : <Smartphone size={14} className="text-indigo-400 shrink-0" />}
              <select
                value={viewport}
                onChange={(e) => setViewport(e.target.value as 'desktop' | 'mobile')}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="desktop" className="bg-slate-900 text-white">Desktop (600px)</option>
                <option value="mobile" className="bg-slate-900 text-white">Mobile (375px)</option>
              </select>
            </div>

            {/* Mode Select */}
            <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs shadow-inner hover:bg-slate-750 transition-colors">
              {viewMode === 'visual' && <Eye size={14} className="text-emerald-400 shrink-0" />}
              {viewMode === 'text' && <FileText size={14} className="text-amber-400 shrink-0" />}
              {viewMode === 'code' && <Code size={14} className="text-cyan-400 shrink-0" />}
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'visual' | 'text' | 'code')}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="visual" className="bg-slate-900 text-white">Visual Mode</option>
                <option value="text" className="bg-slate-900 text-white">Plain Text</option>
                <option value="code" className="bg-slate-900 text-white">Razor Code</option>
              </select>
            </div>
          </div>

        </div>
      </header>

      {/* 2-Column Split Viewport: Left Sticky Navigation Sidebar + Right Independent Scrollable Feed */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* STICKY LEFT SIDEBAR: Email Categories Directory (Independent Scrollbar) */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
          {/* Search Box Header */}
          <div className="p-3.5 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search category, subject, file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Grouped Category Tree (Scrolls internally) */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {groupedTemplates.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No matching emails found.
              </div>
            ) : (
              groupedTemplates.map(({ group, items }) => (
                <div key={group.id} className="space-y-1">
                  {/* Category Section Title */}
                  <div className="bg-slate-100/90 text-slate-800 px-2.5 py-1.5 rounded border border-slate-200/80 flex items-center justify-between text-[11px] font-bold uppercase tracking-tight sticky top-0 backdrop-blur z-10">
                    <span>{group.title}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                      {items.length}
                    </span>
                  </div>

                  {/* Template Links under Category */}
                  <div className="space-y-0.5 pl-1">
                    {items.map(template => {
                      const isSelected = selectedId === template.id;
                      return (
                        <button
                          key={template.id}
                          onClick={() => scrollToTemplate(template.id)}
                          className={`w-full text-left p-2 rounded-lg transition-all border flex items-center justify-between group ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-medium'
                              : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="min-w-0 pr-2 space-y-0.5">
                            <div className="flex items-center space-x-1.5">
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                isSelected ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-700'
                              }`}>
                                {template.sectionNumber}
                              </span>
                              <span className={`text-xs truncate font-medium ${
                                isSelected ? 'text-white font-semibold' : 'text-slate-900'
                              }`}>
                                {template.subject}
                              </span>
                            </div>
                            <p className={`text-[10px] truncate ${
                              isSelected ? 'text-indigo-100' : 'text-slate-400'
                            }`}>
                              Trigger: {template.trigger}
                            </p>
                          </div>
                          <ChevronRight size={14} className={`shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                            isSelected ? 'opacity-100 text-white' : 'text-slate-400'
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* RIGHT MAIN AREA: Continuous Render Feed (Scrolls independently) */}
        <main className="flex-1 overflow-y-auto bg-slate-100/70 p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {groupedTemplates.map(({ group, items }) => (
              <section key={group.id} className="space-y-6">
                {/* Category Header */}
                <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
                  <h2 className="text-lg font-extrabold uppercase tracking-tight text-slate-900 flex items-center gap-3">
                    <span className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded font-mono font-bold">
                      Group {group.id}
                    </span>
                    <span>{group.title}</span>
                  </h2>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-3 py-1 rounded-full font-mono">
                    {items.length} templates
                  </span>
                </div>

                {/* Email Cards List */}
                <div className="space-y-10">
                  {items.map((template) => {
                    const isSelected = selectedId === template.id;
                    return (
                      <article 
                        key={template.id} 
                        id={`email-card-${template.id}`}
                        onClick={() => setSelectedId(template.id)}
                        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all scroll-mt-6 ${
                          isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md' : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {/* Email Card Meta Header */}
                        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center space-x-2">
                              <span className="bg-indigo-600 text-white font-mono font-extrabold text-xs px-2.5 py-1 rounded shadow-sm">
                                {template.sectionNumber}
                              </span>
                              <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                                DrTalk.WebApi.Main/Views/Templates/{template.templateFile}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopySubject(template.id, template.subject);
                              }}
                              className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                            >
                              {copiedId === template.id ? (
                                <>
                                  <Check size={14} className="text-emerald-400" />
                                  <span className="text-emerald-400 font-semibold">Subject Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  <span>Copy Subject</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Subject Line */}
                          <h3 className="text-base font-bold text-white tracking-tight">
                            Subject: <span className="text-indigo-300 font-normal">"{template.subject}"</span>
                          </h3>

                          {/* Metadata row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800/80">
                            <div className="flex items-center space-x-2 text-slate-300">
                              <Tag size={14} className="text-indigo-400 shrink-0" />
                              <span className="font-semibold text-slate-400">Trigger:</span>
                              <span className="font-medium text-white truncate">{template.trigger}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-300">
                              <UserCheck size={14} className="text-emerald-400 shrink-0" />
                              <span className="font-semibold text-slate-400">Audience:</span>
                              <span className="font-medium text-white truncate">{template.audience}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-300">
                              <Layers size={14} className="text-amber-400 shrink-0" />
                              <span className="font-semibold text-slate-400">Razor View:</span>
                              <span className="font-mono text-white truncate">{template.templateFile}</span>
                            </div>
                          </div>
                        </div>

                        {/* Rendered Email Body Area */}
                        <div className="p-6 md:p-8 bg-slate-100/60 flex justify-center items-center">
                          {viewMode === 'visual' && (
                            <div 
                              className={`transition-all duration-300 ${
                                viewport === 'desktop' 
                                  ? 'w-full max-w-[620px] bg-white rounded-xl shadow-lg border border-slate-300 p-2 overflow-hidden' 
                                  : 'w-[375px] bg-slate-900 rounded-[36px] shadow-2xl p-3 border-4 border-slate-800'
                              }`}
                            >
                              {viewport === 'mobile' && (
                                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
                              )}

                              <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-inner flex flex-col">
                                {/* Email Client Header */}
                                <div className="bg-slate-50 border-b border-slate-200 p-3 text-xs text-slate-600 space-y-1 font-sans">
                                  <div className="flex justify-between">
                                    <span className="font-semibold text-slate-700">From:</span>
                                    <span>drtalk Notifications &lt;no-reply@drtalk.com&gt;</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-semibold text-slate-700">To:</span>
                                    <span>alex.morgan@valleydental.com</span>
                                  </div>
                                  <div className="flex justify-between font-semibold text-slate-900 pt-1 border-t border-slate-200">
                                    <span>Subject:</span>
                                    <span className="text-indigo-950 font-bold">{template.subject}</span>
                                  </div>
                                </div>

                                {/* Actual Rendered Email iframe */}
                                <iframe
                                  title={template.subject}
                                  srcDoc={getHtmlWithLogoVariant(template.htmlContent)}
                                  className="w-full min-h-[520px] border-0 bg-white"
                                />
                              </div>
                            </div>
                          )}

                          {viewMode === 'text' && (
                            <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-sm p-6 font-mono text-xs space-y-3">
                              <div className="text-slate-500 font-bold border-b border-slate-100 pb-2">
                                Plain Text Content Fallback
                              </div>
                              <pre className="whitespace-pre-wrap leading-relaxed text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                {template.plainText}
                              </pre>
                            </div>
                          )}

                          {viewMode === 'code' && (
                            <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-xl shadow-lg p-6 font-mono text-xs space-y-3">
                              <div className="text-indigo-400 font-bold border-b border-slate-800 pb-2">
                                Razor Template Markup: DrTalk.WebApi.Main/Views/Templates/{template.templateFile}
                              </div>
                              <pre className="whitespace-pre-wrap text-slate-200 leading-relaxed overflow-x-auto bg-slate-900 p-4 rounded-lg border border-slate-800">
                                {template.htmlContent.trim()}
                              </pre>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

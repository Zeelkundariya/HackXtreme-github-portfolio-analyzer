import React from 'react';
import InputCard from "./InputCard";
import { GraphIcon, SearchIcon, RocketIcon, FlameIcon, CpuIcon, RepoIcon, PulseIcon } from "@primer/octicons-react";

function LandingPage({ onAnalyze, loading }) {
  const features = [
    {
      title: "Deterministic Audit",
      description: "Get a stabilized 0-100 'Engineering Authority' score that weights original work, community impact, and architectural depth.",
      icon: GraphIcon
    },
    {
      title: "Recruiter Simulator",
      description: "Interactive, AI-led technical deep-dives. Simulate a CTO audit based on your real repository telemetry.",
      icon: SearchIcon
    },
    {
      title: "Architectural X-Ray",
      description: "Visual tree mapping of repository structures to detect project organization levels and complexity.",
      icon: RepoIcon
    },
    {
      title: "Shadow Profile",
      description: "AI-driven gap analysis benchmarking your profile against Big Tech Staff-level engineering standards.",
      icon: PulseIcon
    },
    {
      title: "Revival Engine",
      description: "Generates a High-Fidelity Refactor Plan to turn stale code into portfolio-grade assets.",
      icon: RocketIcon
    },
    {
      title: "Impact Heatmap",
      description: "Deep-dive tracking using the GitHub Search API to map your entire technical history and momentum.",
      icon: FlameIcon
    }
  ];

  return (
    <div className="landing-page">
      <div className="landing-hero animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="animate-float" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--accent-color)', background: 'rgba(47, 129, 247, 0.1)', padding: '16px', borderRadius: '50%' }}>
          <CpuIcon size={48} />
        </div>
        <h1 className="hero-title" style={{ fontSize: '4rem' }}>GitHub Portfolio Analyzer</h1>
        <p className="hero-subtitle">
          Deconstruct your engineering DNA. Turn silent repositories into <span className="gradient-text-animated">Recruiter-Ready Proof</span>.
        </p>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.3s', width: '100%', maxWidth: '800px', zIndex: 10 }}>
        <div className="pulse-container">
          <InputCard onAnalyze={onAnalyze} loading={loading} />
        </div>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card animate-slide-up" key={index} style={{ animationDelay: `${0.4 + (index * 0.1)}s` }}>
            <div className="feature-icon-wrapper">
              <feature.icon size={24} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="value-prop-banner animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <p>
          "Your GitHub is full of silent repositories. Recruiters don’t have time to read your code. 
          GPA translates your raw commits into a deterministic, recruiter-ready engineering grade."
        </p>
      </div>

      <h2 className="section-title animate-slide-up" style={{ animationDelay: '0.9s' }}>How It Works</h2>
      
      <div className="steps-container animate-slide-up" style={{ animationDelay: '1.0s' }}>
        <div className="step-card">
          <div className="step-number">1</div>
          <h3>Link Profile</h3>
          <p>Enter your public GitHub username to initiate the scan.</p>
        </div>
        <div className="step-card">
          <div className="step-number">2</div>
          <h3>Engine Analysis</h3>
          <p>Our algorithm analyzes commits, structure, and technical debt.</p>
        </div>
        <div className="step-card">
          <div className="step-number">3</div>
          <h3>Get Verdict</h3>
          <p>Receive a Staff-level technical audit and revival plans.</p>
        </div>
      </div>

      <div className="narrative-section animate-slide-up" style={{ animationDelay: '1.0s' }}>
        <div className="narrative-block problem-text">
          <h3>The Problem</h3>
          <p>
            Recruiters spend an average of <strong>6 seconds</strong> scanning a resume. They don't have time to clone your repositories, 
            run your code locally, or read through your commit history. If your GitHub isn't instantly parseable and professional, 
            your best engineering work remains invisible.
          </p>
        </div>
        <div className="narrative-block solution-text">
          <h3>The Solution</h3>
          <p>
            GPA instantly translates thousands of your commits into a deterministic, Staff-level engineering grade. 
            We turn your raw repositories into recruiter-ready proof, highlighting your architectural depth and engineering velocity.
          </p>
        </div>
      </div>

      <h2 className="section-title animate-slide-up" style={{ animationDelay: '1.1s' }}>Frequently Asked Questions</h2>
      
      <div className="faq-grid animate-slide-up" style={{ animationDelay: '1.2s' }}>
        <div className="faq-card">
          <h4>How is the Authority Score calculated?</h4>
          <p>Our deterministic algorithm weights original work, architectural complexity (file tree depth), community impact (stars/forks), and commit discipline.</p>
        </div>
        <div className="faq-card">
          <h4>Does GPA store my code?</h4>
          <p>No. We only analyze public metadata via the GitHub API. We do not clone, store, or read your actual private source code.</p>
        </div>
        <div className="faq-card">
          <h4>What is the 'Shadow Profile'?</h4>
          <p>An AI-driven gap analysis that compares your current public profile against the common patterns seen in Big Tech Staff-level engineers.</p>
        </div>
        <div className="faq-card">
          <h4>How do Revival Plans work?</h4>
          <p>The engine detects "stale" but high-potential repositories and generates a high-fidelity refactor plan to turn them into portfolio-grade assets.</p>
        </div>
      </div>

      <div className="cta-banner animate-slide-up" style={{ animationDelay: '1.3s' }}>
        <h2>Ready to deconstruct your DNA?</h2>
        <p>Stop letting your best code gather dust. Get your technical audit now.</p>
        <div className="pulse-container" style={{ display: 'inline-block', width: '100%', maxWidth: '600px' }}>
          <InputCard onAnalyze={onAnalyze} loading={loading} />
        </div>
      </div>

      <footer className="landing-footer animate-slide-up" style={{ animationDelay: '1.4s' }}>
        <p>© {new Date().getFullYear()} GitHub Portfolio Analyzer.</p>
        <p>Developed for the HackXtreme Challenge by <a href="https://github.com/Zeelkundariya" target="_blank" rel="noreferrer">Zeel Kundariya</a></p>
      </footer>

    </div>
  );
}

export default LandingPage;


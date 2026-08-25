import { useState } from "react";
import InputCard from "./components/InputCard";
import ScoreCard from "./components/ScoreCard";
import ScoreHistory from "./components/ScoreHistory";
import RecruiterChat from "./components/RecruiterChat";
import VisualMap from "./components/VisualMap";
import ShadowProfile from "./components/ShadowProfile";
import RevivalEngine from "./components/RevivalEngine";
import ImpactHeatmap from "./components/ImpactHeatmap";
import LandingPage from "./components/LandingPage";
import { API_BASE_URL } from "./config";
import {
  GraphIcon,
  SearchIcon,
  RepoIcon,
  PulseIcon,
  RocketIcon,
  FlameIcon,
  HistoryIcon,
  AlertIcon
} from "@primer/octicons-react";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const analyze = async (input) => {
    // If user pastes a full URL (judge-proofing), extract just the username
    const username = input.includes("github.com/")
      ? input.split("github.com/").pop().split("/")[0].trim()
      : input.trim();

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Use dynamically configured API URL
      const res = await fetch(`${API_BASE_URL}/analyze/${username}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze profile.");
      }
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData({ ...result, lastUpdated: Date.now() });
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err.message === "Failed to fetch"
        ? "Could not connect to the backend server. Please ensure the backend is running on port 5001."
        : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="bg-glow"></div>

      {!data ? (
        <>
          <LandingPage onAnalyze={analyze} loading={loading} />

          {error && (
            <div className="card animate-fade-in" style={{
              borderColor: "var(--error-color)",
              color: "var(--error-color)",
              background: "rgba(248, 81, 73, 0.1)",
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: '800px',
              margin: '0 auto 20px auto'
            }}>
              <AlertIcon size={20} /> {error}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", marginTop: 40, color: "var(--text-secondary)" }}>
              <div className="loading-spinner" style={{
                width: 40, height: 40, border: "4px solid var(--border-color)", borderTopColor: "#58a6ff", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite"
              }}></div>
              <p>Analyzing profile... Recruiter bots are scanning 🔎</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </>
      ) : (
        <div className="animate-fade-in" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="hero-title" style={{ fontSize: '2rem', margin: 0, cursor: 'pointer' }} onClick={() => setData(null)}>GPA.</h2>
            <button onClick={() => {setData(null); setError(null);}} className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Analyze Another
            </button>
          </div>

          <nav style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'var(--glass-bg)',
            padding: '8px',
            borderRadius: '16px',
            gap: '8px',
            marginBottom: '48px',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            maxWidth: 'fit-content',
            margin: '0 auto 48px auto',
            backdropFilter: 'blur(20px)'
          }}>
            {[
              { id: 'dashboard', label: 'AUDIT', icon: GraphIcon },
              { id: 'interview', label: 'INTERVIEW', icon: SearchIcon },
              { id: 'xray', label: 'X-RAY', icon: RepoIcon },
              { id: 'gaps', label: 'GAP ANALYSIS', icon: PulseIcon },
              { id: 'revival', label: 'REVIVALS', icon: RocketIcon },
              { id: 'impact', label: 'IMPACT', icon: FlameIcon },
              { id: 'history', label: 'HISTORY', icon: HistoryIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
                  border: 'none',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  fontWeight: '800',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  letterSpacing: '1px',
                  boxShadow: activeTab === tab.id ? '0 4px 15px var(--accent-glow)' : 'none'
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>

          <main style={{ minHeight: '600px' }}>
            {activeTab === 'dashboard' && <ScoreCard data={data} />}
            {activeTab === 'history' && <ScoreHistory username={data.username} lastUpdated={data.lastUpdated} events={data.events || []} totalLifetimeContributions={data.totalLifetimeContributions} dailyContributions={data.dailyContributions30d || []} />}
            {activeTab === 'interview' && <RecruiterChat username={data.username} context={data} />}
            {activeTab === 'xray' && <VisualMap username={data.username} repos={data.allRepos || []} />}
            {activeTab === 'gaps' && <ShadowProfile username={data.username} data={data} />}
            {activeTab === 'revival' && <RevivalEngine username={data.username} repos={data.allRepos || []} />}
            {activeTab === 'impact' && <ImpactHeatmap username={data.username} events={data.events || []} />}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;

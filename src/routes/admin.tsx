import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  User, BookOpen, Code, Briefcase, FolderOpen, Award, ShieldCheck, 
  Key, Lock, LogOut, Download, GitBranch, Save, Plus, Trash2, Edit3, ArrowLeft 
} from "lucide-react";
import portfolioDataImport from "@/data.json";

// SHA-256 helper using Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [data, setData] = useState(portfolioDataImport);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentTab, setCurrentTab] = useState("personal");
  const [isModified, setIsModified] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);

  // Modal edit states
  const [modalType, setModalType] = useState<"experience" | "project" | "achievement" | "certification" | null>(null);
  const [modalIndex, setModalIndex] = useState<number>(-1);
  const [modalData, setModalData] = useState<any>(null);

  // Load configuration
  useEffect(() => {
    const savedToken = localStorage.getItem("gh_token") || "";
    setGithubToken(savedToken);
    
    // Check if session token exists
    const sessionAuth = sessionStorage.getItem("admin_auth") === "true";
    if (sessionAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await sha256(passwordInput);
    const expectedHash = data.settings?.adminPasswordHash || "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";
    
    if (hash === expectedHash) {
      setIsAuthenticated(true);
      setLoginError("");
      sessionStorage.setItem("admin_auth", "true");
    } else {
      setLoginError("Invalid password. Access denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    setPasswordInput("");
  };

  const updateField = (section: string, field: string, value: any) => {
    setData((prev) => {
      const copy = { ...prev } as any;
      copy[section][field] = value;
      return copy;
    });
    setIsModified(true);
  };

  const updateNestedField = (section: string, subSection: string, field: string, value: any) => {
    setData((prev) => {
      const copy = { ...prev } as any;
      if (!copy[section][subSection]) copy[section][subSection] = {};
      copy[section][subSection][field] = value;
      return copy;
    });
    setIsModified(true);
  };

  // Export & Download JSON
  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setIsModified(false);
  };

  // GitHub Auto-Commit
  const handleGitHubCommit = async () => {
    if (!githubToken.trim()) {
      alert("Please enter a GitHub Personal Access Token (PAT).");
      return;
    }

    localStorage.setItem("gh_token", githubToken);
    setIsCommitting(true);

    try {
      const owner = "CHERUPALLYKARTHIK";
      const repo = "Karthik-Portfolio";
      const filePath = "src/data.json";
      const branch = "main";
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

      // 1. Fetch current file to get SHA
      let sha = null;
      const getRes = await fetch(url, {
        headers: {
          "Authorization": `token ${githubToken}`,
          "Accept": "application/vnd.github.v3+json"
        }
      });

      if (getRes.status === 200) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      // 2. Put file content in base64
      const commitMsg = "Update portfolio content via Admin Dashboard";
      // UTF-8 safe base64 encoding
      const utf8Bytes = new TextEncoder().encode(JSON.stringify(data, null, 2));
      const contentBase64 = btoa(String.fromCharCode(...utf8Bytes));

      const putBody: any = {
        message: commitMsg,
        content: contentBase64,
        branch: branch
      };
      if (sha) {
        putBody.sha = sha;
      }

      const putRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `token ${githubToken}`,
          "Content-Type": "application/json",
          "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify(putBody)
      });

      if (putRes.ok) {
        setIsModified(false);
        alert("Successfully committed changes to GitHub repository! The site will automatically redeploy.");
      } else {
        const putErr = await putRes.json();
        throw new Error(putErr.message || "Failed to commit content to GitHub.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`GitHub Commit Error: ${err.message}`);
    } finally {
      setIsCommitting(false);
    }
  };

  // Experience form handlers
  const openExperienceModal = (index: number = -1) => {
    setModalType("experience");
    setModalIndex(index);
    if (index >= 0) {
      setModalData({ ...data.experience[index] });
    } else {
      setModalData({ company: "", role: "", period: "", bullets: [""] });
    }
  };

  const saveExperience = () => {
    setData((prev) => {
      const copy = { ...prev };
      const list = [...copy.experience];
      if (modalIndex >= 0) {
        list[modalIndex] = modalData;
      } else {
        list.push(modalData);
      }
      copy.experience = list;
      return copy;
    });
    setIsModified(true);
    setModalType(null);
  };

  const deleteExperience = (index: number) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      setData((prev) => {
        const copy = { ...prev };
        const list = [...copy.experience];
        list.splice(index, 1);
        copy.experience = list;
        return copy;
      });
      setIsModified(true);
    }
  };

  // Projects form handlers
  const openProjectModal = (index: number = -1) => {
    setModalType("project");
    setModalIndex(index);
    if (index >= 0) {
      setModalData({ ...data.projects[index] });
    } else {
      setModalData({
        n: `_${String(data.projects.length + 1).padStart(2, "0")}`,
        name: "",
        badge: "Project",
        badgeColor: "border-primary text-primary",
        tags: [],
        preview: { gradient: "from-teal-900 to-slate-900", emoji: "📁", label: "PREVIEW" },
        href: ""
      });
    }
  };

  const saveProject = () => {
    setData((prev) => {
      const copy = { ...prev };
      const list = [...copy.projects];
      if (modalIndex >= 0) {
        list[modalIndex] = modalData;
      } else {
        list.push(modalData);
      }
      copy.projects = list;
      return copy;
    });
    setIsModified(true);
    setModalType(null);
  };

  const deleteProject = (index: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setData((prev) => {
        const copy = { ...prev };
        const list = [...copy.projects];
        list.splice(index, 1);
        // Recalculate 'n' numbers
        copy.projects = list.map((item, idx) => ({
          ...item,
          n: `_${String(idx + 1).padStart(2, "0")}`
        }));
        return copy;
      });
      setIsModified(true);
    }
  };

  // Achievements handlers
  const openAchievementModal = (index: number = -1) => {
    setModalType("achievement");
    setModalIndex(index);
    if (index >= 0) {
      setModalData({ ...data.achievements[index] });
    } else {
      setModalData({ icon: "🏆", title: "", desc: "" });
    }
  };

  const saveAchievement = () => {
    setData((prev) => {
      const copy = { ...prev };
      const list = [...copy.achievements];
      if (modalIndex >= 0) {
        list[modalIndex] = modalData;
      } else {
        list.push(modalData);
      }
      copy.achievements = list;
      return copy;
    });
    setIsModified(true);
    setModalType(null);
  };

  const deleteAchievement = (index: number) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      setData((prev) => {
        const copy = { ...prev };
        const list = [...copy.achievements];
        list.splice(index, 1);
        copy.achievements = list;
        return copy;
      });
      setIsModified(true);
    }
  };

  // Certifications handlers
  const openCertificationModal = (index: number = -1) => {
    setModalType("certification");
    setModalIndex(index);
    if (index >= 0) {
      setModalData({ ...data.certifications[index] });
    } else {
      setModalData({ name: "", issuer: "", date: "" });
    }
  };

  const saveCertification = () => {
    setData((prev) => {
      const copy = { ...prev };
      const list = [...copy.certifications];
      if (modalIndex >= 0) {
        list[modalIndex] = modalData;
      } else {
        list.push(modalData);
      }
      copy.certifications = list;
      return copy;
    });
    setIsModified(true);
    setModalType(null);
  };

  const deleteCertification = (index: number) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      setData((prev) => {
        const copy = { ...prev };
        const list = [...copy.certifications];
        list.splice(index, 1);
        copy.certifications = list;
        return copy;
      });
      setIsModified(true);
    }
  };

  // Password Generation Utility
  const [newPasswordVal, setNewPasswordVal] = useState("");
  const [generatedHash, setGeneratedHash] = useState("");

  const handleHashGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordVal) return;
    const hash = await sha256(newPasswordVal);
    setGeneratedHash(hash);
  };

  const handleUpdatePasswordHash = () => {
    if (!generatedHash) return;
    setData((prev) => {
      const copy = { ...prev } as any;
      if (!copy.settings) copy.settings = {};
      copy.settings.adminPasswordHash = generatedHash;
      return copy;
    });
    setIsModified(true);
    alert("Local admin password hash has been updated! Remember to commit or download and save the JSON for the new password to take effect permanently.");
    setNewPasswordVal("");
    setGeneratedHash("");
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[hsl(0,0%,13%)] text-[hsl(0,0%,87%)] flex flex-col items-center justify-center p-6 relative select-text">
        <style>{`
          * { cursor: auto !important; }
        `}</style>
        
        <div className="absolute top-6 left-6">
          <a href="/" className="flex items-center gap-2 text-sm font-display uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to Site
          </a>
        </div>

        <div className="w-full max-w-md bg-[hsl(0,0%,19%)] rounded-xl border border-[hsl(0,0%,24%)] p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle neon accents */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
              <Lock size={28} />
            </div>
            <h1 className="font-display text-3xl uppercase tracking-wider text-primary">Karthik<span> Admin</span></h1>
            <p className="text-muted-foreground text-sm mt-2">Enter credentials to unlock secure dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Security Key</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors text-foreground tracking-widest placeholder-[hsl(0,0%,40%)]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary text-primary-foreground font-display uppercase tracking-widest text-sm font-semibold hover:bg-primary/95 transition-all shadow-md active:scale-[0.98]"
            >
              Unlock Terminal
            </button>

            {loginError && (
              <div className="p-3 text-xs bg-red-950/40 border border-red-500/30 rounded text-red-400 text-center">
                {loginError}
              </div>
            )}
          </form>

          <div className="mt-8 text-center text-xs text-muted-foreground border-t border-[hsl(0,0%,24%)] pt-6">
            Default passcode: <code className="text-secondary bg-[hsl(0,0%,13%)] px-1.5 py-0.5 rounded border border-[hsl(0,0%,24%)]">admin123</code>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(0,0%,13%)] text-[hsl(0,0%,87%)] flex flex-col select-text font-body">
      <style>{`
        * { cursor: auto !important; }
        input, textarea, select {
          background-color: hsl(0 0% 13%) !important;
          color: hsl(0 0% 87%) !important;
          border-color: hsl(0 0% 24%) !important;
        }
        input:focus, textarea:focus, select:focus {
          border-color: var(--primary) !important;
          outline: none !important;
        }
      `}</style>

      {/* Header bar */}
      <header className="bg-[hsl(0,0%,19%)] border-b border-[hsl(0,0%,24%)] sticky top-0 z-50">
        <div className="container-x py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="/" className="logo flex items-center gap-2">
              <ArrowLeft size={16} className="text-muted-foreground" />
              Karthik<span className="text-primary">Dashboard</span>
            </a>
            <span className="px-2 py-0.5 text-[10px] font-mono border border-primary/30 text-primary bg-primary/5 uppercase tracking-wider rounded">Secure Panel</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Git status indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs border ${
              isModified 
                ? "bg-amber-950/20 border-amber-500/30 text-amber-400" 
                : "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isModified ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}></span>
              <span className="font-mono">{isModified ? "Unsaved Changes" : "Synced Local Session"}</span>
            </div>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[hsl(0,0%,24%)] bg-[hsl(0,0%,13%)] hover:bg-[hsl(0,0%,24%)] text-xs uppercase tracking-wider transition-colors"
            >
              <Download size={13} /> Export JSON
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs uppercase tracking-wider transition-colors"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Connection & Git push widget bar */}
      <section className="bg-[hsl(0,0%,16%)] border-b border-[hsl(0,0%,24%)] py-4">
        <div className="container-x flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GitBranch size={14} className="text-primary" />
            <span>Target repository: <b>CHERUPALLYKARTHIK/Karthik-Portfolio</b> (branch: <b>main</b>)</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <input
              type="password"
              placeholder="GitHub PAT Token"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-full sm:w-56 bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary placeholder-[hsl(0,0%,40%)]"
            />
            <button
              onClick={handleGitHubCommit}
              disabled={isCommitting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-1.5 bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs font-semibold hover:bg-primary/95 transition-all disabled:opacity-50"
            >
              <Save size={13} /> {isCommitting ? "Committing..." : "Commit directly to GitHub"}
            </button>
          </div>
        </div>
      </section>

      {/* Main panel workspace grid */}
      <div className="container-x flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 py-8">
        
        {/* Navigation Sidebar */}
        <aside className="space-y-1">
          {[
            { id: "personal", label: "Personal Details", icon: User },
            { id: "about", label: "About Me", icon: BookOpen },
            { id: "stack", label: "My Stack", icon: Code },
            { id: "experience", label: "Work Experience", icon: Briefcase },
            { id: "projects", label: "Featured Projects", icon: FolderOpen },
            { id: "achievements", label: "Achievements", icon: Award },
            { id: "certifications", label: "Certifications", icon: ShieldCheck },
            { id: "password", label: "Password Settings", icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors text-left ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-[hsl(0,0%,19%)] hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Box */}
        <main className="bg-[hsl(0,0%,19%)] border border-[hsl(0,0%,24%)] rounded-xl p-6 sm:p-8 shadow-sm">
          
          {/* SECTION: Personal Details */}
          {currentTab === "personal" && (
            <div className="space-y-6">
              <div className="border-b border-[hsl(0,0%,24%)] pb-4">
                <h2 className="font-display text-2xl uppercase text-primary">Personal Details</h2>
                <p className="text-muted-foreground text-xs mt-1">Configure your primary contact information, stats, and socials.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.personal.name}
                    onChange={(e) => updateField("personal", "name", e.target.value)}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={data.personal.email}
                    onChange={(e) => updateField("personal", "email", e.target.value)}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={data.personal.phone}
                    onChange={(e) => updateField("personal", "phone", e.target.value)}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">CGPA Metric</label>
                  <input
                    type="text"
                    value={data.personal.cgpa}
                    onChange={(e) => updateField("personal", "cgpa", e.target.value)}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Projects Count</label>
                  <input
                    type="text"
                    value={data.personal.projectsCount}
                    onChange={(e) => updateField("personal", "projectsCount", e.target.value)}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Typing Roles (One per line)</label>
                <textarea
                  value={data.personal.roles.join("\n")}
                  onChange={(e) => updateField("personal", "roles", e.target.value.split("\n").filter(r => r.trim() !== ""))}
                  rows={4}
                  className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none font-mono"
                  placeholder="AI / ML Developer&#10;Full Stack Developer"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Short Biography Text</label>
                <textarea
                  value={data.personal.bio}
                  onChange={(e) => updateField("personal", "bio", e.target.value)}
                  rows={4}
                  className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="border-t border-[hsl(0,0%,24%)] pt-6 space-y-4">
                <h3 className="font-display text-lg uppercase tracking-wide text-secondary">Social Profiles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">GitHub Account URL</label>
                    <input
                      type="url"
                      value={data.personal.socials.github}
                      onChange={(e) => updateNestedField("personal", "socials", "github", e.target.value)}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">LinkedIn Account URL</label>
                    <input
                      type="url"
                      value={data.personal.socials.linkedin}
                      onChange={(e) => updateNestedField("personal", "socials", "linkedin", e.target.value)}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: About Me */}
          {currentTab === "about" && (
            <div className="space-y-6">
              <div className="border-b border-[hsl(0,0%,24%)] pb-4">
                <h2 className="font-display text-2xl uppercase text-primary">About Me Section</h2>
                <p className="text-muted-foreground text-xs mt-1">Configure your main statement headings and descriptive paragraphs.</p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Bio Highlight Headline</label>
                <textarea
                  value={data.about.highlight}
                  onChange={(e) => updateField("about", "highlight", e.target.value)}
                  rows={3}
                  className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Grid Highlight Heading</label>
                <input
                  type="text"
                  value={data.about.heading}
                  onChange={(e) => updateField("about", "heading", e.target.value)}
                  className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none font-display text-lg tracking-wide"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">Intro Paragraphs (HTML tags like &lt;span className="text-foreground"&gt; allowed)</label>
                  <button
                    onClick={() => {
                      const list = [...data.about.paragraphs, ""];
                      updateField("about", "paragraphs", list);
                    }}
                    className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-primary hover:underline"
                  >
                    <Plus size={11} /> Add Paragraph
                  </button>
                </div>

                {data.about.paragraphs.map((para, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <textarea
                      value={para}
                      onChange={(e) => {
                        const list = [...data.about.paragraphs];
                        list[index] = e.target.value;
                        updateField("about", "paragraphs", list);
                      }}
                      rows={3}
                      className="flex-1 bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const list = [...data.about.paragraphs];
                        list.splice(index, 1);
                        updateField("about", "paragraphs", list);
                      }}
                      className="p-2 border border-red-500/20 rounded hover:bg-red-500/10 text-red-400 shrink-0"
                      title="Delete Paragraph"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: My Stack */}
          {currentTab === "stack" && (
            <div className="space-y-6">
              <div className="border-b border-[hsl(0,0%,24%)] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-display text-2xl uppercase text-primary">Technical Stack Categories</h2>
                  <p className="text-muted-foreground text-xs mt-1">Manage languages, tools, databases, and concept summaries.</p>
                </div>
                <button
                  onClick={() => {
                    setData((prev) => {
                      const copy = { ...prev };
                      copy.stack = [...copy.stack, { label: "New Category", items: [] }];
                      return copy;
                    });
                    setIsModified(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs uppercase tracking-wider hover:bg-primary/20"
                >
                  <Plus size={13} /> Add Category
                </button>
              </div>

              <div className="space-y-6">
                {data.stack.map((cat, idx) => (
                  <div key={idx} className="p-4 bg-[hsl(0,0%,16%)] border border-[hsl(0,0%,24%)] rounded-lg relative space-y-4">
                    <button
                      onClick={() => {
                        if (confirm("Delete this entire skill category?")) {
                          setData((prev) => {
                            const copy = { ...prev };
                            const list = [...copy.stack];
                            list.splice(idx, 1);
                            copy.stack = list;
                            return copy;
                          });
                          setIsModified(true);
                        }
                      }}
                      className="absolute top-4 right-4 p-1.5 hover:bg-red-500/10 border border-red-500/10 text-red-400 rounded"
                      title="Remove Category"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="w-2/3">
                      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Category Label</label>
                      <input
                        type="text"
                        value={cat.label}
                        onChange={(e) => {
                          setData((prev) => {
                            const copy = { ...prev };
                            const list = [...copy.stack];
                            list[idx] = { ...list[idx], label: e.target.value };
                            copy.stack = list;
                            return copy;
                          });
                          setIsModified(true);
                        }}
                        className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-1.5 text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Skills Tags (Comma-separated)</label>
                      <input
                        type="text"
                        value={cat.items.join(", ")}
                        onChange={(e) => {
                          setData((prev) => {
                            const copy = { ...prev };
                            const list = [...copy.stack];
                            list[idx] = { 
                              ...list[idx], 
                              items: e.target.value.split(",").map(i => i.trim()).filter(i => i !== "") 
                            };
                            copy.stack = list;
                            return copy;
                          });
                          setIsModified(true);
                        }}
                        placeholder="e.g. 🐍 Python, ⚛️ React, 🗄️ SQL"
                        className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: Experience */}
          {currentTab === "experience" && (
            <div className="space-y-6">
              <div className="border-b border-[hsl(0,0%,24%)] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-display text-2xl uppercase text-primary">Work Experience</h2>
                  <p className="text-muted-foreground text-xs mt-1">Configure internships, volunteering, and roles.</p>
                </div>
                <button
                  onClick={() => openExperienceModal()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs uppercase tracking-wider hover:bg-primary/20"
                >
                  <Plus size={13} /> Add Role
                </button>
              </div>

              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 bg-[hsl(0,0%,16%)] border border-[hsl(0,0%,24%)] rounded flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg uppercase leading-tight">{exp.role}</h3>
                      <p className="text-sm text-secondary font-medium mt-1">{exp.company} <span className="text-muted-foreground font-normal">({exp.period})</span></p>
                      <p className="text-xs text-muted-foreground mt-2">{exp.bullets.length} bullet description item(s)</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openExperienceModal(idx)}
                        className="p-2 border border-primary/20 hover:bg-primary/10 text-primary rounded shrink-0"
                        title="Edit Entry"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => deleteExperience(idx)}
                        className="p-2 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded shrink-0"
                        title="Delete Entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: Projects */}
          {currentTab === "projects" && (
            <div className="space-y-6">
              <div className="border-b border-[hsl(0,0%,24%)] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-display text-2xl uppercase text-primary">Featured Projects</h2>
                  <p className="text-muted-foreground text-xs mt-1">Manage displayed software projects and gradient preview settings.</p>
                </div>
                <button
                  onClick={() => openProjectModal()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs uppercase tracking-wider hover:bg-primary/20"
                >
                  <Plus size={13} /> Add Project
                </button>
              </div>

              <div className="space-y-4">
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-[hsl(0,0%,16%)] border border-[hsl(0,0%,24%)] rounded flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{proj.n}</span>
                        <h3 className="font-display text-lg uppercase leading-tight">{proj.name}</h3>
                        <span className={`text-[10px] uppercase px-1.5 py-0.5 border text-center ${proj.badgeColor || "border-primary text-primary"}`}>
                          {proj.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Tags: {proj.tags.join(" · ")}</p>
                      <p className="text-xs text-secondary/80 font-mono mt-1 select-all">{proj.href}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openProjectModal(idx)}
                        className="p-2 border border-primary/20 hover:bg-primary/10 text-primary rounded shrink-0"
                        title="Edit Project"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => deleteProject(idx)}
                        className="p-2 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded shrink-0"
                        title="Delete Project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: Achievements */}
          {currentTab === "achievements" && (
            <div className="space-y-6">
              <div className="border-b border-[hsl(0,0%,24%)] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-display text-2xl uppercase text-primary">Achievements & Awards</h2>
                  <p className="text-muted-foreground text-xs mt-1">Configure awards, scholarships, and hackathons.</p>
                </div>
                <button
                  onClick={() => openAchievementModal()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs uppercase tracking-wider hover:bg-primary/20"
                >
                  <Plus size={13} /> Add Entry
                </button>
              </div>

              <div className="space-y-4">
                {data.achievements.map((ach, idx) => (
                  <div key={idx} className="p-4 bg-[hsl(0,0%,16%)] border border-[hsl(0,0%,24%)] rounded flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl shrink-0">{ach.icon}</span>
                      <div>
                        <h3 className="font-display text-lg uppercase leading-tight">{ach.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{ach.desc}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openAchievementModal(idx)}
                        className="p-2 border border-primary/20 hover:bg-primary/10 text-primary rounded shrink-0"
                        title="Edit Entry"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => deleteAchievement(idx)}
                        className="p-2 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded shrink-0"
                        title="Delete Entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: Certifications */}
          {currentTab === "certifications" && (
            <div className="space-y-6">
              <div className="border-b border-[hsl(0,0%,24%)] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-display text-2xl uppercase text-primary">Professional Certifications</h2>
                  <p className="text-muted-foreground text-xs mt-1">Manage certifications and training course entries.</p>
                </div>
                <button
                  onClick={() => openCertificationModal()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs uppercase tracking-wider hover:bg-primary/20"
                >
                  <Plus size={13} /> Add Cert
                </button>
              </div>

              <div className="space-y-4">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 bg-[hsl(0,0%,16%)] border border-[hsl(0,0%,24%)] rounded flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg uppercase leading-tight">{cert.name}</h3>
                      <p className="text-sm text-secondary font-medium mt-1">{cert.issuer} <span className="text-muted-foreground font-normal">({cert.date})</span></p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openCertificationModal(idx)}
                        className="p-2 border border-primary/20 hover:bg-primary/10 text-primary rounded shrink-0"
                        title="Edit Cert"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => deleteCertification(idx)}
                        className="p-2 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded shrink-0"
                        title="Delete Cert"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: Password settings */}
          {currentTab === "password" && (
            <div className="space-y-6">
              <div className="border-b border-[hsl(0,0%,24%)] pb-4">
                <h2 className="font-display text-2xl uppercase text-primary">Passcode Hash Settings</h2>
                <p className="text-muted-foreground text-xs mt-1">Configure client-side secure login encryption.</p>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm leading-relaxed text-muted-foreground">
                The dashboard uses client-side SHA-256 validation to authenticate. To change your dashboard key:
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-xs">
                  <li>Enter a new password phrase below.</li>
                  <li>Click <b>"Generate Cryptographic Hash"</b>.</li>
                  <li>Click <b>"Save Generated Hash to config"</b> to write it to your session's JSON.</li>
                  <li>Click <b>"Commit directly to GitHub"</b> (at the top) to save changes permanently.</li>
                </ol>
              </div>

              <form onSubmit={handleHashGeneration} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">New Password Value</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="e.g. MySuperSecretPass!"
                      value={newPasswordVal}
                      onChange={(e) => setNewPasswordVal(e.target.value)}
                      className="flex-1 bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-secondary text-primary-foreground font-display text-xs uppercase tracking-wider hover:bg-secondary/90"
                    >
                      Generate Hash
                    </button>
                  </div>
                </div>
              </form>

              {generatedHash && (
                <div className="p-4 bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded-lg space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary mb-1">Generated SHA-256 Hex Digest</label>
                    <input
                      type="text"
                      readOnly
                      value={generatedHash}
                      className="w-full bg-[hsl(0,0%,16%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-xs font-mono select-all tracking-wider"
                    />
                  </div>
                  <button
                    onClick={handleUpdatePasswordHash}
                    className="w-full py-2.5 bg-primary text-primary-foreground font-display text-xs uppercase tracking-widest hover:bg-primary/95"
                  >
                    Save Generated Hash to config
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* CRUD Popups Overlay */}
      {modalType && modalData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[hsl(0,0%,19%)] border border-[hsl(0,0%,24%)] rounded-xl p-6 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]">
            
            <div className="border-b border-[hsl(0,0%,24%)] pb-3">
              <h3 className="font-display text-xl uppercase text-primary">
                {modalIndex >= 0 ? "Edit Entry" : "Create Entry"} ({modalType})
              </h3>
            </div>

            {/* Experience editor inside modal */}
            {modalType === "experience" && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted-foreground uppercase mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={modalData.company}
                    onChange={(e) => setModalData({ ...modalData, company: e.target.value })}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground uppercase mb-1">Professional Role</label>
                  <input
                    type="text"
                    value={modalData.role}
                    onChange={(e) => setModalData({ ...modalData, role: e.target.value })}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground uppercase mb-1">Active Duration (Period)</label>
                  <input
                    type="text"
                    value={modalData.period}
                    placeholder="e.g. Jul 2025 – Sep 2025"
                    onChange={(e) => setModalData({ ...modalData, period: e.target.value })}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-muted-foreground uppercase">Description Bullet Points</label>
                    <button
                      onClick={() => setModalData({ ...modalData, bullets: [...modalData.bullets, ""] })}
                      className="text-primary hover:underline text-[10px] uppercase"
                    >
                      + Add Bullet
                    </button>
                  </div>
                  {modalData.bullets.map((bullet: string, bIdx: number) => (
                    <div key={bIdx} className="flex gap-2 items-start">
                      <textarea
                        value={bullet}
                        onChange={(e) => {
                          const bullets = [...modalData.bullets];
                          bullets[bIdx] = e.target.value;
                          setModalData({ ...modalData, bullets });
                        }}
                        rows={2}
                        className="flex-1 bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-1.5 text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const bullets = [...modalData.bullets];
                          bullets.splice(bIdx, 1);
                          setModalData({ ...modalData, bullets });
                        }}
                        className="p-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project editor inside modal */}
            {modalType === "project" && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground uppercase mb-1">Index String</label>
                    <input
                      type="text"
                      value={modalData.n}
                      onChange={(e) => setModalData({ ...modalData, n: e.target.value })}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground uppercase mb-1">Project Name</label>
                    <input
                      type="text"
                      value={modalData.name}
                      onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground uppercase mb-1">Badge Title</label>
                    <input
                      type="text"
                      value={modalData.badge}
                      placeholder="e.g. Project / In Dev / Building"
                      onChange={(e) => setModalData({ ...modalData, badge: e.target.value })}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground uppercase mb-1">Badge Color class</label>
                    <input
                      type="text"
                      value={modalData.badgeColor}
                      placeholder="e.g. border-primary text-primary"
                      onChange={(e) => setModalData({ ...modalData, badgeColor: e.target.value })}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground uppercase mb-1">Hyperlink URL</label>
                  <input
                    type="url"
                    value={modalData.href}
                    onChange={(e) => setModalData({ ...modalData, href: e.target.value })}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground uppercase mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={modalData.tags.join(", ")}
                    onChange={(e) => setModalData({ ...modalData, tags: e.target.value.split(",").map(t => t.trim()).filter(t => t !== "") })}
                    placeholder="React, Firebase, TensorFlow"
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div className="border border-[hsl(0,0%,24%)] p-3 rounded-lg space-y-3">
                  <h4 className="font-semibold text-secondary uppercase text-[10px] tracking-wider">Hover Card Gradient & Visuals</h4>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-muted-foreground uppercase mb-1">Emoji Icon</label>
                      <input
                        type="text"
                        value={modalData.preview.emoji}
                        onChange={(e) => setModalData({ ...modalData, preview: { ...modalData.preview, emoji: e.target.value } })}
                        className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-1.5 text-sm focus:outline-none text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] text-muted-foreground uppercase mb-1">Card Label Text</label>
                      <input
                        type="text"
                        value={modalData.preview.label}
                        onChange={(e) => setModalData({ ...modalData, preview: { ...modalData.preview, label: e.target.value } })}
                        className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-1.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">Gradient Class (Tailwind format)</label>
                    <input
                      type="text"
                      value={modalData.preview.gradient}
                      placeholder="from-teal-900 to-slate-900"
                      onChange={(e) => setModalData({ ...modalData, preview: { ...modalData.preview, gradient: e.target.value } })}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-1.5 text-sm focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Achievement editor inside modal */}
            {modalType === "achievement" && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-[80px_1fr] gap-4">
                  <div>
                    <label className="block text-muted-foreground uppercase mb-1">Emoji</label>
                    <input
                      type="text"
                      value={modalData.icon}
                      onChange={(e) => setModalData({ ...modalData, icon: e.target.value })}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none text-center"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground uppercase mb-1">Achievement Heading</label>
                    <input
                      type="text"
                      value={modalData.title}
                      onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-muted-foreground uppercase mb-1">Detailed Description</label>
                  <textarea
                    value={modalData.desc}
                    onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                    rows={3}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Certification editor inside modal */}
            {modalType === "certification" && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted-foreground uppercase mb-1">Certification Name</label>
                  <input
                    type="text"
                    value={modalData.name}
                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                    className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground uppercase mb-1">Issuer Name</label>
                    <input
                      type="text"
                      value={modalData.issuer}
                      onChange={(e) => setModalData({ ...modalData, issuer: e.target.value })}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground uppercase mb-1">Issue Date</label>
                    <input
                      type="text"
                      value={modalData.date}
                      placeholder="e.g. May 2024"
                      onChange={(e) => setModalData({ ...modalData, date: e.target.value })}
                      className="w-full bg-[hsl(0,0%,13%)] border border-[hsl(0,0%,24%)] rounded px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-[hsl(0,0%,24%)]">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 border border-[hsl(0,0%,24%)] text-xs uppercase tracking-wider hover:bg-[hsl(0,0%,24%)]"
              >
                Cancel
              </button>
              
              <button
                onClick={() => {
                  if (modalType === "experience") saveExperience();
                  else if (modalType === "project") saveProject();
                  else if (modalType === "achievement") saveAchievement();
                  else if (modalType === "certification") saveCertification();
                }}
                className="px-5 py-2 bg-primary text-primary-foreground font-display text-xs uppercase tracking-widest hover:bg-primary/95"
              >
                Apply Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
